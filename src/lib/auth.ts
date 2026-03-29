// JWT Auth Engine
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-me-in-production'
);

export interface JWTPayload {
  userId: string;
  email:  string;
  role:   string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = cookies().get('qg-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true, name: true, email: true, role: true,
      tier: true, tierPoints: true, totalXP: true,
      level: true, streakDays: true, avatarEmoji: true,
    },
  });
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
