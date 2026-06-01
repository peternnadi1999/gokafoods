import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Foods Menu – GokaFood',
  description: 'Browse our complete food menu with various categories. Find meals from the best restaurants and order online with GokaFood.',
  keywords: ['food menu', 'meals', 'restaurants', 'food categories', 'GokaFood menu', 'order food online'],
  openGraph: {
    title: 'Food Menu – GokaFood',
    description: 'Explore all available meals and restaurants on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
