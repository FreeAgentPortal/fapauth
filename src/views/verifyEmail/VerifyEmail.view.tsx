'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import AuthModal from '@/layout/authModal/AuthModal.layout';
import useApiHook from '@/hooks/useApi';
import formStyles from '@/styles/Form.module.scss';
import styles from './VerifyEmail.module.scss';

type Status = 'form' | 'verifying' | 'success';
interface EmailData {
  email: string;
}

export default function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'form');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailData>();

  const { mutate: verifyEmail } = useApiHook({
    method: 'POST',
    key: 'verifyEmail',
    successMessage: 'Email verified',
  }) as any;

  const { mutate: resendVerificationEmail } = useApiHook({
    method: 'POST',
    key: 'resendVerificationEmail',
    successMessage: 'Verification email sent',
  }) as any;

  const onSubmit = (data: EmailData) => {
    resendVerificationEmail({
      url: '/auth/resend-verification-email',
      formData: data,
    });
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    verifyEmail(
      { url: '/auth/verifyEmail', formData: { token } },
      {
        onSuccess: () => setStatus('success'),
        onError: () => setStatus('form'),
      }
    );
  }, [token, verifyEmail]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return <p>Your email has been verified. You can close this window.</p>;
      case 'verifying':
        return <p>Verifying your email...</p>;
      default:
        return (
          <form onSubmit={handleSubmit(onSubmit)} className={`${formStyles.form}`}>
            <div className={formStyles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <span className={formStyles.error}>{errors.email.message}</span>}
            </div>
            <button type="submit" className={formStyles.submit}>
              Send Verification Email
            </button>
          </form>
        );
    }
  };

  return (
    <AuthModal title="Verify Email" showBackButton>
      <div className={styles.container}>{renderContent()}</div>
    </AuthModal>
  );
}
