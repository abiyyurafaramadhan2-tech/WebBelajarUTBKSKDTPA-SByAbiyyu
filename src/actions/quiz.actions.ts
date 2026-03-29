'use server';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { calculateIRTScore } from '@/lib/irt';
import { calculateXP, getTierFromPoints, getLevelFromXP } from '@/lib/xp';

const QUESTIONS_PER_SESSION = 40;

/**
 * Start a new quiz session
 */
export async function startSessionAction(
  subtestId:     string,
  mode:          'PRACTICE' | 'SERIOUS',
  questionCount: number = QUESTIONS_PER_SESSION
) {
  const user = await requireAuth();

  const subtest = await prisma.subtest.findUnique({
    where: { id: subtestId },
  });
  if (!subtest) throw new Error('Subtest tidak ditemukan');

  // Sample questions by difficulty: 30% EASY, 50% MEDIUM, 20% HARD
  const easyCount  = Math.floor(questionCount * 0.3);
  const mediumCount= Math.floor(questionCount * 0.5);
  const hardCount  = questionCount - easyCount - mediumCount;

  async function sampleQuestions(level: 'EASY' | 'MEDIUM' | 'HARD', count: number) {
    return prisma.question.findMany({
      where:   { subtestId, isActive: true, difficultyLevel: level },
      take:    count,
      orderBy: { id: 'asc' }, // Use DB ordering + offset for variety
      select: {
        id: true, stem: true,
        optionA: true, optionB: true, optionC: true, optionD: true, optionE: true,
        correctOption: true, explanation: true, topic: true, imageUrl: true,
        difficultyLevel: true, difficultyWeight: true,
        discriminationA: true, guessingC: true,
      },
    });
  }

  const [easy, medium, hard] = await Promise.all([
    sampleQuestions('EASY',   easyCount),
    sampleQuestions('MEDIUM', mediumCount),
    sampleQuestions('HARD',   hardCount),
  ]);

  const questions = [...easy, ...medium, ...hard]
    .sort(() => Math.random() - 0.5); // Shuffle

  const session = await prisma.quizSession.create({
    data: {
      userId:         user.id,
      subtestId,
      mode,
      totalQuestions: questions.length,
      timeLimitSec:   mode === 'SERIOUS' ? subtest.timeLimit * 60 : null,
      answers: {
        create: questions.map((q, idx) => ({
          questionId: q.id,
        })),
      },
    },
    include: { answers: true },
  });

  return {
    sessionId: session.id,
    questions,
    timeLimitSec: session.timeLimitSec,
  };
}

/**
 * Submit a single answer
 */
export async function submitAnswerAction(
  sessionId:     string,
  questionId:    string,
  selectedOption: string | null,
  timeSpentSec:  number
) {
  const user    = await requireAuth();
  const session = await prisma.quizSession.findFirst({
    where:  { id: sessionId, userId: user.id, status: 'IN_PROGRESS' },
    include: { answers: { include: { question: true } } },
  });
  if (!session) throw new Error('Sesi tidak ditemukan atau sudah selesai');

  const answer   = session.answers.find(a => a.questionId === questionId);
  if (!answer)   throw new Error('Soal tidak ada dalam sesi ini');
  if (answer.selectedOption !== null) return { alreadyAnswered: true };

  const question = answer.question;
  const isCorrect = selectedOption !== null && selectedOption === question.correctOption;

  await prisma.sessionAnswer.update({
    where: { id: answer.id },
    data: {
      selectedOption,
      isCorrect,
      timeSpentSec,
    },
  });

  // Update question analytics
  await prisma.question.update({
    where: { id: questionId },
    data: {
      usageCount:   { increment: 1 },
      correctCount: isCorrect ? { increment: 1 } : undefined,
    },
  });

  // In PRACTICE mode, return explanation
  if (session.mode === 'PRACTICE') {
    return {
      isCorrect,
      correctOption: question.correctOption,
      explanation:   question.explanation,
    };
  }

  return { isCorrect };
}

/**
 * Finish quiz session — calculate scores, award XP
 */
export async function finishSessionAction(
  sessionId:   string,
  timeSpentSec:number
) {
  const user = await requireAuth();

  const session = await prisma.quizSession.findFirst({
    where:   { id: sessionId, userId: user.id, status: 'IN_PROGRESS' },
    include: {
      answers: { include: { question: true } },
      subtest: true,
    },
  });
  if (!session) throw new Error('Sesi tidak ditemukan');

  const answeredCount  = session.answers.filter(a => a.selectedOption !== null).length;
  const correctCount   = session.answers.filter(a => a.isCorrect).length;
  const incorrectCount = session.answers.filter(a => a.selectedOption && !a.isCorrect).length;
  const skippedCount   = session.answers.filter(a => a.selectedOption === null).length;

  // IRT Scoring
  const irtResponses = session.answers.map(a => ({
    difficultyWeight: a.question.difficultyWeight,
    discriminationA:  a.question.discriminationA,
    guessingC:        a.question.guessingC,
    isCorrect:        a.isCorrect,
  }));

  const { theta, score: irtScore, accuracy } = calculateIRTScore(irtResponses);

  // Check first attempt
  const previousSessions = await prisma.quizSession.count({
    where: { userId: user.id, subtestId: session.subtestId, status: 'COMPLETED', id: { not: sessionId } },
  });

  // XP Calculation
  const xpResult = calculateXP({
    correctCount,
    totalQuestions: session.totalQuestions,
    streak:         0, // TODO: track live streak
    timeSpentSec,
    timeLimitSec:   session.timeLimitSec ?? timeSpentSec * 2,
    mode:           session.mode,
    isFirstAttempt: previousSessions === 0,
  });

  const tierPoints = session.mode === 'SERIOUS'
    ? Math.round(irtScore * 0.5) : 0;

  // Update session
  await prisma.quizSession.update({
    where: { id: sessionId },
    data: {
      status:           'COMPLETED',
      rawScore:         (correctCount / session.totalQuestions) * 100,
      irtScore,
      correctCount,
      incorrectCount,
      skippedCount,
      accuracy,
      xpEarned:         xpResult.totalXP,
      tierPointsEarned: tierPoints,
      timeSpentSec,
      completedAt:      new Date(),
    },
  });

  // Create leaderboard entry (SERIOUS mode only)
  if (session.mode === 'SERIOUS') {
    await prisma.leaderboardEntry.create({
      data: { userId: user.id, sessionId, irtScore, rawScore: (correctCount / session.totalQuestions) * 100, accuracy, timeSpentSec },
    });
  }

  // Update user stats
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      totalXP:    { increment: xpResult.totalXP },
      tierPoints: { increment: tierPoints },
      level:      getLevelFromXP((user as any).totalXP + xpResult.totalXP),
      tier:       getTierFromPoints((user as any).tierPoints + tierPoints),
    },
  });

  revalidatePath('/dashboard');
  redirect(`/results/${sessionId}`);
    }
