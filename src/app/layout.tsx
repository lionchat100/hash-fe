import { AuthProvider, QueryProvider, SonnerProvider, StompProvider, ThemeProvider } from '@/app/_providers';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: 'LIONCHAT',
  title: {
    default: 'LIONCHAT',
    template: '%s | LIONCHAT',
  },
  description: '개발자 커피챗 플랫폼 LIONCHAT',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LIONCHAT',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'LIONCHAT',
    title: {
      default: 'LIONCHAT',
      template: '%s | LIONCHAT',
    },
    description: '개발자 커피챗 플랫폼 LIONCHAT',
  },
  twitter: {
    card: 'summary',
    title: {
      default: 'LIONCHAT',
      template: '%s | LIONCHAT',
    },
    description: '개발자 커피챗 플랫폼 LIONCHAT',
  },
  keywords: ['라이언챗', '커피챗', '해커톤', '멋쟁이사자처럼', 'lionchat', 'likelion'],
  icons: {
    icon: [
      {
        url: '/icons/favicon.ico',
        sizes: '64x64, 48x48, 32x32, 16x16',
        type: 'image/x-icon',
      },
      {
        url: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className="bg-gray-50">
      <body className={`${geistSans.variable} ${geistMono.variable} mx-auto max-w-[480px] min-w-xs antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="lionchat-theme">
            <StompProvider>
              <SonnerProvider>
                <QueryProvider>{children}</QueryProvider>
              </SonnerProvider>
            </StompProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
