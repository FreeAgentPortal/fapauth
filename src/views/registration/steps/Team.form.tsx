'use client';

import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import styles from './Steps.module.scss';
import formStyles from '@/styles/Form.module.scss';
import useApiHook from '@/hooks/useApi';
import { get } from 'http';
import { exists } from 'fs';

interface TeamFormProps {
  onNext: (stepName: string, data: TeamFormData) => void;
  onBack?: () => void;
  defaultValues?: TeamFormData;
  userDefaults?: { email: string };
}

type TeamFormData = {
  organizationName: string;
  teamEmail?: string;
  phoneNumber: string;
  website?: string;
};
const Team = ({ onNext, onBack, defaultValues, userDefaults }: TeamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm<TeamFormData>({
    defaultValues: defaultValues || {
      organizationName: 'Jacksonville Jaguars',
      teamEmail: userDefaults?.email || 'coach@jj.edu',
      phoneNumber: '144-345-2345',
      website: 'jaguars.com',
    },
  });

  const [orgName, setOrgName] = React.useState('');
  const organizationName = watch('organizationName');

  // Debounce input (optional but recommended)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOrgName(organizationName);
    }, 400);
    return () => clearTimeout(timeout);
  }, [organizationName]);

  // const { data: teamExists, isLoading } = useApiHook({
  //   url: `/team/check`,
  //   method: 'GET',
  //   key: ['teamExists', orgName],
  //   params: {
  //     resource: {
  //       organizationName: orgName,
  //       teamEmail: getValues('teamEmail'),
  //     },
  //   },
  //   enabled: !!orgName,
  // }) as any;

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: TeamFormData) => {
    onNext('team', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formStyles.form}>
      <h2 className={styles.heading}>Team Profile</h2>

      <div className={formStyles.field}>
        <label>Organization Name</label>
        <input
          type="text"
          {...register('organizationName', {
            required: 'Organization name is required',
            validate: {
              notEmpty: (value) => value.trim() !== '' || 'Organization name cannot be empty',
              minLength: (value) => value.length >= 3 || 'Organization name must be at least 3 characters',
              // exists: (value) => !teamExists || 'This organization already exists',
            },
          })}
        />
        {errors.organizationName && <span className={formStyles.error}>{errors.organizationName.message}</span>}
        {/* {teamExists && <span className={styles.warning}>⚠ This organization already exists. You can continue, but access will require approval from the organization owner.</span>} */}
      </div>

      <div className={formStyles.field}>
        <label>Team Email</label>
        <input type="email" {...register('teamEmail')} placeholder={userDefaults?.email} />
      </div>

      <div className={formStyles.field}>
        <label>Phone Number</label>
        <input type="tel" {...register('phoneNumber', { required: 'Phone number is required' })} />
        {errors.phoneNumber && <span className={formStyles.error}>{errors.phoneNumber.message}</span>}
      </div>

      <div className={formStyles.field}>
        <label>Website (optional)</label>
        <input type="url" placeholder="https://yourteam.org" {...register('website')} />
      </div>

      <button type="submit" className={formStyles.submit}>
        Next →
      </button>
      {onBack && (
        <button type="button" className={formStyles.back} onClick={onBack}>
          ← Back
        </button>
      )}
    </form>
  );
};
export default Team;
