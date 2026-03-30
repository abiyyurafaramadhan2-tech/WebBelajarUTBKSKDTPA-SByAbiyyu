// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Navbar }        from '@/components/layout/Navbar';
import { Footer }        from '@/components/layout/Footer';
import { LeaderboardView } from '@/components/leaderboard/LeaderboardView';
import { prisma }        from '@/lib/prisma';
import { getUser }       from '@/lib/auth';

export const metadata: Metadata = { title: 'Leaderboard — QuizGenius' };

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  const user = await getUser();
  if (!user) redirect('/login');

  const period = searchParams.period ?? 'all-time';

  const dateFilter =
    period === 'daily'
      ? { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      : period === 'weekly'
      ? { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      : undefined;

  const entries = await prisma.leaderboardEntry.findMany({
    where:   dateFilter ? { createdAt: dateFilter } : {},
    orderBy: { irtScore: 'desc' },
    take:    50,
    include: {
      user:    { select: { id:true, name:true, avatarEmoji:true, tier:true, level:true } },
      session: { include: { subtest: { include: { category:true } } } },
    },
  });

  const myRank = entries.findIndex(e => e.userId === user.id) + 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <LeaderboardView
          entries={entries.map((e, i) => ({
            rank:        i + 1,
            userId:      e.userId,
            userName:    e.user.name,
            userEmoji:   e.user.avatarEmoji,
            userTier:    e.user.tier,
            userLevel:   e.user.level,
            irtScore:    Math.round(e.irtScore),
            accuracy:    Math.round(e.accuracy),
            timeSpent:   e.timeSpentSec,
            subtestName: e.session.subtest.name,
            categoryEmoji:e.session.subtest.category.iconEmoji,
            categoryColor:e.session.subtest.category.color,
            isMe:        e.userId === user.id,
            date:        e.createdAt.toISOString(),
          }))}
          myRank={myRank || null}
          currentPeriod={period}
        />
      </main>
      <Footer />
    </div>
  );
}
