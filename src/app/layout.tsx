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
  description: 'Quick & fastest food delivery. Order your favourite meals from nearby restaurants. Download GokaFood app for instant delivery across Nigeria.',
  keywords: ['food delivery', 'order food', 'Nigeria', 'GokaFood', 'GKF', 'fast delivery', 'restaurant delivery', 'online food ordering'],
  authors: [{ name: 'GokaFood' }],
  creator: 'GokaFood',
  publisher: 'GokaFood',
  category: 'Food & Restaurants',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GokaFood',
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://gokafood.com',
    siteName: 'GokaFood',
    title: 'GokaFood – Tastes That Move You',
    description: 'Quick & fastest food delivery across Nigeria. Order from top restaurants.',
    images: [
      {
        url: 'https://gokafood.com/images/gokafood.jpeg',
        width: 1200,
        height: 630,
        alt: 'GokaFood - Food Delivery Service',
        type: 'image/jpeg',
      },
      {
        url: 'https://gokafood.com/icons/icon-192x192.png',
        width: 192,
        height: 192,
        alt: 'GokaFood Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GokaFood – Tastes That Move You',
    description: 'Quick & fastest food delivery in Nigeria.',
    creator: '@gokafood',
    images: ['https://gokafood.com/images/gokafood.jpeg'],
  },
  metadataBase: new URL('https://gokafood.com'),
  alternates: {
    canonical: 'https://gokafood.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Add your actual verification code
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
  // Structured data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FoodDeliveryService',
    name: 'GokaFood',
    url: 'https://gokafood.com',
    logo: 'https://gokafood.com/icons/icon-192x192.png',
    description: 'Fast and convenient food delivery service in Nigeria',
    sameAs: [
      'https://www.facebook.com/gokafood',
      'https://www.instagram.com/gokafood',
      'https://www.tiktok.com/@gokafood',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+2349135913460',
      contactType: 'Customer Service',
      areaServed: 'NG',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
    },
  };

  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#D4521A" />
        <meta name="msapplication-TileColor" content="#D4521A" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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
