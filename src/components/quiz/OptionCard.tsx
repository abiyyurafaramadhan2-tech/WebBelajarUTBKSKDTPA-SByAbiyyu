'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'reveal-correct';

interface OptionCardProps {
  label:     string;
  text:      string;
  state:     OptionState;
  disabled:  boolean;
  onClick:   () => void;
  index:     number;
}

const OPTION_COLORS = {
  A: 'from-violet-600 to-purple-600',
  B: 'from-blue-600 to-cyan-600',
  C: 'from-orange-600 to-amber-600',
  D: 'from-pink-600 to-rose-600',
  E: 'from-green-600 to-emerald-600',
};

export function OptionCard({
  label, text, state, disabled, onClick, index,
}: OptionCardProps) {
  const isCorrect       = state === 'correct' || state === 'reveal-correct';
  const isIncorrect     = state === 'incorrect';
  const isSelected      = state === 'selected';
  const isRevealCorrect = state === 'reveal-correct';

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay:    index * 0.08,
        type:     'spring',
        stiffness:300,
        damping:  25,
      }}
      whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'option-card w-full text-left flex items-center gap-4 group',
        isCorrect     && 'option-card correct',
        isIncorrect   && 'option-card incorrect animate-shake',
        isSelected    && 'option-card selected',
        disabled      && 'cursor-not-allowed opacity-80',
      )}
      aria-label={`Pilihan ${label}: ${text}`}
    >
      {/* Option label badge */}
      <motion.div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          'font-bold text-sm shrink-0 transition-all duration-300',
          'bg-gradient-to-br text-white shadow-md',
          OPTION_COLORS[label as keyof typeof OPTION_COLORS] || OPTION_COLORS.A,
          isCorrect   && 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-neon-green',
          isIncorrect && 'bg-gradient-to-br from-pink-600 to-rose-700 shadow-neon-pink',
        )}
        animate={isCorrect ? { scale: [1, 1.2, 1] } : {}}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {isCorrect   ? <Check className="w-4 h-4" /> :
         isIncorrect ? <X className="w-4 h-4" /> : label}
      </motion.div>

      {/* Option text */}
      <span className={cn(
        'flex-1 text-sm md:text-base font-medium leading-snug',
        'text-white/80 group-hover:text-white transition-colors',
        isCorrect && 'text-brand-neon-green font-semibold',
        isIncorrect && 'text-brand-neon-pink',
      )}>
        {text}
      </span>

      {/* Reveal correct indicator */}
      {isRevealCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs text-brand-neon-green font-bold px-2 py-1 rounded-full bg-brand-neon-green/20 border border-brand-neon-green/40 shrink-0"
        >
          Benar
        </motion.div>
      )}
    </motion.button>
  );
}
