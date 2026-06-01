import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Rewards – GokaFood',
  description: 'View and claim your GokaFood rewards. Earn stamps with every order and unlock free meals from your favorite restaurants.',
  keywords: ['rewards', 'stamp card', 'free meal', 'loyalty program', 'GokaFood rewards', 'points'],
  openGraph: {
    title: 'Your Rewards – GokaFood',
    description: 'Earn and redeem rewards on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
