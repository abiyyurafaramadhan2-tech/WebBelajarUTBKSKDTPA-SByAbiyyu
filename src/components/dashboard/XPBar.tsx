'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';
import { getLevelFromXP, getXPForNextLevel } from '@/lib/xp';

interface XPBarProps {
  totalXP: number;
  level:   number;
}

export function XPBar({ totalXP, level }: XPBarProps) {
  const xpForNext   = getXPForNextLevel(level);
  const xpForCurrent= getXPForNextLevel(level - 1);
  const xpInLevel   = totalXP - xpForCurrent;
  const xpNeeded    = xpForNext - xpForCurrent;
  const progress    = Math.min(100, (xpInLevel / xpNeeded) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 rounded-xl bg-gradient-neon flex items-center justify-center text-surface-900 font-bold text-sm shadow-neon-purple"
          >
            {level}
          </motion.div>
          <div>
            <p className="text-white text-sm font-bold leading-none">Level {level}</p>
            <p className="text-white/40 text-[10px] mt-0.5">{totalXP.toLocaleString('id')} Total XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-brand-neon text-xs font-semibold">{xpInLevel.toLocaleString('id')} XP</p>
          <p className="text-white/30 text-[10px]">/{xpNeeded.toLocaleString('id')} XP</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="relative h-3 bg-surface-600 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full relative"
          style={{ background: 'linear-gradient(90deg, #6366f1, #C77DFF, #48CAE4)' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      <p className="text-white/30 text-[10px] mt-1.5 text-right">
        {Math.round(progress)}% ke Level {level + 1}
      </p>
    </div>
  );
}
