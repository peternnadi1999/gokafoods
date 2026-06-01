import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata = {
  title: 'Discover – GokaFood',
  description: 'Browse and discover delicious meals from top-rated restaurants near you. Explore featured foods, find your favorites, and order with GokaFood.',
  keywords: ['discover food', 'browse restaurants', 'food categories', 'featured meals', 'GokaFood discover', 'Nigerian food delivery'],
  openGraph: {
    title: 'Discover Delicious Meals – GokaFood',
    description: 'Explore and order from top restaurants on GokaFood. Fast delivery, quality food.',
    type: 'website',
    images: [
      {
        url: 'https://gokafood.com/images/gokafood.jpeg',
        width: 1200,
        height: 630,
        alt: 'Discover meals on GokaFood',
      },
    ],
  },
};

export default function Page() {
  return <ClientPage />;
}
