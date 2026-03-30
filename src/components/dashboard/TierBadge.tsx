'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';
import { TIER_CONFIG, getTierProgress } from '@/lib/xp';
import type { TierLevel } from '@prisma/client';

interface TierBadgeProps {
  tier:       TierLevel;
  points:     number;
  size?:      'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function TierBadge({ tier, points, size = 'md', showProgress = false }: TierBadgeProps) {
  const cfg      = TIER_CONFIG[tier];
  const progress = getTierProgress(points, tier);

  const sizeMap = {
    sm: { badge: 'w-10 h-10 text-xl', text: 'text-xs', label: 'text-[10px]' },
    md: { badge: 'w-14 h-14 text-2xl', text: 'text-sm', label: 'text-xs' },
    lg: { badge: 'w-20 h-20 text-4xl', text: 'text-base', label: 'text-sm' },
  };
  const s = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{ type: 'spring', stiffness: 400 }}
        className={`${s.badge} rounded-2xl flex items-center justify-center relative`}
        style={{
          background: `${cfg.color}20`,
          border:     `2px solid ${cfg.color}60`,
          boxShadow:  tier === 'ELITE' ? `0 0 20px ${cfg.color}40` : undefined,
        }}
      >
        {cfg.emoji}
        {tier === 'ELITE' && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: `0 0 30px ${cfg.color}40, inset 0 0 20px ${cfg.color}20` }}
          />
        )}
      </motion.div>

      <div className="text-center">
        <p className={`font-bold ${s.text}`} style={{ color: cfg.color }}>{cfg.label}</p>
        {showProgress && tier !== 'ELITE' && (
          <p className={`text-white/40 ${s.label}`}>{points.toLocaleString('id')} poin</p>
        )}
      </div>

      {showProgress && tier !== 'ELITE' && (
        <div className="w-full max-w-[120px]">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})` }}
            />
          </div>
          <p className="text-[10px] text-white/30 text-center mt-1">{progress}% ke tier berikutnya</p>
        </div>
      )}
    </div>
  );
}
