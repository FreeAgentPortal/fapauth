import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import formStyles from '@/styles/Form.module.scss';
import styles from './Steps.module.scss';
import useApiHook from '@/state/useApi';

interface UserFormProps {
  onNext: (stepName: string, data: UserFormData) => void;
  defaultValues?: UserFormData;
}

type UserFormData = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const User = ({ onNext, defaultValues }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: defaultValues || {
      firstName: "test",
      lastName: 'lastName',
      email: 'test@test.edu',
      password: 'Password123',
      confirmPassword: 'Password123',
    },
  });
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: UserFormData) => {
    onNext('user', { ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${formStyles.form} ${styles.container}`}>
      <h2 className={formStyles.heading}>Create your account</h2>
      <p className={formStyles.subheading}>
        Please fill out the form below to create your account. This information
        is for your ability to login and manage your profile.
      </p>
      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label>First Name</label>
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && (
            <span className={formStyles.error}>{errors.firstName.message}</span>
          )}
        </div>

        <div className={formStyles.field}>
          <label>Last Name</label>
          <input type="text" {...register('lastName')} />
        </div>
      </div>
      <div className={formStyles.field}>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required', validate:{
            email: (value) =>
              // basic email validation, also can only be of type .edu, .org, etc.
              /^\S+@\S+\.\S+$/.test(value) || 'Invalid email format',
            notTaken: async (value) => {
              // Simulate API check
              const isTaken = false; // Replace with actual API call
              return !isTaken || 'Email is already taken';
            },
          } })}
        />
        {errors.email && (
          <span className={formStyles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={formStyles.field}>
        <label>Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 10, message: 'Minimum 10 characters' },
          })}
        />
        {errors.password && (
          <span className={formStyles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={formStyles.field}>
        <label>Confirm Password</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm password',
            validate: (val) =>
              val === watch('password') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <span className={formStyles.error}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <button type="submit" className={formStyles.submit}>
        Next →
      </button>
    </form>
  );
};
export default User;
