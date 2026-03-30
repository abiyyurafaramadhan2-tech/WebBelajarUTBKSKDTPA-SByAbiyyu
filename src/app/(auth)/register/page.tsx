// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Daftar — QuizGenius',
  description: 'Buat akun QuizGenius gratis dan mulai belajar',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-neon/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-neon flex items-center justify-center font-bold text-surface-900 text-xl shadow-neon-purple">
              Q
            </div>
            <span className="text-2xl font-bold text-white">
              Quiz<span className="text-brand-neon">Genius</span>
            </span>
          </Link>
          <p className="text-white/50 mt-3 text-sm">Bergabung dan raih skor terbaikmu! 🚀</p>
        </div>

        <RegisterForm />

        <p className="text-center text-white/40 text-sm mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-brand-neon hover:text-brand-neon/80 font-semibold transition-colors">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
