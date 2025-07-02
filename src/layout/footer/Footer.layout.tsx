'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <Link href="https://example.com/terms" target="_blank" rel="noopener noreferrer">
          Terms &amp; Conditions
        </Link>
        <Link href="https://example.com/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </Link>
      </nav>
      <span className={styles.trademark}>Free Agent Portal® {year}</span>
    </footer>
  );
};

export default Footer;
