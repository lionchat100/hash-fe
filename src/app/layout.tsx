import { QueryProvider, SocketProvider, SonnerProvider, ThemeProvider } from '@/app/_providers';
import type { Metadata } from 'next';
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
  title: {
    default: 'LIONCHAT',
    template: '%s | LIONCHAT',
  },
  description: 'Lion Coffee Chat Service',
  applicationName: 'LIONCHAT',
  keywords: ['라이언챗', '커피챗', '해커톤', '멋쟁이사자처럼', 'lionchat', 'likelion'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LIONCHAT',
  },
  openGraph: {
    title: 'LIONCHAT',
    description: 'Lion Coffee Chat Service',
    url: 'https://lionchat.com',
    siteName: 'LIONCHAT',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LIONCHAT',
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={false}
          storageKey='hash-theme'
        >
          <SocketProvider>
            <SonnerProvider>
              <QueryProvider>{children}</QueryProvider>
            </SonnerProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
