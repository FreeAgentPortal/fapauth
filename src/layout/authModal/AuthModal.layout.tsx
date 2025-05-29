// components/AuthModal.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './AuthModal.module.scss';

interface AuthModalProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthModal: React.FC<AuthModalProps> = ({
  title,
  subtitle,
  showBackButton = false,
  children,
  footer,
}) => {
  return (
    <motion.div
      className={styles.authModalInner}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {showBackButton && (
        <Link href="/auth/login" className={styles.backButton}>
          ← Back to Login
        </Link>
      )}

      <h1 className={styles.authTitle}>{title}</h1>
      {subtitle && <p className={styles.authSubtitle}>{subtitle}</p>}

      <div className={styles.authContent}>
        {children}
      </div>

      {footer && <div className={styles.authFooter}>{footer}</div>}
    </motion.div>
  );
};

export default AuthModal;
