'use client';
import styles from './Registration.module.scss';
import { useRouter } from 'next/navigation';

const rolesList = ['athlete'];
const RoleSelector = () => {
  const router = useRouter();

  const handleRole = (role: string) => {
    router.push(`/auth/register/flow?role=${role}`);
  };

  const handleSkip = () => {
    router.push('/auth/register/flow');
  };

  const getArticle = (word: string) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes(word[0].toLowerCase()) ? 'an' : 'a';
  };

  return (
    <div className="">
      <div className={styles.rolePrompt}>
        <p>What is your role?</p>
      </div>

      <div className={styles.rolesGrid}>
        {rolesList.map((role) => (
          <button
            className={styles.skipBtn}
            onClick={() => {
              handleRole(role);
            }}
            key={role}
          >
            Signup as {getArticle(role)} {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <button className={styles.skipBtn} onClick={handleSkip}>
        Signup as a Guest
      </button>
    </div>
  );
};

export default RoleSelector;
