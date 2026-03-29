// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/5 bg-surface-900/80 backdrop-blur-xl">
      {/* Neon top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-neon/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-neon flex items-center justify-center text-sm font-bold text-surface-900">
              Q
            </div>
            <span className="font-bold text-white/70">QuizGenius</span>
          </div>

          {/* Copyright */}
          <p className="text-white/40 text-sm text-center">
            © 2026{' '}
            <span className="text-brand-neon font-semibold">QuizGenius</span>
            {' '}by{' '}
            <span className="text-white/70 font-semibold">
              Abiyyu Rafa Ramadhan
            </span>
            . All Rights Reserved.
          </p>

          {/* Status */}
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green animate-pulse" />
            Platform Online
          </div>
        </div>
      </div>
    </footer>
  );
}
