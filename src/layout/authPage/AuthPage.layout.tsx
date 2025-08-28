'use client';
import styles from './AuthPage.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUserStore } from '@/state/user';
import { useInterfaceStore } from '@/state/interface';
import Modal from '@/components/modal/Modal.component';
import Loader from '@/components/loader/Loader.component';
import { LoaderProvider } from '@/components/progressBar/LoaderProvider.component';

import setAuthToken from '@/utils/setAuthToken';
import NextTopLoader from 'nextjs-toploader';
type Props = {
  children: React.ReactNode;
};

const AuthPage = (props: Props) => {
  const router = useRouter();
  const { user, logout, token } = useUserStore((state) => state);
  const { setRedirect: setRedirectUrl, redirect: redirectUrl, redirectName, setRedirectName } = useInterfaceStore((state) => state);
  // pull query params out
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') as string;
  const shouldLogout = searchParams.get('logout') == 'true';
  // destructure partner from the query params\
  const partner = searchParams.get('partner') as string;

  const performRedirect = (to: string) => {
    window.location.href = to as any;

    // after redirect dispatch the logout action to keep the token from being stored indefinitely
    logout();
  };

  const getGoodRedirectName = (title: string) => {
    switch (title?.split(/[/.]/)[2][0].toUpperCase() + title?.split(/[/.]/)[2].slice(1).toLowerCase()) {
      case 'Thefreeagentportal':
        return 'Public Portal';
      case 'Athlete':
        return 'Athlete Portal';
      case 'Team':
        return 'Team Portal';
      case 'Admin':
        return 'Admin Portal';
      default:
        return 'The Free Agent Portal';
    }
  };

  useEffect(() => {
    if (shouldLogout) logout();

    try {
      if (redirect) {
        setRedirectUrl(redirect);
        setRedirectName(getGoodRedirectName(redirect));
      }
      if (redirectUrl) {
        setRedirectName(getGoodRedirectName(redirectUrl));
      }
    } catch {
      setRedirectName('');
    }
  }, [router, redirect, redirectUrl]);

  useEffect(() => {
    if (partner) {
    }
    if (user) {
      setAuthToken(user.token as any);
    }

    if (token) {
      if (redirect) return performRedirect(redirect + `?token=${token}`);

      performRedirect((process.env.NEXT_PUBLIC_APP_URL as string) + `?token=${token}`);
    }
  }, [token, redirect, partner]);

  return (
    <div className={styles.wrapper}>
      <Modal open={!!(user && user.isEmailVerified)} centered footer={null} closable={false} maskClosable={false}>
        <div className={styles.redirectModal}>
          <Loader />
          <h4>
            Taking you to <br />
            <span>{/* {redirectName} */}</span>
          </h4>
        </div>
      </Modal>

      <div className={styles.container}>
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary-dark),0 0 5px var(--primary)"
          showForHashAnchor
        />
        <div className={styles.auth}>
          {redirectName && <div className={styles.banner}>{redirectName}</div>}
          <LoaderProvider>{props.children}</LoaderProvider>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
