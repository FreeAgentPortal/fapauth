import AuthModal from '@/layout/authModal/AuthModal.layout';
import RoleSelector from '@/views/registration/RoleSelector.component';

export default function RegisterPage() {
  return (
    <AuthModal
      title="Welcome to The Free Agent Portal"
      subtitle="You're one step closer to making your dream connections"
      footer={
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#ccc',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          FAP is a paid service to connect athletes and teams.{' '}
          <a
            href="https://thefreeagentportal.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#66b3ff',
              textDecoration: 'underline',
              fontWeight: '500',
            }}
          >
            Make sure our pricing fits your plans!
          </a>
        </p>
      }
    >
      <RoleSelector />
    </AuthModal>
  );
}
