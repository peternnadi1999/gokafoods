import type { Metadata } from 'next';
import SignupClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Sign Up – GokaFood',
  description: 'Create a new GokaFood account to order food from top restaurants. Quick registration with email and phone verification.',
  keywords: ['GokaFood signup', 'create account', 'register', 'new user', 'food delivery registration'],
  openGraph: {
    title: 'Create Your GokaFood Account',
    description: 'Join GokaFood and start ordering from your favorite restaurants today.',
    type: 'website',
  },
};

export default function Page() {
  return <SignupClientPage />;
}
