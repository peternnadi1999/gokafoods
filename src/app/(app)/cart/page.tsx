import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Shopping Cart – GokaFood',
  description: 'Review your cart and proceed to checkout on GokaFood. Easy payment options and fast delivery.',
  keywords: ['shopping cart', 'checkout', 'order review', 'food cart', 'payment'],
  openGraph: {
    title: 'Your Shopping Cart – GokaFood',
    description: 'Review your items and complete your order on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
