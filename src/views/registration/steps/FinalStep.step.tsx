'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/Form.module.scss';
import { useRouter } from 'next/navigation';
import useApiHook from '@/hooks/useApi';

interface FinalStepProps {
  formData: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
    athlete?: any;
    team?: any;
    agent?: any;
  };
  advStep: () => void;
}

export default function FinalStep({ formData, advStep }: FinalStepProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: register } = useApiHook({
    method: 'POST',
    key: 'register',
  }) as any;

  const registerAll = async () => {
    try {
      // 1. Register the base user
      await register(
        {
          url: '/auth/register',
          formData: {
            ...formData.user,
            roles: Object.keys(formData).filter((key) => key !== 'user'),
            profileData: {
              athlete: { ...formData.athlete },
              team: { ...formData.team },
              agent: { ...formData.agent },
            },
          },
        },
        {
          onSuccess: (data: any) => {
            console.log('User registered successfully:', data);
            setSubmitted(true);
            advStep();
          },
          onError: (err: any) => {
            console.error('Error registering user:', err);
            setSubmitted(true);
            setError('There was a problem registering your account. Please try again.');
          },
        }
      );
      // 3. Success — redirect to dashboard or confirmation
      // router.push('/auth/success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.form}>
      {/* <h2 className={styles.heading}>Finalizing your registration...</h2> */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setSubmitting(true);
          registerAll();
        }}
      >
        Submit
      </button>
      {submitting && <p>Submitting your information. Please wait....</p>}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
