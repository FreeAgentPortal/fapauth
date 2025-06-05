'use client';
import styles from './AuthPage.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUserStore } from '@/state/user';
import { useInterfaceStore } from '@/state/interface';
import Modal from '@/components/modal/Modal.component';
import Loader from '@/components/loader/Loader.component';
import { LoaderProvider } from '@/components/progressBar/LoaderProvider.component';
import { useLoader } from '@/components/progressBar/useLoader';
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
    // console.log("We're redirecting to", to);
    window.location.href = to as any;

    // after redirect dispatch the logout action to keep the token from being stored indefinitely
    logout();
  };

  useEffect(() => {
    if (shouldLogout) logout();

    try {
      if (redirect) {
        setRedirectUrl(redirect);
        setRedirectName(redirect?.split(/[/.]/)[2][0].toUpperCase() + redirect?.split(/[/.]/)[2].slice(1).toLowerCase());
      }
      if (redirectUrl) {
        setRedirectName(redirectUrl?.split(/[/.]/)[2][0].toUpperCase() + redirectUrl?.split(/[/.]/)[2].slice(1).toLowerCase());
      }
    } catch {
      setRedirectName('');
    }
  }, [router, redirect, redirectUrl]);

  useEffect(() => {
    // if (partner) {
    //   setPartner(partner);
    // }

    if (user) {
      if (!user.isEmailVerified) {
        // setCurrentSignUpStep(5);
        router.push('/signup');
        return;
      }

      if (redirect) return performRedirect(redirect + `?token=${token}`);

      performRedirect(
        process.env.ENV === 'development' ? `http://localhost:3000/home${user ? `?token=${token}` : ''}` : `https://portal.pyreprocessing.com/home${user ? `?token=${token}` : ''}`
      );
    }
  }, [user, redirect, partner]);

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
        <div className={styles.auth}>
          {redirectName && <div className={styles.banner}>{redirectName}</div>}
          <LoaderProvider>{props.children}</LoaderProvider>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
