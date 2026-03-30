'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen } from 'lucide-react';

interface SubtestItem {
  id:   string;
  name: string;
  slug: string;
}

interface CategoryCardProps {
  name:     string;
  slug:     string;
  emoji:    string;
  color:    string;
  subtests: SubtestItem[];
  index:    number;
}

export function CategoryCard({ name, slug, emoji, color, subtests, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-5 flex items-center gap-4 border-b border-white/5"
        style={{ background: `linear-gradient(135deg, ${color}15, transparent)` }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-none">{name}</h3>
          <p className="text-white/40 text-xs mt-1">{subtests.length} Subtest</p>
        </div>
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>

      {/* Subtests list */}
      <div className="p-3 space-y-1">
        {subtests.map(sub => (
          <Link
            key={sub.id}
            href={`/quiz/${sub.slug}`}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70" />
            </div>
            <span className="text-white/60 text-sm font-medium flex-1 truncate group-hover:text-white transition-colors">
              {sub.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
