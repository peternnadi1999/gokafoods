import type { Metadata, Viewport } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import { ReactQueryProvider } from '@/lib/api/query-client';
import { Toaster } from 'sonner';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GokaFood – Tastes That Move You',
    template: '%s | GokaFood',
  },
  description: 'Quick & fastest food delivery. Order your favourite meals from nearby restaurants.',
  keywords: ['food delivery', 'order food', 'Nigeria', 'GokaFood', 'GKF'],
  authors: [{ name: 'GokaFood' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GokaFood',
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    siteName: 'GokaFood',
    title: 'GokaFood – Tastes That Move You',
    description: 'Quick & fastest food delivery across Nigeria',
  },
};

export const viewport: Viewport = {
  themeColor: '#D4521A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-poppins antialiased bg-gray-50">
        <ReactQueryProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-poppins)',
                fontSize: '14px',
                borderRadius: '12px',
              },
            }}
            richColors
            closeButton
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
