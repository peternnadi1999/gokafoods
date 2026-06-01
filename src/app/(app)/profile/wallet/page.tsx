import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Fund Wallet – GokaFood',
  description: 'Add funds to your GokaFood wallet for faster checkout and easier payments. Secure payment via Paystack.',
  keywords: ['wallet', 'fund wallet', 'payment', 'add funds', 'GokaFood wallet', 'account balance'],
  openGraph: {
    title: 'Fund Your Wallet – GokaFood',
    description: 'Add funds to your GokaFood wallet for convenient payments.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
