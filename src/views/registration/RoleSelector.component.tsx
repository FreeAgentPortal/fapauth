'use client';
import React, { useState } from 'react';
import styles from './Registration.module.scss';
import { useRouter } from 'next/navigation';

const rolesList = ['athlete', 'team'];
const RoleSelector = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const router = useRouter();

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleContinue = () => {
    const query = selectedRoles.join(',');
    router.push(`/auth/register/flow?role=${query}`);
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
              selectedRoles.includes(role) ? styles.active : ''
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
        disabled={selectedRoles.length === 0}
      >
        Continue →
      </button>
    </div>
  );
};

export default RoleSelector;
