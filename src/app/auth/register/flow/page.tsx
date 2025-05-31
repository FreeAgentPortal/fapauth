// app/auth/register/flow/page.tsx

import AuthModal from '@/layout/authModal/AuthModal.layout';
import RegistrationController from '@/views/registration/RegistrationController.view';

export default async function RegistrationFlowPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  // we have to await for the searchParams to be available
  // and then parse the role parameter to get the roles
  const roleParam = await searchParams ;
  const roles = roleParam.role?.split(',') ?? [];

  return (
    <AuthModal
      title="Welcome to Free Agent Portal"
      subtitle="You're one step closer to making your dream connections"
      footer={
        <p>
          Already have an account?{' '}
          <a href="/auth/login">Login →</a>
        </p>
      }
    >
      <RegistrationController roles={roles} />
    </AuthModal>
  );
}
