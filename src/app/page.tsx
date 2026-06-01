import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GokaFood – Tastes That Move You',
  description: 'Fast & reliable food delivery service in Nigeria. Order from your favorite restaurants and enjoy quick delivery. Download GokaFood app today.',
  keywords: ['food delivery', 'order food online', 'Nigeria food delivery', 'GokaFood', 'quick delivery', 'restaurant delivery', 'GKF'],
  openGraph: {
    title: 'GokaFood – Tastes That Move You',
    description: 'Fast & reliable food delivery service in Nigeria. Order from your favorite restaurants and enjoy quick delivery.',
    url: 'https://gokafood.com',
    type: 'website',
    images: [
      {
        url: 'https://gokafood.com/images/gokafood.jpeg',
        width: 1200,
        height: 630,
        alt: 'GokaFood - Food Delivery Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GokaFood – Tastes That Move You',
    description: 'Fast & reliable food delivery service in Nigeria.',
    images: ['https://gokafood.com/images/gokafood.jpeg'],
  },
};

export default function RootPage() {
  redirect('/welcome');
}
