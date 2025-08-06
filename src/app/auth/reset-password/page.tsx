import { Metadata } from 'next';
import ResetPassword from '@/views/reset-password/ResetPassword.view';

export const metadata: Metadata = {
  title: 'Reset Password | The Free Agent Portal',
  description: 'Reset your The Free Agent Portal password.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Reset Password | The Free Agent Portal',
    description: 'Reset your The Free Agent Portal password.',
    url: 'https://thefreeagentportal.com/auth/reset-password',
    siteName: 'The Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'The Free Agent Portal Reset Password',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reset Password | The Free Agent Portal',
    description: 'Reset your The Free Agent Portal password.',
    images: ['/images/og-default.jpg'],
  },
};

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const token = searchParams.token;

  return <ResetPassword token={token || ''} />;
}
