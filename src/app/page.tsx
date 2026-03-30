// © 2026 QuizGenius by Abiyyu Rafa Ramadhan. All Rights Reserved.
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingCategories } from '@/components/landing/LandingCategories';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar minimal */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-neon flex items-center justify-center font-bold text-surface-900 text-sm shadow-neon-purple">
              Q
            </div>
            <span className="font-bold text-white text-lg tracking-wide">
              Quiz<span className="text-brand-neon">Genius</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-neon px-5 py-2 text-sm rounded-xl text-white font-semibold"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingCategories />
      </main>

      <Footer />
    </div>
  );
}
