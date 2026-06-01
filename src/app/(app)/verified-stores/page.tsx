import type { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: 'Verified Restaurants – GokaFood',
  description: 'Browse all verified and trusted restaurants on GokaFood. Quality assured service with fast delivery and fresh meals.',
  keywords: ['verified restaurants', 'trusted restaurants', 'restaurant list', 'food delivery', 'GokaFood partners'],
  openGraph: {
    title: 'Verified Restaurants – GokaFood',
    description: 'Order from verified and trusted restaurants on GokaFood.',
    type: 'website',
    images: [
      {
        url: 'https://gokafood.com/images/gokafood.jpeg',
        width: 1200,
        height: 630,
        alt: 'Verified restaurants',
      },
    ],
  },
};

export default function Page() {
  return <ClientPage />;
}
