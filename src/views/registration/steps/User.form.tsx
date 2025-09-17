import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import formStyles from '@/styles/Form.module.scss';
import styles from './Steps.module.scss';
import useApiHook from '@/hooks/useApi';
import Modal from '@/components/modal/Modal.component';
import parser from 'html-react-parser';

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
  phoneNumber: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
};

const User = ({ onNext, defaultValues }: UserFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);
  const [termsContent, setTermsContent] = useState<string>('');
  const [privacyContent, setPrivacyContent] = useState<string>('');
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [loadingPrivacy, setLoadingPrivacy] = useState(false);

  const { data: termsData } = useApiHook({
    method: 'GET',
    url: '/auth/legal/terms',
    key: 'terms-and-conditions',
  }) as any;

  const { data: privacyData } = useApiHook({
    method: 'GET',
    url: '/auth/legal/privacy',
    key: 'privacy-policy',
  }) as any;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: defaultValues || {
      // firstName: 'test',
      // lastName: 'lastName',
      // email: 'test@test.edu',
      // password: 'Password123',
      // confirmPassword: 'Password123',
      // phoneNumber: '234-234-4234',
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  const agreeToTerms = watch('agreeToTerms');
  const agreeToPrivacy = watch('agreeToPrivacy');

  const handleTermsClick = async () => {
    setLoadingTerms(true);
    setModalType('terms');
    try {
      const result = await termsData;
      if (result?.payload || result?.data) {
        setTermsContent(result.payload.content || result.data);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching terms:', error);
      setTermsContent('Unable to load terms and conditions. Please contact support.');
      setIsModalOpen(true);
    } finally {
      setLoadingTerms(false);
    }
  };

  const handlePrivacyClick = async () => {
    setLoadingPrivacy(true);
    setModalType('privacy');
    try {
      const result = await privacyData;
      if (result?.payload || result?.data) {
        setPrivacyContent(result.payload.content || result.data);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setPrivacyContent('Unable to load privacy policy. Please contact support.');
      setIsModalOpen(true);
    } finally {
      setLoadingPrivacy(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const getModalContent = () => {
    if (modalType === 'terms') {
      return {
        title: 'Terms and Conditions',
        content: termsContent || 'Loading terms and conditions...',
        loading: loadingTerms,
      };
    } else if (modalType === 'privacy') {
      return {
        title: 'Privacy Policy',
        content: privacyContent || 'Loading privacy policy...',
        loading: loadingPrivacy,
      };
    }
    return { title: '', content: '', loading: false };
  };
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: UserFormData) => {
    onNext('user', { ...data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`${formStyles.form} ${styles.container}`}>
      <h2 className={formStyles.heading}>Create your account</h2>
      <p className={formStyles.subheading}>Please fill out the form below to create your account. This information is for your ability to login and manage your profile.</p>
      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label>First Name</label>
          <input type="text" {...register('firstName', { required: 'First name is required' })} />
          {errors.firstName && <span className={formStyles.error}>{errors.firstName.message}</span>}
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
          {...register('email', {
            required: 'Email is required',
            validate: {
              email: (value) =>
                // basic email validation, also can only be of type .edu, .org, etc.
                /^\S+@\S+\.\S+$/.test(value) || 'Invalid email format',
              notTaken: async (value) => {
                // Simulate API check
                const isTaken = false; // Replace with actual API call
                return !isTaken || 'Email is already taken';
              },
            },
          })}
        />
        {errors.email && <span className={formStyles.error}>{errors.email.message}</span>}
      </div>
      <div className={formStyles.field}>
        {/* phoneNumber */}
        <label>Phone Number</label>
        <input
          type="tel"
          {...register('phoneNumber', {
            required: 'Phone number is required',
            validate: {
              validFormat: (value) => {
                const phoneRegex = /^(\+?[1-9]\d{0,3}[\s\-\.\(\)]?)?[\(\s\-\.]?[\d\s\-\.\(\)]{7,20}$/;
                return phoneRegex.test(value) || 'Invalid phone number format';
              },
            },
          })}
        />
        {errors.phoneNumber && <span className={formStyles.error}>{errors.phoneNumber.message}</span>}
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label>Password</label>
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 10, message: 'Minimum 10 characters' },
            })}
          />
          {errors.password && <span className={formStyles.error}>{errors.password.message}</span>}
        </div>

        <div className={formStyles.field}>
          <label>Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm password',
              validate: (val) => val === watch('password') || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <span className={formStyles.error}>{errors.confirmPassword.message}</span>}
        </div>
      </div>

      <div className={formStyles.field}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="agreeToTerms"
            {...register('agreeToTerms', {
              required: 'You must agree to the Terms and Conditions to continue',
            })}
            style={{
              marginTop: '0.25rem',
              width: '18px',
              height: '18px',
              accentColor: '#ffffff',
              appearance: 'auto',
              WebkitAppearance: 'checkbox',
              minWidth: '18px',
              minHeight: '18px',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '3px',
              background: 'transparent',
            }}
          />
          <label
            htmlFor="agreeToTerms"
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              cursor: 'pointer',
              flex: 1,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            I agree to the{' '}
            <button
              type="button"
              onClick={handleTermsClick}
              disabled={loadingTerms}
              style={{
                color: '#66b3ff',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: loadingTerms ? 'wait' : 'pointer',
                fontSize: 'inherit',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {loadingTerms ? 'Loading...' : 'Terms and Conditions'}
            </button>
          </label>
        </div>
        {errors.agreeToTerms && <span className={formStyles.error}>{errors.agreeToTerms.message}</span>}
      </div>

      <div className={formStyles.field}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="agreeToPrivacy"
            {...register('agreeToPrivacy', {
              required: 'You must agree to the Privacy Policy to continue',
            })}
            style={{
              marginTop: '0.25rem',
              width: '18px',
              height: '18px',
              accentColor: '#ffffff',
              appearance: 'auto',
              WebkitAppearance: 'checkbox',
              minWidth: '18px',
              minHeight: '18px',
              cursor: 'pointer',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '3px',
              background: 'transparent',
            }}
          />
          <label
            htmlFor="agreeToPrivacy"
            style={{
              fontSize: '0.9rem',
              lineHeight: '1.4',
              cursor: 'pointer',
              flex: 1,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            I agree to the{' '}
            <button
              type="button"
              onClick={handlePrivacyClick}
              disabled={loadingPrivacy}
              style={{
                color: '#66b3ff',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: loadingPrivacy ? 'wait' : 'pointer',
                fontSize: 'inherit',
                WebkitTouchCallout: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {loadingPrivacy ? 'Loading...' : 'Privacy Policy'}
            </button>
          </label>
        </div>
        {errors.agreeToPrivacy && <span className={formStyles.error}>{errors.agreeToPrivacy.message}</span>}
      </div>

      <button
        type="submit"
        className={formStyles.submit}
        disabled={!agreeToTerms || !agreeToPrivacy}
        style={{
          opacity: !agreeToTerms || !agreeToPrivacy ? 0.6 : 1,
          cursor: !agreeToTerms || !agreeToPrivacy ? 'not-allowed' : 'pointer',
        }}
      >
        Next →
      </button>

      {/* Legal Document Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closable={true}
        maskClosable={true}
        footer={
          <button
            onClick={closeModal}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Close
          </button>
        }
      >
        <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <h3
            style={{
              color: '#fff',
              fontSize: '1.25rem',
              marginBottom: '1rem',
              borderBottom: '2px solid #eee',
              paddingBottom: '0.5rem',
            }}
          >
            {getModalContent().title}
          </h3>
          <div
            style={{
              color: '#fff',
              lineHeight: '1.6',
              fontSize: '0.95rem',
            }}
          >
            {getModalContent().content ? <div dangerouslySetInnerHTML={{ __html: parser(getModalContent().content) }} /> : <p>Loading content...</p>}
          </div>
        </div>
      </Modal>
    </form>
  );
};
export default User;
