import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC, Noto_Sans_TC, Noto_Sans_KR, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Background3D from '@/components/canvas/Background3D';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSc = Noto_Sans_SC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sc',
  display: 'swap',
});

const notoTc = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-tc',
  display: 'swap',
});

const notoKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-kr',
  display: 'swap',
});

const notoThai = Noto_Sans_Thai({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-noto-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'edTunl Lang — Nền tảng học ngôn ngữ AI',
  description: 'Học tiếng Anh, Trung, Nhật, Hàn, Thái với giáo trình sinh từ tài liệu bởi Google Gemini AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${notoSc.variable} ${notoTc.variable} ${notoKr.variable} ${notoThai.variable}`}
    >
      <body className="flex flex-col min-h-screen relative antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Background3D />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
