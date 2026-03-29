// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const PUBLIC_PATHS = [
  '/', '/login', '/register',
  '/api/auth/login', '/api/auth/register',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some(p =>
    pathname === p || pathname.startsWith('/api/auth/')
  );

  if (isPublic) return NextResponse.next();

  const token = req.cookies.get('qg-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('qg-token');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
