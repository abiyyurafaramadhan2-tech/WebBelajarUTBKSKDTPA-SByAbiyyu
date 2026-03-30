'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Trophy, Brain } from 'lucide-react';

const FLOATING_EMOJIS = ['🎯','⚡','🧠','🏆','📚','🔥','💎','✨'];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-purple/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-brand-neon/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Floating emoji particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20 select-none"
            style={{
              left:  `${10 + (i * 11) % 80}%`,
              top:   `${15 + (i * 17) % 70}%`,
            }}
            animate={{
              y:       [0, -20, 0],
              rotate:  [0, 10, -10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat:   Infinity,
              delay:    i * 0.4,
              ease:     'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-neon/30 bg-brand-neon/10 text-brand-neon text-sm font-semibold mb-8"
        >
          <Zap className="w-3.5 h-3.5" />
          Platform #1 Tryout UTBK, SKD & TPA
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Belajar Lebih{' '}
          <span className="relative">
            <span className="text-neon">Cerdas</span>
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-gradient-neon"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </span>
          {', '}
          <br className="hidden md:block" />
          Raih Skor{' '}
          <span className="text-brand-neon-yellow">Tertinggi</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
        >
          Platform gamifikasi belajar dengan{' '}
          <strong className="text-white/80">IRT Scoring Engine</strong>,
          ribuan soal UTBK/SNBT, SKD CPNS, dan TPA yang terus diperbarui.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="btn-neon px-8 py-4 text-lg rounded-2xl text-white font-bold shadow-neon-purple w-full sm:w-auto"
          >
            🚀 Mulai Belajar Gratis
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 text-lg rounded-2xl text-white/70 font-semibold border border-white/10 hover:border-white/30 hover:text-white transition-all w-full sm:w-auto glass-card"
          >
            Sudah punya akun →
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-8 mt-16"
        >
          {[
            { icon: Brain,  value: '7.000+', label: 'Soal Premium' },
            { icon: Trophy, value: '14',     label: 'Subtest Lengkap' },
            { icon: Zap,    value: 'IRT',    label: 'Scoring Engine' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-6 h-6 text-brand-neon mx-auto mb-1" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
            }
