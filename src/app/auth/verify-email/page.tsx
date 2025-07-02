import { Metadata } from 'next';
import VerifyEmailView from '@/views/verifyEmail/VerifyEmail.view';

export const metadata: Metadata = {
  metadataBase: new URL('https://freeagentportal.com'),
  title: 'Verify Email | Free Agent Portal',
  description:
    'Confirm your email address to activate your Free Agent Portal account.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Verify Email | Free Agent Portal',
    description:
      'Confirm your email address to activate your Free Agent Portal account.',
    url: 'https://freeagentportal.com/auth/verify-email',
    siteName: 'Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Agent Portal Verify Email',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verify Email | Free Agent Portal',
    description: 'Verify your Free Agent Portal email address.',
    images: ['/images/og-default.jpg'],
  },
};

export default function VerifyEmailPage() {
  return <VerifyEmailView />;
}

