import { useState } from 'react';
import { Toaster } from 'sonner';
import { LoginForm, RegisterForm } from '../components/auth';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {isRegister ? (
        <RegisterForm onToggleMode={() => setIsRegister(false)} />
      ) : (
        <LoginForm onToggleMode={() => setIsRegister(true)} />
      )}
      <Toaster />
    </div>
  );
}
