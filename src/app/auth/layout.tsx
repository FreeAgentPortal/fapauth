// app/auth/layout.tsx
import React, { ReactNode, Suspense } from 'react';
import styles from './layout.module.scss';
import { Metadata } from 'next';
import Image from 'next/image';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import AlertCenter from '@/layout/alertCenter/AlertCenter.layout';
import Footer from '@/layout/footer/Footer.layout';
import AuthPage from '@/layout/authPage/AuthPage.layout';
import Loader from '@/components/loader/Loader.component';
export const metadata: Metadata = {
  metadataBase: new URL('https://freeagentportal.com'),
  title: 'Authentication | Free Agent Portal',
  description: 'Access your Free Agent Portal account or register a new one. Built for athletes, teams, and scouts.',
  openGraph: {
    title: 'Authentication | Free Agent Portal',
    description: 'Log in or register to access your profile on the Free Agent Portal.',
    url: 'https://freeagentportal.com/auth',
    siteName: 'Free Agent Portal',
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Agent Portal Auth',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authentication | Free Agent Portal',
    description: 'Log in or sign up for the Free Agent Portal.',
    images: ['/images/og-default.jpg'],
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.authLayout}>
      <video src="https://res.cloudinary.com/dsltlng97/video/upload/v1751466457/stadium-lights_vi9bhe.mp4" id="video" muted loop autoPlay className={styles.authBackground} />
      <AlertCenter />
      {/* <div className={styles.authBackground} /> */}
      <div className={styles.authOverlay}>
        <div className={styles.authContainer}>
          <Suspense fallback={<Loader />}>
            <AuthPage>
              <Image src={`/images/fap icon.png`} alt="Free Agent Portal Logo" priority width={160} height={160} />
              <ReactQueryProvider>
                <main className={styles.authModal}>{children}</main>
              </ReactQueryProvider>
              <Footer />
            </AuthPage>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
