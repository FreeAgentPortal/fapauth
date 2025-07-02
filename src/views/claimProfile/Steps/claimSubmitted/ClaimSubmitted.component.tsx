'use client';
import React from 'react';
import styles from './ClaimSubmitted.module.scss';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import useApiHook from '@/hooks/useApi';

const ClaimSubmitted = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  const { data, isLoading } = useApiHook({
    url: `/auth/claim/profile?slug=${slug}&type=${type}`,
    method: 'GET',
    key: ['profile', slug as string],
    enabled: !!slug && !!type,
  }) as any;

  if (isLoading) return <div className={styles.loader}>Loading...</div>;

  const status = data?.payload?.status ?? 'not-started';
  const statusMessage = {
    pending: {
      title: 'Claim Under Review',
      message: 'Your claim has been submitted and is currently under review. You will be notified once a decision is made.',
    },
    approved: {
      title: 'Claim Approved',
      message: 'Your claim has been approved. You now have access to manage this profile.',
    },
    denied: {
      title: 'Claim Denied',
      message: 'Unfortunately, your claim was not approved. Please contact support if you believe this was a mistake.',
    },
    'not-started': {
      title: 'No Claim Found',
      message: 'There is no active claim associated with this profile. Please start the process from the beginning.',
    },
  };

  const { title, message } = statusMessage[status as keyof typeof statusMessage] || statusMessage['not-started'];
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {/* check the data.payload.message if it exists render it */}
      {data?.payload?.message? <p className={styles.message}>{data.payload.message}</p> : <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ClaimSubmitted;
