'use client';

import { useState } from 'react';
import User from './steps/User.form';
import Team from './steps/Team.form';
import Agent from './steps/Agent.form';
import { AnimatePresence, motion } from 'framer-motion';
import Athlete from './steps/Athlete.form';
import FinalStep from './steps/FinalStep.step';
import Verification from './steps/Verification.step';

interface RegistrationControllerProps {
  roles: string[];
}
interface StepProps {
  name: string;
  component: React.ReactNode;
  onNext: (stepName: string, data: any) => void;
  onBack?: () => void;
  defaultValues?: any;
}

export default function RegistrationController({ roles }: RegistrationControllerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const steps = [
    {
      name: 'user',
      component: <User onNext={handleNext} defaultValues={formData.user} />,
    },
    ...(roles.includes('athlete')
      ? [{ name: 'athlete', component: <Athlete onNext={handleNext} onBack={handleBack} defaultValues={formData.athlete} userDefaults={formData.user} /> }]
      : []),
    ...(roles.includes('team') ? [{ name: 'team', component: <Team onNext={handleNext} onBack={handleBack} defaultValues={formData.team} /> }] : []),
    {
      name: 'submit',
      component: (
        <FinalStep
          formData={formData}
          advStep={() => {
            setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
          }}
        />
      ),
    },
    { name: 'verification', component: <Verification email={formData.user?.email} /> },
    // ...(roles.includes('agent') ? [{ name: 'agent', component: <Agent onNext={handleNext} onBack={handleBack} defaultValues={formData.agent} /> }] : []),
    // { name: 'final', component: <FinalStep formData={formData} /> },
  ] as StepProps[];
  const stepKey = steps[currentStepIndex].name;
  function handleNext(stepName: string, data: any) {
    setFormData((prev: any) => ({ ...prev, [stepName]: data }));
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
}
