// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { redirect, notFound } from 'next/navigation';
import { prisma }     from '@/lib/prisma';
import { getUser }    from '@/lib/auth';
import { QuizArena }  from '@/components/quiz/QuizArena';

interface Props { params: { sessionId: string } }

export default async function QuizSessionPage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect('/login');

  const session = await prisma.quizSession.findFirst({
    where:   { id: params.sessionId, userId: user.id },
    include: {
      subtest:  { include: { category: true } },
      answers:  {
        orderBy: { answeredAt: 'asc' },
        include: { question: true },
      },
    },
  });

  if (!session) notFound();
  if (session.status === 'COMPLETED') redirect(`/results/${session.id}`);

  // Build questions array for client
  const questions = session.answers.map(a => ({
    answerId:       a.id,
    questionId:     a.questionId,
    stem:           a.question.stem,
    optionA:        a.question.optionA,
    optionB:        a.question.optionB,
    optionC:        a.question.optionC,
    optionD:        a.question.optionD,
    optionE:        a.question.optionE,
    topic:          a.question.topic,
    imageUrl:       a.question.imageUrl,
    difficultyLevel:a.question.difficultyLevel,
    // correctOption & explanation sent ONLY after answered (in PRACTICE mode via server action)
  }));

  return (
    <QuizArena
      sessionId={session.id}
      mode={session.mode}
      timeLimitSec={session.timeLimitSec}
      questions={questions}
      subtestName={session.subtest.name}
      subtestEmoji={session.subtest.iconEmoji}
      subtestColor={session.subtest.color}
    />
  );
}
