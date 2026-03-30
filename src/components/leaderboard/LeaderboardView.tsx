'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal } from 'lucide-react';
import { TIER_CONFIG } from '@/lib/xp';
import { formatTime } from '@/lib/utils';
import type { TierLevel } from '@prisma/client';

interface Entry {
  rank:         number;
  userId:       string;
  userName:     string;
  userEmoji:    string;
  userTier:     TierLevel;
  userLevel:    number;
  irtScore:     number;
  accuracy:     number;
  timeSpent:    number;
  subtestName:  string;
  categoryEmoji:string;
  categoryColor:string;
  isMe:         boolean;
  date:         string;
}

const PERIODS = [
  { id:'all-time', label:'Semua Waktu' },
  { id:'weekly',   label:'Minggu Ini' },
  { id:'daily',    label:'Hari Ini'   },
];

const RANK_ICONS: Record<number, React.ReactNode> = {
  1: <Crown className="w-5 h-5 text-brand-neon-yellow" />,
  2: <Medal className="w-5 h-5 text-slate-300" />,
  3: <Medal className="w-5 h-5 text-amber-600" />,
};

export function LeaderboardView({
  entries, myRank, currentPeriod,
}: {
  entries: Entry[]; myRank: number | null; currentPeriod: string;
}) {
  const router = useRouter();
  const top3   = entries.slice(0, 3);
  const rest   = entries.slice(3);

  const setPeriod = (p: string) => {
    router.push(`/leaderboard?period=${p}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-brand-neon-yellow" />
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        </div>
        {myRank && (
          <p className="text-white/50 text-sm">
            Kamu berada di peringkat{' '}
            <span className="text-brand-neon font-bold">#{myRank}</span>
          </p>
        )}
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 p-1 glass-card rounded-2xl">
        {PERIODS.map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              currentPeriod === p.id
                ? 'bg-brand-neon/20 text-brand-neon'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 items-end py-4">
          {[top3[1], top3[0], top3[2]].map((entry, podiumIdx) => {
            const heights = ['h-24', 'h-32', 'h-20'];
            const pos     = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            const tierCfg = TIER_CONFIG[entry.userTier];

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: podiumIdx * 0.1 }}
                className={`flex flex-col items-center ${podiumIdx === 1 ? 'order-2' : podiumIdx === 0 ? 'order-1' : 'order-3'}`}
              >
                <div className="text-3xl mb-1">{entry.userEmoji}</div>
                <p className="text-white font-bold text-xs text-center mb-0.5 truncate max-w-[80px]">
                  {entry.userName.split(' ')[0]}
                </p>
                <p className="text-brand-neon font-black text-sm">{entry.irtScore}</p>

                <div
                  className={`w-full ${heights[podiumIdx]} rounded-t-2xl flex flex-col items-center justify-center mt-2 relative`}
                  style={{
                    background: pos === 1
                      ? 'linear-gradient(135deg, rgba(199,125,255,0.3), rgba(199,125,255,0.1))'
                      : pos === 2
                      ? 'linear-gradient(135deg, rgba(200,200,200,0.2), rgba(200,200,200,0.05))'
                      : 'linear-gradient(135deg, rgba(180,100,50,0.2), rgba(180,100,50,0.05))',
                    border: `1px solid ${pos === 1 ? 'rgba(199,125,255,0.4)' : pos === 2 ? 'rgba(200,200,200,0.3)' : 'rgba(180,100,50,0.3)'}`,
                  }}
                >
                  <div className="absolute -top-3">{RANK_ICONS[pos]}</div>
                  <span className="text-2xl font-black text-white/40">#{pos}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {entries.map((entry, i) => {
          const tierCfg = TIER_CONFIG[entry.userTier];
          return (
            <motion.div
              key={entry.userId + i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className={`glass-card p-4 flex items-center gap-3 ${
                entry.isMe ? 'border-brand-neon/40 bg-brand-neon/5' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center shrink-0">
                {RANK_ICONS[entry.rank] ?? (
                  <span className="text-white/40 font-bold text-sm">#{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-surface-600 border border-white/10 flex items-center justify-center text-xl shrink-0">
                {entry.userEmoji}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-sm truncate">
                    {entry.userName}
                    {entry.isMe && (
                      <span className="ml-1 text-[10px] text-brand-neon font-bold">(Kamu)</span>
                    )}
                  </p>
                  <span className="text-[10px] font-bold" style={{ color: tierCfg.color }}>
                    {tierCfg.emoji} {tierCfg.label}
                  </span>
                </div>
                <p className="text-white/40 text-[11px] mt-0.5">
                  {entry.categoryEmoji} {entry.subtestName} · Lv.{entry.userLevel}
                </p>
              </div>

              {/* Scores */}
              <div className="text-right shrink-0">
                <p className="text-brand-neon font-black text-lg leading-none">{entry.irtScore}</p>
                <p className="text-white/40 text-[11px]">IRT</p>
                <p className="text-brand-neon-green text-xs font-semibold">{entry.accuracy}%</p>
              </div>
            </motion.div>
          );
        })}

        {entries.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Trophy className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 font-semibold">Belum ada data untuk periode ini.</p>
            <p className="text-white/30 text-sm mt-1">Jadilah yang pertama!</p>
          </div>
        )}
      </div>
    </div>
  );
                      }
