import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'My Wishlist – GokaFood',
  description: 'View your saved favorite meals on GokaFood. Add items to cart and order whenever you\'re ready.',
  keywords: ['wishlist', 'favorite meals', 'saved foods', 'bookmarks', 'GokaFood wishlist'],
  openGraph: {
    title: 'My Wishlist – GokaFood',
    description: 'View and manage your favorite meals on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
