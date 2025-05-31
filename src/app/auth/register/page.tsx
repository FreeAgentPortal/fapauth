import AuthModal from '@/layout/authModal/AuthModal.layout';
import RoleSelector from '@/views/registration/RoleSelector.component';


export default function RegisterPage() {
  return (
    <AuthModal
      title="Welcome to Free Agent Portal"
      subtitle="You're one step closer to making your dream connections"
    >
      <RoleSelector />
    </AuthModal>
  );
}
