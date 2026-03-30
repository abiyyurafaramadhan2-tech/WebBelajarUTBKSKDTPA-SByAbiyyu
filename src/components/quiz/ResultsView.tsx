'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, Home, ChevronDown, ChevronUp, CheckCircle2, XCircle, Minus } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface Breakdown { correct:number; incorrect:number; skipped:number; total:number }

interface SessionData {
  id:          string;
  mode:        string;
  irtScore:    number;
  rawScore:    number;
  accuracy:    number;
  xpEarned:   number;
  timeSpentSec:number;
  subtestName: string;
  subtestEmoji:string;
  subtestColor:string;
  categoryName:string;
  breakdown:   Breakdown;
}

interface AnswerData {
  questionId:    string;
  stem:          string;
  selectedOption:string | null;
  correctOption: string;
  explanation:   string;
  isCorrect:     boolean;
  options:       Record<string, string | null>;
}

const getGrade = (accuracy: number) => {
  if (accuracy >= 90) return { label:'S', color:'#C77DFF', desc:'Sempurna!' };
  if (accuracy >= 80) return { label:'A', color:'#39FF14', desc:'Luar Biasa!' };
  if (accuracy >= 70) return { label:'B', color:'#48CAE4', desc:'Bagus!' };
  if (accuracy >= 60) return { label:'C', color:'#FFD60A', desc:'Cukup Baik' };
  if (accuracy >= 50) return { label:'D', color:'#FF6B35', desc:'Perlu Latihan' };
  return                      { label:'E', color:'#FF006E', desc:'Ayo Belajar!' };
};

export function ResultsView({ session, answers }: { session: SessionData; answers: AnswerData[] }) {
  const [showReview, setShowReview] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grade = getGrade(session.accuracy);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

      {/* Hero result card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="glass-card p-8 text-center relative overflow-hidden"
      >
        {/* BG glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-64 h-64 rounded-full blur-3xl"
            style={{ background: `${grade.color}15` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="relative">
          {/* Grade ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center border-4 relative"
            style={{
              borderColor: grade.color,
              background:  `${grade.color}15`,
              boxShadow:   `0 0 30px ${grade.color}40`,
            }}
          >
            <span className="text-5xl font-black" style={{ color: grade.color }}>
              {grade.label}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xl font-bold text-white mb-1">{grade.desc}</p>
            <p className="text-white/50 text-sm">
              {session.subtestEmoji} {session.subtestName} · {session.mode === 'PRACTICE' ? '📖 Latihan' : '⚡ Tryout'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Score grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Akurasi',   value:`${session.accuracy}%`,   color:'#C77DFF', emoji:'🎯' },
          { label:'IRT Score', value:`${session.irtScore}`,     color:'#48CAE4', emoji:'📊' },
          { label:'XP Dapat',  value:`+${session.xpEarned}`,   color:'#39FF14', emoji:'⚡' },
          { label:'Waktu',     value:formatTime(session.timeSpentSec), color:'#FFD60A', emoji:'⏱️' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-lg mb-1">{s.emoji}</p>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Rincian Jawaban</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Benar',   value:session.breakdown.correct,   icon:CheckCircle2, color:'#39FF14' },
            { label:'Salah',   value:session.breakdown.incorrect, icon:XCircle,      color:'#FF006E' },
            { label:'Dilewati',value:session.breakdown.skipped,   icon:Minus,        color:'#FFD60A' },
          ].map(item => (
            <div key={item.label} className="text-center p-4 rounded-xl" style={{ background:`${item.color}10` }}>
              <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color:item.color }} />
              <p className="text-2xl font-black" style={{ color:item.color }}>{item.value}</p>
              <p className="text-white/40 text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Review answers toggle */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}>
        <button
          onClick={() => setShowReview(v => !v)}
          className="w-full glass-card p-4 flex items-center justify-between text-white font-semibold hover:bg-white/5 transition-colors"
        >
          <span>📋 Review Jawaban ({answers.length} soal)</span>
          {showReview ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>

        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3 mt-3"
            >
              {answers.map((a, i) => (
                <div key={a.questionId} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedId(expandedId === a.questionId ? null : a.questionId)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      a.selectedOption === null ? 'bg-brand-neon-yellow/20' :
                      a.isCorrect ? 'bg-brand-neon-green/20' : 'bg-brand-neon-pink/20'
                    }`}>
                      {a.selectedOption === null
                        ? <Minus className="w-3 h-3 text-brand-neon-yellow" />
                        : a.isCorrect
                        ? <CheckCircle2 className="w-3 h-3 text-brand-neon-green" />
                        : <XCircle className="w-3 h-3 text-brand-neon-pink" />}
                    </div>
                    <span className="text-white/70 text-sm flex-1 truncate">
                      <span className="text-white/40 mr-2">{i + 1}.</span>
                      {a.stem.slice(0, 80)}{a.stem.length > 80 ? '...' : ''}
                    </span>
                    {expandedId === a.questionId
                      ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {expandedId === a.questionId && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        className="overflow-hidden border-t border-white/5"
                      >
                        <div className="p-4 space-y-3">
                          <p className="text-white text-sm leading-relaxed">{a.stem}</p>
                          <div className="space-y-2">
                            {(['A','B','C','D','E'] as const).filter(k => a.options[k]).map(key => {
                              const isCorrect  = key === a.correctOption;
                              const isSelected = key === a.selectedOption;
                              return (
                                <div key={key}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                                    isCorrect  ? 'bg-brand-neon-green/10 border border-brand-neon-green/30' :
                                    isSelected && !isCorrect ? 'bg-brand-neon-pink/10 border border-brand-neon-pink/30' :
                                    'bg-white/5'
                                  }`}
                                >
                                  <span className={`font-bold w-5 shrink-0 ${
                                    isCorrect ? 'text-brand-neon-green' :
                                    isSelected && !isCorrect ? 'text-brand-neon-pink' : 'text-white/40'
                                  }`}>{key}</span>
                                  <span className="text-white/70">{a.options[key]}</span>
                                  {isCorrect   && <CheckCircle2 className="w-3.5 h-3.5 text-brand-neon-green ml-auto shrink-0" />}
                                  {isSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 text-brand-neon-pink ml-auto shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                          {a.explanation && (
                            <div className="bg-brand-neon/5 border border-brand-neon/20 rounded-xl p-3">
                              <p className="text-brand-neon text-xs font-bold mb-1">💡 Pembahasan</p>
                              <p className="text-white/70 text-xs leading-relaxed">{a.explanation}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 pb-4"
      >
        <Link href="/dashboard" className="flex items-center justify-center gap-2 flex-1 py-4 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:border-white/30 font-bold transition-all glass-card">
          <Home className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/leaderboard" className="flex items-center justify-center gap-2 flex-1 py-4 rounded-2xl border border-brand-neon/30 text-brand-neon hover:bg-brand-neon/10 font-bold transition-all glass-card">
          <Trophy className="w-4 h-4" /> Leaderboard
        </Link>
        <Link href={`/quiz/${session.subtestName}`} className="flex items-center justify-center gap-2 flex-1 btn-neon py-4 rounded-2xl text-white font-bold">
          <RotateCcw className="w-4 h-4" /> Ulangi
        </Link>
      </motion.div>
    </div>
  );
                                                                                            }
