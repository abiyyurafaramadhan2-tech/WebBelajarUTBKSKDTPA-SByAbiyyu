'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useState, useCallback, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast }              from 'sonner';
import { AlertTriangle, X }   from 'lucide-react';
import { OptionCard }         from './OptionCard';
import { ExplanationBox }     from './ExplanationBox';
import { TimerRing }          from './TimerRing';
import { submitAnswerAction, finishSessionAction } from '@/actions/quiz.actions';
import { getOptionText, OPTION_KEYS } from '@/lib/utils';
import type { DifficultyLevel }       from '@prisma/client';

interface QuestionData {
  answerId:        string;
  questionId:      string;
  stem:            string;
  optionA:         string;
  optionB:         string;
  optionC:         string;
  optionD:         string;
  optionE:         string | null;
  topic:           string | null;
  imageUrl:        string | null;
  difficultyLevel: DifficultyLevel;
}

interface AnswerState {
  selectedOption:  string;
  isCorrect:       boolean;
  correctOption:   string;
  explanation:     string;
}

interface Props {
  sessionId:    string;
  mode:         'PRACTICE' | 'SERIOUS';
  timeLimitSec: number | null;
  questions:    QuestionData[];
  subtestName:  string;
  subtestEmoji: string;
  subtestColor: string;
}

const DIFF_COLOR: Record<DifficultyLevel, string> = {
  EASY:   '#39FF14',
  MEDIUM: '#FFD60A',
  HARD:   '#FF006E',
};
const DIFF_LABEL: Record<DifficultyLevel, string> = {
  EASY: 'Mudah', MEDIUM: 'Sedang', HARD: 'Sulit',
};

export function QuizArena({
  sessionId, mode, timeLimitSec, questions,
  subtestName, subtestEmoji, subtestColor,
}: Props) {
  const router  = useRouter();
  const [currentIdx, setCurrentIdx]  = useState(0);
  const [answerState, setAnswerState]= useState<AnswerState | null>(null);
  const [isAnswering, setIsAnswering]= useState(false);
  const [showQuit, setShowQuit]      = useState(false);
  const [isPending, startTransition] = useTransition();
  const [timeSpent, setTimeSpent]    = useState(0);
  const questionStartTime = useRef(Date.now());

  const current   = questions[currentIdx];
  const isLast    = currentIdx === questions.length - 1;
  const answered  = answerState !== null;
  const isPractice= mode === 'PRACTICE';

  const handleAnswer = useCallback(async (option: string) => {
    if (answered || isAnswering) return;
    setIsAnswering(true);

    const elapsed = Math.floor((Date.now() - questionStartTime.current) / 1000);

    try {
      const result = await submitAnswerAction(
        sessionId, current.questionId, option, elapsed
      );

      if (result.alreadyAnswered) return;

      if (isPractice) {
        setAnswerState({
          selectedOption: option,
          isCorrect:      result.isCorrect ?? false,
          correctOption:  result.correctOption ?? '',
          explanation:    result.explanation ?? '',
        });
        if (result.isCorrect) {
          toast.success('🎉 Jawaban Benar! +10 XP', { duration: 1500 });
        }
      } else {
        // Serious mode — just move on
        setAnswerState({
          selectedOption: option,
          isCorrect:      result.isCorrect ?? false,
          correctOption:  '',
          explanation:    '',
        });
        setTimeout(() => handleNext(), 800);
      }
    } catch {
      toast.error('Gagal mengirim jawaban');
    } finally {
      setIsAnswering(false);
    }
  }, [answered, isAnswering, sessionId, current, isPractice]);

  const handleNext = useCallback(() => {
    if (isLast) {
      startTransition(async () => {
        await finishSessionAction(sessionId, timeSpent);
      });
      return;
    }
    setAnswerState(null);
    setCurrentIdx(i => i + 1);
    setTimeSpent(t => t + Math.floor((Date.now() - questionStartTime.current) / 1000));
    questionStartTime.current = Date.now();
  }, [isLast, sessionId, timeSpent]);

  const handleTimerExpire = useCallback(() => {
    startTransition(async () => {
      await finishSessionAction(sessionId, timeLimitSec ?? 0);
    });
  }, [sessionId, timeLimitSec]);

  const getOptionState = (key: string) => {
    if (!answerState) return 'idle';
    if (key === answerState.correctOption && key === answerState.selectedOption) return 'correct';
    if (key === answerState.correctOption && isPractice) return 'reveal-correct';
    if (key === answerState.selectedOption && !answerState.isCorrect) return 'incorrect';
    return 'idle';
  };

  const options = OPTION_KEYS.filter(k =>
    k !== 'E' || current.optionE !== null
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface-900">

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-surface-900/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Quit button */}
          <button
            onClick={() => setShowQuit(true)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/50 text-xs font-semibold">{subtestEmoji} {subtestName}</span>
              <span className="text-white text-xs font-bold">{currentIdx + 1}/{questions.length}</span>
            </div>
            <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${subtestColor}, #C77DFF)` }}
                animate={{ width: `${((currentIdx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Timer (SERIOUS only) */}
          {mode === 'SERIOUS' && timeLimitSec && (
            <TimerRing
              totalSec={timeLimitSec}
              onExpire={handleTimerExpire}
              size={56}
              strokeWidth={5}
            />
          )}
        </div>
      </div>

      {/* Question */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-5"
          >
            {/* Question meta */}
            <div className="flex items-center gap-2 flex-wrap">
              {current.topic && (
                <span className="px-3 py-1 rounded-full bg-brand-neon/10 border border-brand-neon/20 text-brand-neon text-xs font-semibold">
                  📌 {current.topic}
                </span>
              )}
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `${DIFF_COLOR[current.difficultyLevel]}15`,
                  color:       DIFF_COLOR[current.difficultyLevel],
                  border:      `1px solid ${DIFF_COLOR[current.difficultyLevel]}30`,
                }}
              >
                {DIFF_LABEL[current.difficultyLevel]}
              </span>
              {mode === 'PRACTICE' && (
                <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs">
                  📖 Mode Latihan
                </span>
              )}
            </div>

            {/* Question stem */}
            <div className="glass-card p-6">
              <p className="text-white font-medium text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {current.stem}
              </p>
              {current.imageUrl && (
                <img
                  src={current.imageUrl}
                  alt="Gambar soal"
                  className="mt-4 rounded-xl max-h-64 object-contain"
                />
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {options.map((key, i) => (
                <OptionCard
                  key={key}
                  label={key}
                  text={getOptionText(current, key)}
                  state={getOptionState(key)}
                  disabled={answered || isAnswering || isPending}
                  onClick={() => handleAnswer(key)}
                  index={i}
                />
              ))}
            </div>

            {/* Explanation (Practice mode) */}
            {isPractice && answerState && (
              <ExplanationBox
                show={true}
                explanation={answerState.explanation}
                isCorrect={answerState.isCorrect}
              />
            )}

            {/* Next button */}
            <AnimatePresence>
              {answered && (isPractice || !isPractice) && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  disabled={isPending}
                  className="btn-neon w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isPending ? 'Menghitung hasil...' :
                   isLast    ? '🏆 Lihat Hasil'     : 'Soal Berikutnya →'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quit confirmation dialog */}
      <AnimatePresence>
        {showQuit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowQuit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 max-w-sm w-full text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-brand-neon-pink/20 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 text-brand-neon-pink" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Yakin ingin keluar?</h3>
                <p className="text-white/50 text-sm mt-1">Progress sesi ini tidak akan tersimpan.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuit(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all font-semibold text-sm"
                >
                  Lanjut Belajar
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-3 rounded-xl bg-brand-neon-pink/20 border border-brand-neon-pink/40 text-brand-neon-pink hover:bg-brand-neon-pink/30 transition-all font-semibold text-sm"
                >
                  Keluar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copyright */}
      <div className="text-center py-3 text-white/20 text-[10px]">
        © 2026 QuizGenius by Abiyyu Rafa Ramadhan
      </div>
    </div>
  );
}
