import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Profile – GokaFood',
  description: 'Manage your GokaFood profile. View account settings, wallet, rewards, orders, and personal information.',
  keywords: ['profile', 'account', 'user account', 'settings', 'wallet', 'GokaFood profile'],
  openGraph: {
    title: 'Your Profile – GokaFood',
    description: 'Manage your GokaFood account and preferences.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
