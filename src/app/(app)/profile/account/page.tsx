import ClientPage from "./ClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Account Settings – GokaFood',
  description: 'Manage your GokaFood account settings. Update your name, phone number, password, and personal information.',
  keywords: ['account settings', 'profile settings', 'password', 'account management', 'GokaFood settings'],
  openGraph: {
    title: 'Account Settings – GokaFood',
    description: 'Update your account information on GokaFood.',
    type: 'website',
  },
};

export default function Page() {
  return <ClientPage />;
}
