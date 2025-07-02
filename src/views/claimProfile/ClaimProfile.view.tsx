'use client';
import React, { useState } from 'react';
import { StepProps } from '@/types/StepProps';
import { AnimatePresence, motion } from 'framer-motion';
import Authenticate from './Steps/authenticate/Authenticate.step';
import Profile from './Steps/profile/Profile.component';
import UploadDocuments from './Steps/uploadDocuments/UploadDocuments.component';
import ClaimSubmitted from './Steps/claimSubmitted/ClaimSubmitted.component';

const ClaimProfile = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(3);
  const steps = [
    {
      name: 'Authenticate',
      component: (
        <Authenticate
          handleNext={(data: any) => {
            handleNext('Authenticate', data);
          }}
        />
      ),
    },
    {
      name: 'ClaimProfile',
      component: <Profile handleNext={(data: any) => handleNext('ClaimProfile', data)} handleBack={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))} />,
    },
    {
      name: 'UploadDocuments',
      component: <UploadDocuments handleNext={() => handleNext('UploadDocuments', {})} handleBack={handleBack} />,
    },
    {
      name: 'ClaimSubmitted',
      component: <ClaimSubmitted />,
    },
  ] as StepProps[];
  const stepKey = steps[currentStepIndex].name;
  function handleNext(stepName: string, data: any) {
    setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function handleBack() {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={stepKey} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        {steps[currentStepIndex].component}
      </motion.div>
    </AnimatePresence>
  );
};

export default ClaimProfile;
