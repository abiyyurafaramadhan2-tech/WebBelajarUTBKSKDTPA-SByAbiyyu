'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion } from 'framer-motion';
import Link from 'next/link';

const CATS = [
  {
    emoji: '🎓', name: 'UTBK / SNBT', color: '#6366f1', slug: 'utbk',
    subtests: ['Penalaran Umum', 'Pengetahuan Umum', 'Memahami Bacaan', 'Pengetahuan Kuantitatif', 'Literasi Indonesia', 'Literasi Inggris', 'Penalaran Matematika'],
    total: '3.500 Soal',
  },
  {
    emoji: '🏛️', name: 'SKD CPNS', color: '#f59e0b', slug: 'skd',
    subtests: ['TWK — Wawasan Kebangsaan', 'TIU — Intelegensia Umum', 'TKP — Karakteristik Pribadi'],
    total: '1.500 Soal',
  },
  {
    emoji: '🧪', name: 'TPS / TPA', color: '#22c55e', slug: 'tpa',
    subtests: ['Verbal', 'Numerik', 'Logika', 'Spasial'],
    total: '2.000 Soal',
  },
];

export function LandingCategories() {
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
            Kategori <span className="text-neon">Lengkap</span>
          </h2>
          <p className="text-white/50 text-lg">14 subtest. 7.000+ soal. Semua ada di sini.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CATS.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
              className="glass-card p-6 group hover:border-white/20 transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}
                >
                  {cat.emoji}
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                  <p className="text-xs font-semibold" style={{ color: cat.color }}>
                    {cat.total}
                  </p>
                </div>
              </div>

              {/* Subtests */}
              <ul className="space-y-2 mb-6">
                {cat.subtests.map((st, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    {st}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="block w-full text-center py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: `${cat.color}20`,
                  border:     `1px solid ${cat.color}40`,
                  color:      cat.color,
                }}
              >
                Mulai Latihan →
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/40 text-sm mb-4">
            © 2026 QuizGenius by Abiyyu Rafa Ramadhan. All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
