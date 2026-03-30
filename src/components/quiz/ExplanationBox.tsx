'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

interface ExplanationBoxProps {
  show:        boolean;
  explanation: string;
  isCorrect:   boolean;
  correctAnswer?: string; // Tambahan jitu: Untuk menampilkan kunci jawaban langsung di box
}

export function ExplanationBox({ show, explanation, isCorrect, correctAnswer }: ExplanationBoxProps) {
  // Jitu: Pastikan konten tidak kosong agar tidak muncul box hampa
  const hasContent = explanation && explanation.trim().length > 0;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="explanation-box"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className={`
            relative overflow-hidden rounded-2xl p-6 border shadow-2xl
            ${isCorrect
              ? 'border-brand-neon-green/40 bg-brand-neon-green/10'
              : 'border-brand-neon/40 bg-brand-neon/10'
            }
          `}
        >
          {/* Animated Glow Line - Jitu: Visual lebih tajam */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className={`absolute top-0 left-0 right-0 h-[3px] origin-left ${
              isCorrect 
                ? 'bg-brand-neon-green shadow-[0_0_15px_rgba(52,211,153,0.6)]' 
                : 'bg-brand-neon shadow-[0_0_15px_rgba(239,68,68,0.6)]'
            }`}
          />

          <div className="flex items-start gap-4">
            {/* Icon Container */}
            <div className={`
              mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
              ${isCorrect 
                ? 'bg-brand-neon-green/20 border-brand-neon-green/30' 
                : 'bg-brand-neon/20 border-brand-neon/30'}
            `}>
              {isCorrect 
                ? <CheckCircle2 className="w-5 h-5 text-brand-neon-green" />
                : <Lightbulb className="w-5 h-5 text-brand-neon" />
              }
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-sm font-black uppercase tracking-wider ${
                  isCorrect ? 'text-brand-neon-green' : 'text-brand-neon'
                }`}>
                  {isCorrect ? '✨ Analisis Jawaban' : '💡 Bedah Soal'}
                </h4>
                
                {/* Badge Kunci Jawaban (Muncul kalau salah) */}
                {!isCorrect && correctAnswer && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-neon/20 text-brand-neon border border-brand-neon/30">
                    Kunci: {correctAnswer}
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  {hasContent ? explanation : "Detail pembahasan sedang disiapkan oleh tim QuizGenius. Tetap semangat berlatih, Bi!"}
                </p>
                
                {isCorrect && (
                  <p className="text-brand-neon-green/80 text-xs font-semibold italic">
                    Langkah cerdas! Kamu sudah menguasai konsep ini.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Decorative Background Glow */}
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 rounded-full ${
            isCorrect ? 'bg-brand-neon-green' : 'bg-brand-neon'
          }`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
