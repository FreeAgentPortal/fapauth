'use client';
import React from 'react';
import styles from './Profile.module.scss';
import { useSearchParams } from 'next/navigation';
import useApiHook from '@/hooks/useApi';
import Loader from '@/components/loader/Loader.component';
import Image from 'next/image';
import { url } from 'inspector';

interface ProfileProps {
  handleNext: (data: any) => void;
  handleBack: () => void;
}

const Profile = ({ handleNext, handleBack }: ProfileProps) => {
  // get the slug and type param from the url
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');

  const { data, isLoading } = useApiHook({
    url: `/auth/claim/profile?slug=${slug}&type=${type}`,
    method: 'GET',
    key: ['profile', slug as string],
    enabled: !!slug && !!type,
  }) as any;

  const { mutate: createClaimProcess } = useApiHook({
    method: 'POST',
    key: ['profile', slug as string],
    enabled: false,
  }) as any;

  if (isLoading) return <Loader />;
  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        {/* placeholder to hold name, and profile picture of the profile */}
        <h1>{data?.profile?.name}</h1>
        <Image src={data?.profile?.logos[0].href ?? null} alt={`${data?.profile?.name}'s profile picture`} className={styles.profilePicture} width={200} height={200} />
      </div>
      {/* once we have data, we want to check if there was a claim process started {success: true} */}
      {/* if there has been one started we can move to the next step immediately */}
      {data?.success ? (
        <div className={styles.subContainer}>
          <h2>Profile Claim Process Started Successfully</h2>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => handleBack && handleBack()}>
              Back
            </button>
            <button className={styles.button} onClick={() => handleNext && handleNext('uploadDocuments')}>
              Upload Documents
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.subContainer}>
          <h2>Profile Claim Process Not Started</h2>
          {/* allow the user to start the process */}
          <p>A claim process has not been started for this profile. If you would like to claim this profile please start the process by clicking the button below.</p>
          <button
            className={styles.startClaimButton}
            onClick={() => {
              // handle the claim process start
              // this could be a redirect to another page or an API call
              // for now, we will just log the slug and type
              createClaimProcess({
                url: `/auth/claim/profile?slug=${slug}&type=${type}`,
                formData: {},
              });
            }}
          >
            Start Claim Process
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
