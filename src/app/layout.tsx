import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';
import styles from './layout.module.scss';
import AlertCenter from '@/layout/alertCenter/AlertCenter.layout';
import { Suspense } from 'react';
import Loader from '@/components/loader/Loader.component';
import AuthPage from '@/layout/authPage/AuthPage.layout';
import Image from 'next/image';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import Footer from '@/layout/footer/Footer.layout';

const roboto = Roboto_Condensed({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Free Agent Portal - Authentication',
  description: 'Secure authentication portal for athletes and agents to access The Free Agent Portal platform. Register, login, and manage your sports career with confidence.',
  keywords: ['athlete portal', 'sports authentication', 'athlete registration', 'agent portal', 'sports career management'],
  authors: [{ name: 'The Free Agent Portal' }],
  creator: 'The Free Agent Portal',
  publisher: 'The Free Agent Portal',
  applicationName: 'The Free Agent Portal Auth',
  category: 'Sports',
  metadataBase: new URL('https://auth.thefreeagentportal.com'),
  openGraph: {
    title: 'The Free Agent Portal - Athlete Authentication',
    description: 'Secure authentication portal for athletes and agents to access The Free Agent Portal platform.',
    type: 'website',
    locale: 'en_US',
    siteName: 'The Free Agent Portal',
    images: [
      {
        url: '/images/fap icon.png',
        width: 180,
        height: 160,
        alt: 'The Free Agent Portal Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'The Free Agent Portal - Athlete Authentication',
    description: 'Secure authentication portal for athletes and agents.',
    images: ['/images/fap icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <div className={styles.authLayout}>
          <AlertCenter />
          <div className={styles.authOverlay}>
            <div className={styles.authContainer}>
              <Suspense fallback={<Loader />}>
                <AuthPage>
                  <Image src={`/images/fap icon.png`} alt="The Free Agent Portal Logo" priority width={180} height={160} />
                  <ReactQueryProvider>
                    <main className={styles.authModal}>{children}</main>
                  </ReactQueryProvider>
                  <Footer />
                </AuthPage>
              </Suspense>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
