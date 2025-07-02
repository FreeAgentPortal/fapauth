// app/auth/login/page.tsx
import AuthModal from '@/layout/authModal/AuthModal.layout';
import { Metadata } from 'next';
import Link from 'next/link';
import ClaimProfile from '@/views/claimProfile/ClaimProfile.view';

export const metadata: Metadata = {
  title: 'Claim Your Profile | Free Agent Portal',
  description: 'Claim your profile on the Free Agent Portal to connect with athletes, teams, and scouts.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Claim Your Profile | Free Agent Portal',
    description: 'Claim your profile to start connecting with athletes, teams, and scouts.',
    url: 'https://freeagentportal.com/auth/claim',
    siteName: 'Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Agent Portal Claim Profile',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claim Your Profile | Free Agent Portal',
    description: 'Claim your profile to connect with athletes, teams, and scouts.',
    images: ['/images/og-default.jpg'],
  },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ profile?: string }> }) {
  return (
    <AuthModal
      title="Claim Your Profile"
      subtitle="Connect with athletes, teams, and scouts"
      footer={
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/auth/register">Register →</Link>

          <Link href="/auth/login">Log in →</Link>
        </div>
      }
    >
      <ClaimProfile />
    </AuthModal>
  );
}
