'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';
import { BookOpen, Swords, BarChart3, Zap, Trophy, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon:  BookOpen,
    color: '#C77DFF',
    title: 'Practice Mode',
    desc:  'Belajar tanpa tekanan. Salah? Langsung dapat penjelasan detail dari AI tutor kami.',
  },
  {
    icon:  Swords,
    color: '#48CAE4',
    title: 'Serious Mode',
    desc:  'Simulasi tryout nyata dengan timer ketat. Skor IRT kamu masuk leaderboard global.',
  },
  {
    icon:  BarChart3,
    color: '#39FF14',
    title: 'IRT Scoring Engine',
    desc:  'Sistem skoring Item Response Theory yang sama digunakan ujian internasional.',
  },
  {
    icon:  Zap,
    color: '#FFD60A',
    title: 'Gamifikasi Penuh',
    desc:  'XP, Level, Tier dari Bronze ke Elite, Badge, dan Streak harian yang memotivasimu.',
  },
  {
    icon:  Trophy,
    color: '#FF6B35',
    title: 'Leaderboard Global',
    desc:  'Bersaing dengan ribuan peserta. Tampil di papan peringkat harian & mingguan.',
  },
  {
    icon:  Shield,
    color: '#FF006E',
    title: '14 Subtest Lengkap',
    desc:  'UTBK/SNBT (7 subtest), SKD CPNS (3 subtest), TPA (4 subtest). Total 7.000+ soal.',
  },
];

export function LandingFeatures() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Kenapa{' '}
            <span className="text-neon">QuizGenius</span>?
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Bukan sekadar platform latihan soal biasa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
