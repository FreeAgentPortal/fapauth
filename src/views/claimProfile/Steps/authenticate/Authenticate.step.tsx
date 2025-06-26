import React from 'react';
import styles from './Authenticate.module.scss';
import LoginForm from '@/components/loginForm/LoginForm.form';
import { useUserStore } from '@/state/user';

interface AuthenticateProps {
  handleNext?: (stepName: string, data: any) => void;
  handleBack?: () => void;
}

const Authenticate = ({ handleNext, handleBack }: AuthenticateProps) => {
  const { setUser, user } = useUserStore();
  const handleAuthentication = (token: string, response: any) => {
    if (handleNext) {
      handleNext('Authenticate', { token, response });
    }
    setUser({
      ...response.user,
      token: response.token,
    });
  };

  return (
    <div className={styles.container}>
      {user ? (
        <div className={styles.subContainer}>
          <h2 className={styles.title}>Authenticated Successfully</h2>
          <p>Your account is authenticated. You can now proceed to claim your profile.</p>
          <button className={styles.button} onClick={() => handleNext && handleNext('Authenticate', { user })}>
            Proceed to Claim Profile
          </button>
        </div>
      ) : (
        <div className={styles.subContainer}>
          <h2 className={styles.title}>Authenticate Your Account</h2>
          <p>To claim a profile please first authenticate your account</p>
          <LoginForm onSuccess={handleAuthentication} />
        </div>
      )}
    </div>
  );
};

export default Authenticate;
