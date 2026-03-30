'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Minus, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface ScoreBoardProps {
  correct:     number;
  incorrect:   number;
  skipped:     number;
  total:       number;
  timeSpent?:  number;
  compact?:    boolean;
}

export function ScoreBoard({
  correct, incorrect, skipped, total, timeSpent, compact = false,
}: ScoreBoardProps) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const stats = [
    { label:'Benar',    value:correct,   icon:CheckCircle2, color:'#39FF14' },
    { label:'Salah',    value:incorrect, icon:XCircle,      color:'#FF006E' },
    { label:'Dilewati', value:skipped,   icon:Minus,        color:'#FFD60A' },
  ];

  return (
    <div className={`glass-card ${compact ? 'p-4' : 'p-6'}`}>
      {/* Accuracy ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
            <motion.circle
              cx="32" cy="32" r="28" fill="none"
              stroke="#C77DFF" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 28}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - accuracy / 100) }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ filter: 'drop-shadow(0 0 6px #C77DFF)' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-black text-sm">{accuracy}%</span>
          </div>
        </div>

        <div>
          <p className="text-white font-bold text-lg">Akurasi</p>
          <p className="text-white/50 text-sm">{correct} dari {total} benar</p>
          {timeSpent !== undefined && (
            <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {formatTime(timeSpent)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i + 0.5, type: 'spring' }}
            className="text-center py-3 rounded-xl"
            style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}
          >
            <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/40 text-[10px]">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
