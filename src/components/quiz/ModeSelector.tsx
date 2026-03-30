'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Swords, Clock, Target, Loader2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { startSessionAction } from '@/actions/quiz.actions';

interface ModeInfo {
  id:    'PRACTICE' | 'SERIOUS';
  title: string;
  desc:  string;
  icon:  typeof BookOpen;
  color: string;
  perks: string[];
}

const MODES: ModeInfo[] = [
  {
    id:    'PRACTICE',
    title: 'Mode Latihan',
    desc:  'Belajar tanpa tekanan. Penjelasan langsung setelah menjawab.',
    icon:  BookOpen,
    color: '#39FF14',
    perks: ['✅ Tanpa timer', '✅ Pembahasan instan', '✅ Bisa coba ulang', '✅ Fokus belajar konsep'],
  },
  {
    id:    'SERIOUS',
    title: 'Mode Tryout',
    desc:  'Simulasi ujian nyata. Timer ketat, IRT score, naik tier.',
    icon:  Swords,
    color: '#FF006E',
    perks: ['⚡ Timer berjalan', '⚡ IRT Scoring', '⚡ Masuk Leaderboard', '⚡ Naik Tier'],
  },
];

interface Props {
  subtest: {
    id:           string;
    name:         string;
    emoji:        string;
    color:        string;
    timeLimit:    number;
    categoryName: string;
    questionCount:number;
  };
  recentSessions: {
    irtScore:    number;
    accuracy:    number;
    mode:        string;
    completedAt: string;
  }[];
}

export function ModeSelector({ subtest, recentSessions }: Props) {
  const router             = useRouter();
  const [selected, setSelected] = useState<'PRACTICE' | 'SERIOUS' | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    if (!selected) {
      toast.error('Pilih mode terlebih dahulu!');
      return;
    }

    startTransition(async () => {
      try {
        const { sessionId } = await startSessionAction(subtest.id, selected);
        router.push(`/quiz/session/${sessionId}`);
      } catch {
        toast.error('Gagal memulai sesi. Coba lagi.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/40 hover:text-white text-sm font-medium mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${subtest.color}20`, border: `1px solid ${subtest.color}40` }}
          >
            {subtest.emoji}
          </div>
          <div>
            <p className="text-white/50 text-sm">{subtest.categoryName}</p>
            <h1 className="text-white font-bold text-2xl leading-tight">{subtest.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {subtest.questionCount} soal tersedia
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {subtest.timeLimit} menit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div className="glass-card p-4">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Riwayat Kamu</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recentSessions.map((s, i) => (
              <div key={i} className="shrink-0 bg-surface-600/50 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
                <p className="text-xs text-white/40">{s.mode === 'PRACTICE' ? '📖' : '⚡'}</p>
                <p className="text-white font-bold text-lg">{s.irtScore}</p>
                <p className="text-white/40 text-[10px]">IRT Score</p>
                <p className="text-brand-neon-green text-xs font-semibold">{s.accuracy}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode selection */}
      <div>
        <p className="text-white/60 text-sm font-bold mb-3">Pilih Mode Belajar:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODES.map(mode => {
            const isSelected = selected === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setSelected(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden"
                style={{
                  borderColor: isSelected ? mode.color : 'rgba(255,255,255,0.1)',
                  background:  isSelected ? `${mode.color}12` : 'rgba(255,255,255,0.03)',
                  boxShadow:   isSelected ? `0 0 20px ${mode.color}25` : undefined,
                }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="mode-select"
                    className="absolute inset-0 rounded-[14px]"
                    style={{ background: `${mode.color}08` }}
                  />
                )}

                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${mode.color}20` }}
                    >
                      <mode.icon className="w-5 h-5" style={{ color: mode.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{mode.title}</h3>
                      {isSelected && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${mode.color}30`, color: mode.color }}
                        >
                          DIPILIH
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <p className="text-white/50 text-sm mb-3">{mode.desc}</p>

                  <ul className="space-y-1">
                    {mode.perks.map((p, j) => (
                      <li key={j} className="text-white/60 text-xs">{p}</li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Start button */}
      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleStart}
            disabled={isPending}
            className="btn-neon w-full py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Menyiapkan soal...</>
            ) : (
              <>{selected === 'PRACTICE' ? '📖 Mulai Latihan' : '⚡ Mulai Tryout'}</>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
