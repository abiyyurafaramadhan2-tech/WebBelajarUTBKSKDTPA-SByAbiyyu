// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Navbar }       from '@/components/layout/Navbar';
import { Footer }       from '@/components/layout/Footer';
import { ModeSelector } from '@/components/quiz/ModeSelector';
import { prisma }       from '@/lib/prisma';
import { getUser }      from '@/lib/auth';

interface Props {
  params: { subtestSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subtest = await prisma.subtest.findFirst({
    where: { slug: params.subtestSlug },
  });
  return { title: subtest ? `${subtest.name} — QuizGenius` : 'QuizGenius' };
}

export default async function QuizModePage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect('/login');

  const subtest = await prisma.subtest.findFirst({
    where:   { slug: params.subtestSlug, isActive: true },
    include: { category: true },
  });
  if (!subtest) notFound();

  const questionCount = await prisma.question.count({
    where: { subtestId: subtest.id, isActive: true },
  });

  const userSessions = await prisma.quizSession.findMany({
    where:   { userId: user.id, subtestId: subtest.id, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    take:    3,
    select:  { irtScore: true, accuracy: true, mode: true, completedAt: true },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <ModeSelector
          subtest={{
            id:           subtest.id,
            name:         subtest.name,
            emoji:        subtest.iconEmoji,
            color:        subtest.color,
            timeLimit:    subtest.timeLimit,
            categoryName: subtest.category.name,
            questionCount,
          }}
          recentSessions={userSessions.map(s => ({
            irtScore:    Math.round(s.irtScore),
            accuracy:    Math.round(s.accuracy),
            mode:        s.mode,
            completedAt: s.completedAt?.toISOString() ?? '',
          }))}
        />
      </main>
      <Footer />
    </div>
  );
}
