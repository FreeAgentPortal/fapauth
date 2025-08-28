'use client';
import AuthModal from '@/layout/authModal/AuthModal.layout';
import Link from 'next/link';
import styles from './page.module.scss';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  return (
    <AuthModal title="Get Started" subtitle="Choose an option to continue">
      <div className={styles.authCardGrid}>
        <div className={styles.authCard}>
          <h3>Already have an account?</h3>
          <p>Log in to your dashboard.</p>
          <Link href={'/auth/login' + (redirect ? `?redirect=${redirect}` : '')} className={styles.authCardBtn}>
            Login →
          </Link>
        </div>
        <div className={styles.authCard}>
          <h3>New to the portal?</h3>
          <p>Create your account to get started.</p>
          <Link href={'/auth/register' + (redirect ? `?redirect=${redirect}` : '')} className={styles.authCardBtn}>
            Register →
          </Link>
        </div>
      </div>
    </AuthModal>
  );
}
