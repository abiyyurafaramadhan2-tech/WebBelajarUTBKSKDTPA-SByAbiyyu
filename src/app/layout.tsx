// © 2026 QuizGenius by Abiyyu Rafa Ramadhan. All Rights Reserved.
import type { Metadata, Viewport } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'QuizGenius — Belajar Lebih Pintar, Raih Skor Tertinggi',
    template: '%s | QuizGenius',
  },
  description:
    'Platform gamifikasi belajar terbaik untuk UTBK/SNBT, SKD CPNS, dan TPA. ' +
    'Dengan IRT scoring engine, Practice Mode, dan Tryout Mode.',
  authors: [{ name: 'Abiyyu Rafa Ramadhan' }],
  creator: 'Abiyyu Rafa Ramadhan',
  publisher: 'Abiyyu Rafa Ramadhan',
  keywords: [
    'UTBK', 'SNBT', 'SKD', 'CPNS', 'TPA', 'quiz', 'belajar', 'tryout',
    'QuizGenius', 'Abiyyu Rafa Ramadhan', 'IRT', 'gamifikasi',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'QuizGenius — Platform Belajar Gamifikasi',
    description: 'Tryout UTBK, SKD, TPA dengan AI Scoring Engine',
    siteName: 'QuizGenius',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuizGenius',
    description: 'Platform belajar gamifikasi terbaik Indonesia',
    creator: '@AbiyyuRafa',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#461A42',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${fredoka.variable} font-fredoka antialiased min-h-screen`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background:   '#1A142E',
              border:       '1px solid rgba(199,125,255,0.3)',
              color:        '#fff',
              fontFamily:   'var(--font-fredoka)',
              borderRadius: '12px',
              boxShadow:    '0 0 20px rgba(199,125,255,0.2)',
            },
            classNames: {
              success: 'border-brand-neon-green/40',
              error:   'border-brand-neon-pink/40',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
