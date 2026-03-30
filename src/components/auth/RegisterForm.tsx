'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { registerAction, type ActionResult } from '@/actions/auth.actions';
import { ShakeWrapper } from '@/components/shared/ShakeWrapper';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      type="submit"
      disabled={pending}
      whileHover={!pending ? { scale: 1.02 } : {}}
      whileTap={!pending ? { scale: 0.98 } : {}}
      className="btn-neon w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Membuat akun...</>
      ) : (
        '🎉 Daftar Gratis'
      )}
    </motion.button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    registerAction, null
  );
  const [showPass,  setShowPass]  = useState(false);
  const [shakeField,setShakeField]= useState<string | null>(null);

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      toast.error(state.error ?? 'Terjadi kesalahan');
      if (state.field) { setShakeField(state.field); setTimeout(() => setShakeField(null), 600); }
    }
  }, [state]);

  const inputBase = cn(
    'w-full bg-surface-600/50 border border-white/10 rounded-xl px-4 py-3.5 pl-11',
    'text-white placeholder-white/30 text-sm font-medium',
    'focus:outline-none focus:border-brand-neon/60 focus:bg-surface-600/80',
    'transition-all duration-200'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="glass-card p-8"
    >
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Buat Akun Baru</h1>

      <form action={formAction} className="space-y-4">
        {/* Name */}
        <ShakeWrapper shouldShake={shakeField === 'name'}>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              name="name"
              placeholder="Nama lengkap"
              required
              autoComplete="name"
              className={inputBase}
            />
          </div>
        </ShakeWrapper>

        {/* Email */}
        <ShakeWrapper shouldShake={shakeField === 'email'}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="email"
              name="email"
              placeholder="Email aktif kamu"
              required
              autoComplete="email"
              className={inputBase}
            />
          </div>
        </ShakeWrapper>

        {/* Password */}
        <ShakeWrapper shouldShake={shakeField === 'password'}>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password (min. 8 karakter)"
              required
              autoComplete="new-password"
              className={cn(inputBase, 'pr-11')}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </ShakeWrapper>

        <AnimatePresence>
          {state && !state.success && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-xs font-medium px-1"
            >
              ⚠️ {state.error}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-white/30 text-xs px-1">
          Dengan mendaftar, kamu menyetujui syarat & ketentuan QuizGenius.
        </p>

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>
    </motion.div>
  );
}
