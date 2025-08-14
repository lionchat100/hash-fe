import { QueryProvider, SonnerProvider, ThemeProvider } from '@/app/_providers';
import { SERVICE_INFO } from '@/shared/constants';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { GoogleAnalytics } from '@/shared/config/GoogleAnalytics';

export const metadata: Metadata = {
  applicationName: SERVICE_INFO.NAME,
  title: {
    default: SERVICE_INFO.NAME,
    template: '%s | ' + SERVICE_INFO.NAME,
  },
  description: SERVICE_INFO.DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SERVICE_INFO.NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: SERVICE_INFO.NAME,
    title: {
      default: SERVICE_INFO.NAME,
      template: '%s | ' + SERVICE_INFO.NAME,
    },
    description: SERVICE_INFO.DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: SERVICE_INFO.NAME,
      template: '%s | ' + SERVICE_INFO.NAME,
    },
    description: SERVICE_INFO.DESCRIPTION,
  },
  keywords: ['Tokit', '커피챗', '개발자', '커뮤니티'],
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

const pretendard = localFont({
  src: '../../public/fonts/pretendard/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const suite = localFont({
  src: '../../public/fonts/suite/SUITE-Variable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-suite',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${pretendard.className} ${suite.variable} relative bg-gray-50 antialiased`}>
        <div className="mx-auto h-dvh max-w-(--space-max-layout) min-w-xs bg-white">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="tokit-theme">
            <SonnerProvider>
              <QueryProvider>{children}</QueryProvider>
            </SonnerProvider>
          </ThemeProvider>
        </div>
        <div className="h-auto" id="drawer-customPortal" />
      </body>
    </html>
  );
}
