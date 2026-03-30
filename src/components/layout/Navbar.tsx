'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Trophy, LogOut, Brain } from 'lucide-react';
import { logoutAction } from '@/actions/auth.actions';
import { TIER_CONFIG } from '@/lib/xp';
import { cn } from '@/lib/utils';
import type { TierLevel } from '@prisma/client';

interface NavbarProps {
  user: {
    name:       string;
    avatarEmoji:string;
    tier:       TierLevel;
    totalXP:    number;
    level:      number;
  };
}

const NAV_LINKS = [
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const tierCfg  = TIER_CONFIG[user.tier];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-neon flex items-center justify-center font-bold text-surface-900 text-sm shadow-neon-purple">
            Q
          </div>
          <span className="font-bold text-white hidden sm:block">
            Quiz<span className="text-brand-neon">Genius</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                  active
                    ? 'bg-brand-neon/15 text-brand-neon'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden sm:block">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Tier badge */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold"
            style={{ borderColor: `${tierCfg.color}40`, color: tierCfg.color, background: `${tierCfg.color}15` }}
          >
            <span>{tierCfg.emoji}</span>
            <span>{tierCfg.label}</span>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-surface-600 border border-white/10 flex items-center justify-center text-sm">
              {user.avatarEmoji}
            </div>
            <div className="hidden lg:block">
              <p className="text-white text-xs font-semibold leading-none">{user.name.split(' ')[0]}</p>
              <p className="text-white/40 text-[10px] mt-0.5">Lv.{user.level}</p>
            </div>
          </div>

          {/* Logout */}
          <form action={logoutAction}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </form>
        </div>
      </div>
    </header>
  );
}
