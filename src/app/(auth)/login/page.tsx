// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Masuk — QuizGenius',
  description: 'Login ke akun QuizGenius kamu',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-brand" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/40 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-neon flex items-center justify-center font-bold text-surface-900 text-xl shadow-neon-purple">
              Q
            </div>
            <span className="text-2xl font-bold text-white">
              Quiz<span className="text-brand-neon">Genius</span>
            </span>
          </Link>
          <p className="text-white/50 mt-3 text-sm">Selamat datang kembali! 👋</p>
        </div>

        <LoginForm />

        <p className="text-center text-white/40 text-sm mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-brand-neon hover:text-brand-neon/80 font-semibold transition-colors">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
