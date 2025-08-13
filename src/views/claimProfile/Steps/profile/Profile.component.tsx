'use client';
import React from 'react';
import styles from './Profile.module.scss';
import { useSearchParams, useRouter } from 'next/navigation';
import useApiHook from '@/hooks/useApi';
import Loader from '@/components/loader/Loader.component';
import Image from 'next/image';
import { url } from 'inspector';
import { useUserStore } from '@/state/user';
import Modal from '@/components/modal/Modal.component';

interface ProfileProps {
  handleNext: (data: any) => void;
  handleBack: () => void;
}

const Profile = ({ handleNext, handleBack }: ProfileProps) => {
  const { user } = useUserStore((state) => state);
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [shouldValidateToken, setShouldValidateToken] = React.useState(false);
  const hasValidated = React.useRef(false);
  // get the slug and type param from the url
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');
  const token = searchParams.get('token');

  const { data, isLoading } = useApiHook({
    url: `/auth/claim/profile?slug=${slug}&type=${type}`,
    method: 'GET',
    key: ['profile', slug as string],
    enabled: !!slug && !!type,
  }) as any;

  const { mutate: validateToken, isPending: isValidatingToken } = useApiHook({
    method: 'POST',
    key: ['validateToken', token as string],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
    successMessage: 'Token validated successfully!',
  }) as any;

  const { mutate: createClaimProcess } = useApiHook({
    method: 'POST',
    key: ['profile', slug as string],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.token}`,
    },
    queriesToInvalidate: ['profile', slug as string],
  }) as any;

  React.useEffect(() => {
    // if we have claim data we want to check if the claim process has been submitted/approved/denied
    // if the claim process has been submitted we can move to the next step immediately
    if (data?.success) {
      const status = data?.payload?.status ?? 'not-started';
      // only if the status is not 'not-started' we can move to the next step
      if (status !== 'not-started') {
        handleNext({ stepName: 'claimSubmitted', data });
      }
    }
  }, [data, handleNext]);

  // Function to handle token validation (similar to LoginForm onSubmit pattern)
  const handleTokenValidation = React.useCallback(() => {
    if (!token || !user) return;

    console.log('Starting token validation...'); // Debug log

    validateToken(
      {
        url: `/profiles/team/validate-token`,
        formData: {
          token,
        },
      },
      {
        onSuccess: (response: any) => {
          console.log('Token validated successfully:', response);
          setShowSuccessModal(true);
        },
        onError: (error: any) => {
          console.error('Error validating token:', error);
          // Handle error appropriately - maybe show an error message
        },
      }
    );
  }, [token, user]); // Removed validateToken from dependencies

  // Effect to trigger token validation when conditions are met
  React.useEffect(() => {
    if (token && user && !shouldValidateToken && !isValidatingToken && !hasValidated.current) {
      setShouldValidateToken(true);
      hasValidated.current = true;
      // Use setTimeout to ensure this runs after the component has fully mounted
      setTimeout(() => {
        handleTokenValidation();
      }, 1000);
    }
  }, [token, user, shouldValidateToken, isValidatingToken, handleTokenValidation]);

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Navigate to login page after closing modal
    router.push('/auth/login');
  };

  if (isLoading || isValidatingToken) return <Loader />;
  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        {/* placeholder to hold name, and profile picture of the profile */}
        <h1>{data?.profile?.name}</h1>
        <Image
          src={data?.profile?.logos[0]?.href || data?.profile?.logoUrl || null}
          alt={`${data?.profile?.name}'s profile picture`}
          className={styles.profilePicture}
          width={200}
          height={200}
        />
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
              createClaimProcess(
                {
                  url: `/auth/claim`,
                  formData: {
                    claimType: type,
                    profile: slug,
                  },
                },
                {
                  onSuccess: (response: any) => {
                    console.log('Claim process started successfully:', response);
                    handleNext({ stepName: 'uploadDocuments', data: response });
                  },
                  onError: (error: any) => {
                    console.error('Error starting claim process:', error);
                  },
                }
              );
            }}
          >
            Start Claim Process
          </button>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onClose={handleModalClose}
        closable={true}
        maskClosable={false}
        footer={
          <button
            onClick={handleModalClose}
            style={{
              padding: '0.75rem 2rem',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Continue to Login
          </button>
        }
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              fontSize: '3rem',
              color: '#4CAF50',
              marginBottom: '1rem',
            }}
          >
            ✅
          </div>
          <h3
            style={{
              color: '#fff',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
            }}
          >
            Profile Claim Complete!
          </h3>
          <p
            style={{
              color: '#ccc',
              lineHeight: '1.6',
              fontSize: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            Your profile claim has been successfully processed and validated. You have been automatically attached to the team and can now access your account.
          </p>
          <p
            style={{
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '500',
            }}
          >
            Click the button below to continue to the login screen.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
