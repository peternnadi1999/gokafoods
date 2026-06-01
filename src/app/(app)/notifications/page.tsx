import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Notifications – GokaFood',
  description: 'View your GokaFood notifications. Stay updated on your orders, promotions, and special offers.',
  keywords: ['notifications', 'updates', 'order alerts', 'promotions', 'GokaFood notifications'],
  openGraph: {
    title: 'Your Notifications – GokaFood',
    description: 'Stay informed with GokaFood notifications.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
