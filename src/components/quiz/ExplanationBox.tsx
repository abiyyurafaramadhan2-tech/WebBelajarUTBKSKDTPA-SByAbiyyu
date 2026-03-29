'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface ExplanationBoxProps {
  show:        boolean;
  explanation: string;
  isCorrect:   boolean;
}

export function ExplanationBox({ show, explanation, isCorrect }: ExplanationBoxProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`
            relative overflow-hidden rounded-2xl p-5 border
            ${isCorrect
              ? 'border-brand-neon-green/30 bg-brand-neon-green/5'
              : 'border-brand-neon/30 bg-brand-neon/5'
            }
          `}
        >
          {/* Animated top line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`absolute top-0 left-0 right-0 h-0.5 origin-left ${
              isCorrect ? 'bg-brand-neon-green' : 'bg-brand-neon'
            }`}
          />

          <div className="flex items-start gap-3">
            <div className={`
              mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0
              ${isCorrect ? 'bg-brand-neon-green/20' : 'bg-brand-neon/20'}
            `}>
              <Lightbulb className={`w-4 h-4 ${isCorrect ? 'text-brand-neon-green' : 'text-brand-neon'}`} />
            </div>

            <div>
              <h4 className={`text-sm font-bold mb-1 ${
                isCorrect ? 'text-brand-neon-green' : 'text-brand-neon'
              }`}>
                {isCorrect ? '✨ Luar Biasa!' : '💡 Pembahasan'}
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
