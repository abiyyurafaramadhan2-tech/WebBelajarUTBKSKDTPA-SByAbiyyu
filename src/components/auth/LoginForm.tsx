'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useFormState, useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginAction, type ActionResult } from '@/actions/auth.actions';
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
        <><Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...</>
      ) : (
        '⚡ Masuk Sekarang'
      )}
    </motion.button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(
    loginAction, null
  );
  const [showPass,  setShowPass]  = useState(false);
  const [shakeEmail,setShakeEmail]= useState(false);
  const [shakePass, setShakePass] = useState(false);

  useEffect(() => {
    if (!state) return;
    if (!state.success) {
      toast.error(state.error ?? 'Terjadi kesalahan');
      if (state.field === 'email') setShakeEmail(true);
      if (state.field === 'password') setShakePass(true);
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
      <h1 className="text-2xl font-bold text-white mb-6 text-center">Masuk ke Akun</h1>

      <form action={formAction} className="space-y-4">
        {/* Email */}
        <ShakeWrapper shouldShake={shakeEmail} onShakeEnd={() => setShakeEmail(false)}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="email"
              name="email"
              placeholder="Email kamu"
              required
              autoComplete="email"
              className={inputBase}
            />
          </div>
        </ShakeWrapper>

        {/* Password */}
        <ShakeWrapper shouldShake={shakePass} onShakeEnd={() => setShakePass(false)}>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              placeholder="Password kamu"
              required
              autoComplete="current-password"
              className={cn(inputBase, 'pr-11')}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </ShakeWrapper>

        {/* Error message */}
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

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>
    </motion.div>
  );
}
