'use client';
import React, { useState } from 'react';
import styles from './Registration.module.scss';
import { useRouter } from 'next/navigation';

const rolesList = ['athlete'];
const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const toggleRole = (role: string) => {
    setSelectedRole((prev) => (prev === role ? null : role));
  };

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/register/flow?role=${selectedRole}`);
    }
  };

  const handleSkip = () => {
    router.push('/auth/register/flow');
  };

  return (
    <div className="">
      <div className={styles.rolePrompt}>
        <p>First, who are you? Please select a role:</p>
      </div>

      <div className={styles.rolesGrid}>
        {rolesList.map((role) => (
          <button
            key={role}
            className={`${styles.roleBtn} ${
              selectedRole === role ? styles.active : ''
            }`}
            onClick={() => toggleRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <button
        className={styles.continueBtn}
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue →
      </button>
      <button className={styles.skipBtn} onClick={handleSkip}>
        Continue Without a Profile
      </button>
    </div>
  );
};

export default RoleSelector;
