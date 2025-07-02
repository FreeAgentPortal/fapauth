'use client';
import { useUserStore } from '@/state/user';
import LoginForm from '@/components/loginForm/LoginForm.form';

export default function LoginWrapper() {
  const setToken = useUserStore((state) => state.setToken);

  const handleLoginSuccess = (token: string) => {
    setToken(token);
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
