'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AuthModal from '@/layout/authModal/AuthModal.layout';
import useApiHook from '@/hooks/useApi';
import formStyles from '@/styles/Form.module.scss';
import styles from './ResetPassword.module.scss';

type Props = {
  token: string;
};

interface ResetPasswordData {
  password: string;
  passwordConfirm: string;
}

const ResetPassword = ({ token }: Props) => {
  const router = useRouter();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetFailed, setResetFailed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  // Reset password mutation
  const { mutate: resetPassword, isLoading: isResetting } = useApiHook({
    method: 'PUT',
    key: 'resetPassword',
    successMessage: 'Password reset successfully!',
  }) as any;

  const onSubmit = (data: ResetPasswordData) => {
    if (!token) {
      // Handle case where no token is provided
      return;
    }

    // Reset any previous error state
    setResetFailed(false);

    resetPassword(
      {
        url: `/auth/reset-password/${token}`,
        formData: {
          password: data.password,
          token: token,
        },
      },
      {
        onSuccess: () => {
          setResetSuccess(true);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        },
        onError: (error: any) => {
          // Show the invalid reset link section when reset fails
          setResetFailed(true);
          console.error('Password reset failed:', error);
        },
      }
    );
  };

  const handleResendResetLink = () => {
    router.push('/auth/forgot-password');
  };

  const password = watch('password');

  // No token provided OR reset failed (invalid/expired token)
  if (!token || resetFailed) {
    return (
      <AuthModal title="Invalid Reset Link" showBackButton>
        <div className={styles.statusMessage}>
          <div className={styles.errorIcon}>❌</div>
          <h3>Invalid Reset Link</h3>
          <p>
            {!token
              ? 'This password reset link is invalid or missing the required token.'
              : 'This password reset link has expired or is no longer valid. Please request a new one.'}
          </p>
          <button className={formStyles.submit} onClick={handleResendResetLink}>
            Request New Reset Link
          </button>
        </div>
      </AuthModal>
    );
  }

  // Success state
  if (resetSuccess) {
    return (
      <AuthModal title="Password Reset Successful" showBackButton>
        <div className={styles.statusMessage}>
          <div className={styles.successIcon}>✅</div>
          <h3>Password Reset Successfully!</h3>
          <p>Your password has been updated. You will be redirected to the login page in a few seconds.</p>
          <button className={formStyles.submit} onClick={() => router.push('/auth/login')}>
            Go to Login
          </button>
        </div>
      </AuthModal>
    );
  }

  // Show reset form
  return (
    <AuthModal title="Reset Your Password" showBackButton>
      <form onSubmit={handleSubmit(onSubmit)} className={`${formStyles.form} ${styles.form}`}>
        <p className={styles.instructions}>Please enter your new password below. Make sure it's secure and easy for you to remember.</p>

        <div className={formStyles.field}>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
              },
            })}
          />
          {errors.password && <span className={formStyles.error}>{errors.password.message}</span>}
        </div>

        <div className={formStyles.field}>
          <label htmlFor="passwordConfirm">Confirm New Password</label>
          <input
            id="passwordConfirm"
            type="password"
            {...register('passwordConfirm', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.passwordConfirm && <span className={formStyles.error}>{errors.passwordConfirm.message}</span>}
        </div>

        <button type="submit" className={formStyles.submit} disabled={isResetting}>
          {isResetting ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </AuthModal>
  );
};

export default ResetPassword;
