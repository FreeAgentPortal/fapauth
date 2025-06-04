'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthModal from '@/layout/authModal/AuthModal.layout';
import useApiHook from '@/hooks/useApi';
import styles from './VerifyEmail.module.scss';

type Status = 'verifying' | 'success' | 'error';

export default function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('verifying');

  const { mutate: verifyEmail } = useApiHook({
    method: 'POST',
    key: 'verifyEmail',
    successMessage: 'Email verified',
  }) as any;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    verifyEmail(
      { url: '/auth/verifyEmail', formData: { token } },
      {
        onSuccess: () => setStatus('success'),
        onError: () => setStatus('error'),
      }
    );
  }, [token, verifyEmail]);

  const renderMessage = () => {
    switch (status) {
      case 'success':
        return <p>Your email has been verified. You can close this window.</p>;
      case 'error':
        return <p>There was a problem verifying your email.</p>;
      default:
        return <p>Verifying your email...</p>;
    }
  };

  return (
    <AuthModal title="Verify Email" showBackButton>
      <div className={styles.container}>{renderMessage()}</div>
    </AuthModal>
  );
}

