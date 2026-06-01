import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'My Orders – GokaFood',
  description: 'View and track your food delivery orders. Check order status, delivery details, and reorder your favorites on GokaFood.',
  keywords: ['my orders', 'order history', 'track order', 'order status', 'GokaFood orders'],
  openGraph: {
    title: 'My Orders – GokaFood',
    description: 'Track your food delivery orders and view your order history on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
