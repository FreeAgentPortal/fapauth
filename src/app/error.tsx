'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './error.module.scss';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTryAgain = () => {
    reset();
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Error Code */}
        <div className={styles.errorCode}>
          <span className={styles.icon}>⚠️</span>
          <span className={styles.text}>ERROR</span>
        </div>

        {/* Main Message */}
        <h1 className={styles.title}>Something went wrong!</h1>
        <p className={styles.subtitle}>
          The play broke down! We&apos;ve encountered an unexpected error while processing your request.
        </p>

        {/* Helpful Message */}
        <div className={styles.helpText}>
          <p>This could be due to:</p>
          <ul>
            <li>A temporary server issue</li>
            <li>Network connectivity problems</li>
            <li>An unexpected application error</li>
          </ul>
        </div>

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.errorDetails}>
            <details className={styles.detailsContainer}>
              <summary className={styles.detailsSummary}>
                View Error Details (Development Mode)
              </summary>
              <div className={styles.errorContent}>
                <pre className={styles.errorMessage}>{error.message}</pre>
                {error.stack && (
                  <pre className={styles.errorStack}>{error.stack}</pre>
                )}
                {error.digest && (
                  <p className={styles.errorDigest}>Error ID: {error.digest}</p>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button 
            onClick={handleTryAgain}
            className={styles.primaryButton}
          >
            🔄 Try Again
          </button>
          
          <button 
            onClick={handleGoBack}
            className={styles.secondaryButton}
          >
            ← Go Back
          </button>
          
          <button 
            onClick={handleGoHome}
            className={styles.secondaryButton}
          >
            🏠 Go to Home
          </button>
        </div>

        {/* Additional Help */}
        <div className={styles.footer}>
          <p>
            If this problem persists, please{' '}
            <a href="mailto:support@thefreeagentportal.com" className={styles.link}>
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decoration}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
}
