'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import styles from '@/styles/Form.module.scss';

interface AthleteFormProps {
  onNext: (stepName: string, data: AthleteFormData) => void;
  onBack?: () => void;
  defaultValues?: AthleteFormData;
  userDefaults?: { firstName: string; lastName?: string; email: string };
}

type AthleteFormData = {
  contactNumber: string;
  birthdate: string;
  college?: string;
};

const Athlete = ({
  onNext,
  onBack,
  defaultValues,
  userDefaults,
}: AthleteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AthleteFormData>({
    defaultValues: defaultValues || {
      contactNumber: '234-234-4234',
      birthdate: new Date('12/12/2000').toISOString().split('T')[0],
      college: 'University of Georgia',
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: AthleteFormData) => {
    onNext('athlete', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.heading}>Athlete Profile</h2>
      <p>Here you will build information about yourself
        to help teams and scouts find you.
      </p>

      {userDefaults && (
        <>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              value={`${userDefaults.firstName} ${userDefaults.lastName}`}
              disabled
              readOnly
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={userDefaults.email} />
          </div>
        </>
      )}

      <div className={styles.field}>
        <label>Contact Number</label>
        <input
          type="tel"
          {...register('contactNumber', {
            required: 'Contact number is required',
            validate: {
              validFormat: (value) => {
                const phoneRegex = /^(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4})$/;
                return phoneRegex.test(value) || 'Invalid phone number format';
              },
            }
          })}
        />
        {errors.contactNumber && (
          <span className={styles.error}>{errors.contactNumber.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label>Date of Birth</label>
        <input
          type="date"
          {...register('birthdate', { required: 'Birthdate is required' })}
        />
        {errors.birthdate && (
          <span className={styles.error}>{errors.birthdate.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <label>College (optional)</label>
        <input
          type="text"
          placeholder="e.g. University of Georgia"
          {...register('college')}
        />
      </div>

      <button type="submit" className={styles.submit}>
        Next →
      </button>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack}>
          ← Back
        </button>
      )}
    </form>
  );
};
export default Athlete;
