import type { Metadata } from 'next';
import VerifyEmailClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'Verify Your Email – GokaFood',
  description: 'Verify your email address to activate your GokaFood account and start ordering food.',
  keywords: ['email verification', 'verify email', 'GokaFood account activation'],
  openGraph: {
    title: 'Email Verification',
    description: 'Complete your GokaFood registration by verifying your email.',
    type: 'website',
  },
};

export default function Page() {
  return <VerifyEmailClientPage />;
}