'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';

interface TimerRingProps {
  totalSec:   number;
  onExpire:   () => void;
  isPaused?:  boolean;
  size?:      number;
  strokeWidth?:number;
}

export function TimerRing({
  totalSec, onExpire, isPaused = false, size = 80, strokeWidth = 6,
}: TimerRingProps) {
  const [remaining, setRemaining] = useState(totalSec);

  const radius      = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress    = remaining / totalSec;
  const offset      = circumference * (1 - progress);

  const isUrgent    = remaining <= 60;
  const isCritical  = remaining <= 10;

  useEffect(() => {
    if (isPaused || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { onExpire(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused, remaining, onExpire]);

  const color = isCritical ? '#FF006E' : isUrgent ? '#FFD60A' : '#C77DFF';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          animate={{ stroke: color }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Time text */}
      <motion.span
        className="relative z-10 font-bold text-xs tabular-nums"
        style={{ color, textShadow: `0 0 10px ${color}` }}
        animate={isCritical ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      >
        {formatTime(remaining)}
      </motion.span>
    </div>
  );
}
