import React from 'react';
import styles from './Steps.module.scss';
import useApiHook from '@/hooks/useApi';

type VerificationProps = {
  email?: string;
};

const Verification = ({ email }: VerificationProps) => {
  const { mutate: resendVerificationEmail } = useApiHook({
    method: 'POST',
    key: 'resendVerificationEmail',
  }) as any;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Verify Your Email</h2>
      <div className={styles.contentContainer}>
        <p>Thank you for registering with Free Agent Portal.</p>

        <p>
          We&apos;ve sent a verification email to:
          <strong> {email ?? 'your inbox'}</strong>
        </p>

        <p>Please click the link in that email to complete your account setup. You can close this window once you&apos;ve confirmed your email.</p>
        <button
          className={styles.button}
          onClick={() => {
            resendVerificationEmail(
              { url: '/auth/resend-verification-email', formData: { email } },
              {
                onSuccess: () => {
                  alert('Verification email resent successfully!');
                },
                onError: (err: any) => {
                  console.error('Error resending verification email:', err);
                  alert('There was a problem resending the verification email. Please try again later.');
                },
              }
            );
          }}
        >
          Resend Verification Email
        </button>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem' }}>Didn&apos;t receive it? Check your spam folder or request a new one later.</p>
      </div>
    </div>
  );
};

export default Verification;
