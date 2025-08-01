'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import styles from '@/styles/Form.module.scss';
import Modal from '@/components/modal/Modal.component';
import useApiHook from '@/hooks/useApi';
import parser from 'html-react-parser';

interface AthleteFormProps {
  onNext: (stepName: string, data: AthleteFormData) => void;
  onBack?: () => void;
  defaultValues?: AthleteFormData;
  userDefaults?: { firstName: string; lastName?: string; email: string };
}

type AthleteFormData = {
  fullName: string;
  email?: string;
  contactNumber: string;
  birthdate: string;
  college?: string;
  agreeToTerms: boolean;
};

const Athlete = ({
  onNext,
  onBack,
  defaultValues,
  userDefaults,
}: AthleteFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementContent, setAgreementContent] = useState<string>('');
  const [loadingAgreement, setLoadingAgreement] = useState(false);

  const { data: agreementData  } = useApiHook({
    method: 'GET',
    url: '/auth/legal/athlete-agreement',
    key: 'athlete-agreement',
    enabled: false, // We'll manually trigger this
  }) as any;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AthleteFormData>({
    defaultValues: defaultValues || {
      fullName: `${userDefaults?.firstName || ''} ${userDefaults?.lastName || ''}`.trim(), 
      email: userDefaults?.email || '',
      contactNumber: '234-234-4234',
      birthdate: new Date('12/12/2000').toISOString().split('T')[0],
      college: 'University of Georgia',
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch('agreeToTerms');

  const handleAgreementClick = async () => {
    setLoadingAgreement(true);
    try {
      const result = await agreementData;
      if (result?.payload || result?.data) {
        setAgreementContent(result.payload.content || result.data);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching agreement:', error);
      // Fallback content if API fails
      setAgreementContent('Unable to load agreement content. Please contact support.');
      setIsModalOpen(true);
    } finally {
      setLoadingAgreement(false);
    }
  };

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = (data: AthleteFormData) => {
    onNext('athlete', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h2 className={styles.heading}>Athlete Profile</h2>
      <p>
        Here you will build information about yourself to help teams and scouts
        find you.
      </p>

      <div className={styles.field}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          {...register('fullName', {
            required: 'Full name is required',
          })}
          value={`${userDefaults?.firstName} ${userDefaults?.lastName}`.trim()}
          disabled
          readOnly
        />
      </div>

      <div className={styles.field}>
        <label>Email</label>
        <input type="email" value={userDefaults?.email ?? ""} />
      </div>
      <div className={styles.field}>
        <label>Contact Number</label>
        <input
          type="tel"
          {...register('contactNumber', {
            required: 'Contact number is required',
            validate: {
              validFormat: (value) => {
                const phoneRegex =
                  /^(?:\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4})$/;
                return phoneRegex.test(value) || 'Invalid phone number format';
              },
            },
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

      <div className={styles.field}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="agreeToTerms"
            {...register('agreeToTerms', { 
              required: 'You must agree to the Athlete Agreement to continue' 
            })}
            style={{
              marginTop: '0.25rem',
              width: '18px',
              height: '18px',
              accentColor: '#ffffff'
            }}
          />
          <label 
            htmlFor="agreeToTerms" 
            style={{ 
              fontSize: '0.9rem', 
              lineHeight: '1.4',
              cursor: 'pointer',
              flex: 1
            }}
          >
            I agree to the{' '}
            <button
              type="button"
              onClick={handleAgreementClick}
              disabled={loadingAgreement}
              style={{
                color: '#66b3ff',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: loadingAgreement ? 'wait' : 'pointer',
                fontSize: 'inherit'
              }}
            >
              {loadingAgreement ? 'Loading...' : 'Athlete Agreement'}
            </button>
          </label>
        </div>
        {errors.agreeToTerms && (
          <span className={styles.error}>{errors.agreeToTerms.message}</span>
        )}
      </div>

      <div className={styles.btnContainer}>
        {onBack && (
          <button type="button" className={styles.back} onClick={onBack}>
            ← Back
          </button>
        )}
        <button 
          type="submit" 
          className={styles.submit}
          disabled={!agreeToTerms}
          style={{
            opacity: !agreeToTerms ? 0.6 : 1,
            cursor: !agreeToTerms ? 'not-allowed' : 'pointer'
          }}
        >
          Next →
        </button>
      </div>

      {/* Agreement Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        closable={true}
        maskClosable={true}
        footer={
          <button
            onClick={() => setIsModalOpen(false)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Close
          </button>
        }
      >
        <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <h3 style={{ 
            color: '#fff', 
            fontSize: '1.25rem', 
            marginBottom: '1rem',
            borderBottom: '2px solid #eee',
            paddingBottom: '0.5rem'
          }}>
            Athlete Agreement
          </h3>
          <div style={{ 
            color: '#fff', 
            lineHeight: '1.6',
            fontSize: '0.95rem'
          }}>
            {agreementContent ? (
              <div dangerouslySetInnerHTML={{ __html:  parser(agreementContent) }} />
            ) : (
              <p>Loading agreement content...</p>
            )}
          </div>
        </div>
      </Modal>
    </form>
  );
};
export default Athlete;
