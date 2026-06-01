import type { Metadata } from 'next';
import LoginClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Login – GokaFood',
  description: 'Sign in to your GokaFood account to access your orders, wallet, and saved restaurants. Quick and secure login.',
  keywords: ['GokaFood login', 'sign in', 'user account', 'food delivery login'],
  openGraph: {
    title: 'Login to GokaFood',
    description: 'Access your GokaFood account to track orders and manage your preferences.',
    type: 'website',
  },
};

export default function Page() {
  return <LoginClientPage />;
}
