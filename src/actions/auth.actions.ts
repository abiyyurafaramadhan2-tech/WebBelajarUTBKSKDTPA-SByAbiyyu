'use server';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

const RegisterSchema = z.object({
  name:     z.string().min(2, 'Nama minimal 2 karakter'),
  email:    z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export type ActionResult = {
  success: boolean;
  error?:  string;
  field?:  string;
};

export async function registerAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name:     formData.get('name'),
    email:    formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { success: false, error: first.message, field: String(first.path[0]) };
  }

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { success: false, error: 'Email sudah terdaftar', field: 'email' };
  }

  const hashed = await bcrypt.hash(password, 12);
  const user   = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });

  cookies().set('qg-token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 30, // 30 days
    path:     '/',
  });

  redirect('/dashboard');
}

export async function loginAction(
  _: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email:    formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Email atau password tidak valid' };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, error: 'Email atau password salah' };
  }

  const token = await signToken({ userId: user.id, email: user.email, role: user.role });

  cookies().set('qg-token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 30,
    path:     '/',
  });

  redirect('/dashboard');
}

export async function logoutAction() {
  cookies().delete('qg-token');
  redirect('/login');
                }
