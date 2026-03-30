'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface NeonGlowProps {
  active?:  boolean;
  color?:   string;
  children: ReactNode;
  className?:string;
}

export function NeonGlow({ active = true, color = '#C77DFF', children, className }: NeonGlowProps) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}20` }}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
