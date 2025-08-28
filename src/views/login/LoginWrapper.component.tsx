'use client';
import { useUserStore } from '@/state/user';
import LoginForm from '@/components/loginForm/LoginForm.form';

export default function LoginWrapper() {
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  const handleLoginSuccess = (token: string, user: any) => {
    setToken(token);
    setUser(user);
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
