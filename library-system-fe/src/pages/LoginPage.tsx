import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LoginForm, RegisterForm } from '../components/auth';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    document.title = isRegister 
      ? 'Register - Home Library System' 
      : 'Login - Home Library System';
  }, [isRegister]);

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
