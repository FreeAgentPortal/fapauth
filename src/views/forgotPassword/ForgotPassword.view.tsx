'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthModal from '@/layout/authModal/AuthModal.layout';
import useApiHook from '@/hooks/useApi';
import formStyles from '@/styles/Form.module.scss';
import styles from './ForgotPassword.module.scss';

interface ForgotPasswordData {
  email: string;
}

export default function ForgotPasswordView() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>();

  const { mutate: requestReset } = useApiHook({
    method: 'POST',
    key: 'forgotPassword',
    successMessage: 'If that email exists, we\'ve sent a reset link.',
  }) as any;

  const onSubmit = (data: ForgotPasswordData) => {
    requestReset(
      { url: '/auth/forgot-password', formData: data },
      { onSuccess: () => setSent(true) }
    );
  };

  return (
    <AuthModal title="Forgot Password" showBackButton>
      {sent ? (
        <div className={styles.sentMessage}>
          <p>Check your email for a link to reset your password.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={`${formStyles.form} ${styles.form}`}>
          <div className={formStyles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <span className={formStyles.error}>{errors.email.message}</span>
            )}
          </div>
          <button type="submit" className={formStyles.submit}>
            Send Reset Link
          </button>
        </form>
      )}
    </AuthModal>
  );
}
