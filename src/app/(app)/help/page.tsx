import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Help & Support – GokaFood',
  description: 'Get help with GokaFood. Find answers to FAQs, contact support, and resolve issues with your account and orders.',
  keywords: ['help', 'support', 'FAQ', 'customer support', 'contact us', 'GokaFood help'],
  openGraph: {
    title: 'Help & Support – GokaFood',
    description: 'Get quick support from GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
