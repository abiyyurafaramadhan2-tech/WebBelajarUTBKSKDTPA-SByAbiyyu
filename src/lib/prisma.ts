// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { PrismaClient } from '@prisma/client';

/**
 * Singleton pattern untuk PrismaClient agar tidak terjadi 
 * "Too many connections" saat proses hot-reload di Next.js.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Tambahan export default agar bisa dipanggil dengan cara apa pun
export default prisma;
