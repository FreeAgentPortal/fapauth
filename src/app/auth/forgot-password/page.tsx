import { Metadata } from 'next';
import ForgotPasswordView from '@/views/forgotPassword/ForgotPassword.view';

export const metadata: Metadata = {
  metadataBase: new URL('https://thefreeagentportal.com'),
  title: 'Forgot Password | The Free Agent Portal',
  description: 'Reset your The Free Agent Portal password.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Forgot Password | The Free Agent Portal',
    description: 'Reset your The Free Agent Portal password.',
    url: 'https://thefreeagentportal.com/auth/forgot-password',
    siteName: 'The Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'The Free Agent Portal Forgot Password',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forgot Password | The Free Agent Portal',
    description: 'Reset your The Free Agent Portal password.',
    images: ['/images/og-default.jpg'],
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
