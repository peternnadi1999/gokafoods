import type { Metadata } from 'next';
import WelcomeClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Welcome to GokaFood',
  description: 'Join GokaFood and order from your favorite restaurants. Quick login or sign up with email.',
};

export default function Page() {
  return <WelcomeClientPage />;
}
