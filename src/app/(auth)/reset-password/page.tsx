import type { Metadata } from 'next';
import ResetPasswordClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Reset Password – GokaFood',
  description: 'Create a new password for your GokaFood account. Secure your account with a strong password.',
  keywords: ['reset password', 'new password', 'account security', 'GokaFood'],
  openGraph: {
    title: 'Set Your New Password',
    description: 'Complete your GokaFood account recovery.',
    type: 'website',
  },
};

export default function Page() {
  return <ResetPasswordClientPage />;
}
