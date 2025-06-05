import { Metadata } from 'next';
import ForgotPasswordView from '@/views/forgotPassword/ForgotPassword.view';

export const metadata: Metadata = {
  title: 'Forgot Password | Free Agent Portal',
  description: 'Reset your Free Agent Portal password.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Forgot Password | Free Agent Portal',
    description: 'Reset your Free Agent Portal password.',
    url: 'https://freeagentportal.com/auth/forgot-password',
    siteName: 'Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Agent Portal Forgot Password',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forgot Password | Free Agent Portal',
    description: 'Reset your Free Agent Portal password.',
    images: ['/images/og-default.jpg'],
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
