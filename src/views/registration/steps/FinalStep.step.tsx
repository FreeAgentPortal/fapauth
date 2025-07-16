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

  const getRoles = () => {
    return Object.keys(formData).filter((key) => key !== 'user');
  };

  const getProfileSummary = () => {
    const roles = getRoles();
    const summary = [];

    if (roles.includes('athlete') && formData.athlete) {
      summary.push(`Athlete - ${formData.athlete.sport || 'Sport not specified'}`);
    }
    if (roles.includes('team') && formData.team) {
      summary.push(`Team - ${formData.team.teamName || 'Team name not specified'}`);
    }
    if (roles.includes('agent') && formData.agent) {
      summary.push(`Agent - ${formData.agent.agencyName || 'Agency not specified'}`);
    }

    return summary;
  };

  return (
    <div className={styles.form}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>Complete Your Registration</h2>
        <p style={{ color: '#ccc', fontSize: '0.95rem' }}>Review your information and submit to create your account</p>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>Account Summary</h3>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Name:</p>
          <p style={{ color: 'white', fontWeight: '500' }}>
            {formData.user.firstName} {formData.user.lastName}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email:</p>
          <p style={{ color: 'white', fontWeight: '500' }}>{formData.user.email}</p>
        </div>

        <div>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Profile Type(s):</p>
          {getProfileSummary().length > 0 ? (
            <ul style={{ color: 'white', paddingLeft: '1rem', margin: 0 }}>
              {getProfileSummary().map((role, index) => (
                <li key={index} style={{ marginBottom: '0.25rem' }}>
                  {role}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'white', fontWeight: '500' }}>No specific profile selected</p>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <span className={styles.error}>{error}</span>
        </div>
      )}

      {submitting && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          <p style={{ color: 'white', margin: 0, fontSize: '0.95rem' }}>⏳ Submitting your information. Please wait...</p>
        </div>
      )}

      <div className={styles.btnContainer}>
        <button className={styles.back} onClick={() => router.back()} disabled={submitting}>
          ← Back
        </button>
        <button
          className={styles.submit}
          onClick={(e) => {
            e.preventDefault();
            setSubmitting(true);
            registerAll();
          }}
          disabled={submitting}
        >
          {submitting ? 'Creating Account...' : 'Complete Registration'}
        </button>
      </div>
    </div>
  );
}
