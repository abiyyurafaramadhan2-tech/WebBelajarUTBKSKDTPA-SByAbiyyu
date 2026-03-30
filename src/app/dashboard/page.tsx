// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Navbar }        from '@/components/layout/Navbar';
import { Footer }        from '@/components/layout/Footer';
import { TierBadge }     from '@/components/dashboard/TierBadge';
import { XPBar }         from '@/components/dashboard/XPBar';
import { CategoryCard }  from '@/components/dashboard/CategoryCard';
import { prisma }        from '@/lib/prisma';
import { getUser }       from '@/lib/auth';
import { formatNumber }  from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard — QuizGenius' };

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  // Fetch categories + subtests
  const categories = await prisma.category.findMany({
    where:   { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      subtests: {
        where:   { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select:  { id: true, name: true, slug: true },
      },
    },
  });

  // Fetch recent sessions
  const recentSessions = await prisma.quizSession.findMany({
    where:   { userId: user.id, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    take:    5,
    include: { 
      subtest: { 
        include: { category: true } 
      } 
    },
  });

  // Stats
  const totalSessions = await prisma.quizSession.count({
    where: { userId: user.id, status: 'COMPLETED' },
  });
  
  const bestScoreResult = await prisma.quizSession.findFirst({
    where:   { userId: user.id, status: 'COMPLETED' },
    orderBy: { irtScore: 'desc' },
    select:  { irtScore: true },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* ── Sidebar ── */}
          <aside className="xl:col-span-1 space-y-4">
            <div className="glass-card p-6 text-center border border-white/10 rounded-2xl bg-white/5">
              <div className="text-5xl mb-3">{user.avatarEmoji || '👤'}</div>
              <h2 className="text-white font-bold text-xl mb-1">{user.name}</h2>
              <p className="text-white/40 text-sm mb-5">{user.email}</p>

              <TierBadge tier={user.tier} points={user.tierPoints} showProgress />

              <div className="mt-5">
                <XPBar totalXP={user.totalXP} level={user.level} />
              </div>
            </div>

            <div className="glass-card p-5 space-y-4 border border-white/10 rounded-2xl bg-white/5">
              <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">Statistik</h3>
              {[
                { label:'Total Sesi',   value: formatNumber(totalSessions), emoji:'🎮' },
                { label:'Skor IRT Terbaik', value: bestScoreResult ? `${Math.round(bestScoreResult.irtScore)}` : '0', emoji:'🏆' },
                { label:'Streak Hari', value: `${user.streakDays || 0} hari`, emoji:'🔥' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-white/50 text-sm flex items-center gap-2">
                    <span>{s.emoji}</span>{s.label}
                  </span>
                  <span className="text-white font-bold text-sm">{s.value}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="xl:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Halo, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/50 text-sm">Pilih subtest dan mulai berlatih sekarang.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  name={cat.name}
                  slug={cat.slug}
                  emoji={cat.iconEmoji}
                  color={cat.color}
                  subtests={cat.subtests}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
