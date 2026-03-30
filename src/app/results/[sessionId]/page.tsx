// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma }     from '@/lib/prisma';
import { getUser }    from '@/lib/auth';
import { Footer }     from '@/components/layout/Footer';
import { Navbar }     from '@/components/layout/Navbar';
import { ResultsView } from '@/components/quiz/ResultsView';

export const metadata: Metadata = { title: 'Hasil Quiz — QuizGenius' };

interface Props { params: { sessionId: string } }

export default async function ResultsPage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect('/login');

  const session = await prisma.quizSession.findFirst({
    where:   { id: params.sessionId, userId: user.id, status: 'COMPLETED' },
    include: {
      subtest:  { include: { category: true } },
      answers:  { include: { question: true }, orderBy: { answeredAt: 'asc' } },
    },
  });

  if (!session) notFound();

  const breakdown = {
    correct:   session.answers.filter(a => a.isCorrect).length,
    incorrect: session.answers.filter(a => !a.isCorrect && a.selectedOption !== null).length,
    skipped:   session.answers.filter(a => a.selectedOption === null).length,
    total:     session.answers.length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <ResultsView
          session={{
            id:          session.id,
            mode:        session.mode,
            irtScore:    Math.round(session.irtScore),
            rawScore:    Math.round(session.rawScore),
            accuracy:    Math.round(session.accuracy),
            xpEarned:    session.xpEarned,
            timeSpentSec:session.timeSpentSec,
            subtestName: session.subtest.name,
            subtestEmoji:session.subtest.iconEmoji,
            subtestColor:session.subtest.color,
            categoryName:session.subtest.category.name,
            breakdown,
          }}
          answers={session.answers.map(a => ({
            questionId:    a.questionId,
            stem:          a.question.stem,
            selectedOption:a.selectedOption,
            correctOption: a.question.correctOption,
            explanation:   a.question.explanation,
            isCorrect:     a.isCorrect,
            options: {
              A: a.question.optionA, B: a.question.optionB,
              C: a.question.optionC, D: a.question.optionD,
              E: a.question.optionE,
            },
          }))}
        />
      </main>
      <Footer />
    </div>
  );
}
