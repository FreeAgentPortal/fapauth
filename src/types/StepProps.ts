export interface StepProps {
  name: string;
  component: React.ReactNode;
  onNext: (stepName: string, data: any) => void;
  onBack?: () => void;
  defaultValues?: any;
}
