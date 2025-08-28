// LoginForm.form.tsx
'use client';

import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.scss';
import useApiHook from '@/hooks/useApi';

type LoginFormData = {
  email: string;
  password: string;
};

type Props = {
  onSuccess?: (token: string, response: any) => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { mutate: login } = useApiHook({
    method: 'POST',
    key: 'login',
    successMessage: 'Login successful',
  }) as any;

  const onSubmit = (data: LoginFormData) => {
    login(
      {
        url: '/auth/login',
        formData: data,
      },
      {
        onSuccess: (response: any) => { 
          if (response?.token && onSuccess) {
            onSuccess(response.token, response);
          }
        },
        onError: (error: any) => {
          console.error('Login failed:', error);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register('email', { required: 'Email is required' })} />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordInput}>
          <input type="password" id="password" {...register('password', { required: 'Password is required' })} />
        </div>
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>
      <button type="submit" className={styles.submitButton}>
        Log In
      </button>
    </form>
  );
}
