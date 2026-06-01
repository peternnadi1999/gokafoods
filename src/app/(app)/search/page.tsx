import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Search Food – GokaFood',
  description: 'Search for your favorite meals and restaurants on GokaFood. Find exactly what you\'re craving and get it delivered fast.',
  keywords: ['search food', 'find meals', 'restaurant search', 'food finder', 'GokaFood search'],
  openGraph: {
    title: 'Search Your Favorite Meals – GokaFood',
    description: 'Quickly find and order food from restaurants on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
