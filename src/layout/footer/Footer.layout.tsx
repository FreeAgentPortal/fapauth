'use client';
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        <Link href="https://thefreeagentportal.com/legal/terms" target="_blank" rel="noopener noreferrer">
          Terms &amp; Conditions
        </Link>
        <Link href="https://thefreeagentportal.com/legal/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </Link>
      </nav>
      <span className={styles.trademark}>The Free Agent Portal® {year}</span>
      <span className={styles.links}>A joint venture service of Draft Diamonds LLC and Sterling Haven LLC, All Rights Reserved</span>
    </footer>
  );
};

export default Footer;
