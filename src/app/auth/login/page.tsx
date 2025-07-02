// app/auth/login/page.tsx
import AuthModal from '@/layout/authModal/AuthModal.layout';
import { Metadata } from 'next';
import LoginForm from '../../../components/loginForm/LoginForm.form';
import LoginWrapper from '@/views/login/LoginWrapper.component';

export const metadata: Metadata = {
  title: 'Login | Free Agent Portal',
  description: 'Securely log in to your Free Agent Portal account to access your athlete, team, or scout profile.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Login | Free Agent Portal',
    description: 'Securely access your Free Agent Portal account.',
    url: 'https://freeagentportal.com/auth/login',
    siteName: 'Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Agent Portal Login',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login | Free Agent Portal',
    description: 'Login to manage your profile on the Free Agent Portal.',
    images: ['/images/og-default.jpg'],
  },
};

export default function LoginPage() {
  return (
    <AuthModal
      title="Welcome Back"
      subtitle="Enter your credentials to continue"
      footer={
        <>
          <p>
            Don&apos;t have an account? <a href="/auth/register">Register →</a>
          </p>
          <p>
            <a href="/auth/forgot-password">Forgot password?</a>
          </p>
        </>
      }
    >
      <LoginWrapper />
    </AuthModal>
  );
}
