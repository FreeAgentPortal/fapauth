// app/auth/login/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Free Agent Portal',
  description: 'Securely log in to your Free Agent Portal account to access your athlete, team, or scout profile.',
  robots: 'noindex, nofollow', // optional for private apps
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


export default function Page() {
  return (
    <div>
      <h1>Authentication Page</h1>
      <p>Please log in or sign up to continue.</p>
      {/* Add your authentication form or components here */}
    </div>
  );
}