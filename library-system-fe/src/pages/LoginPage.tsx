import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, User, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'An error occurred';
      
      toast.error(errorMessage, {
        duration: 5000, // Show for 5 seconds
        style: {
          whiteSpace: 'pre-line', // Preserve line breaks
        },
      });
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { email, isRegister });
    
    // Basic validation
    if (isRegister) {
      if (!email || !password || !name || !surname || !username || !dateOfBirth) {
        toast.error('Please fill in all fields');
        return;
      }
    } else {
      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }
    }

    if (isRegister) {
      const success = await register({
        email,
        password,
        name,
        surname,
        username,
        dateOfBirth,
      });
      
      console.log('Register success:', success);
      
      if (success) {
        toast.success('Account created and logged in successfully!');
        navigate('/', { replace: true });
      }
      // Error is handled by useEffect watching the error state
    } else {
      const success = await login({ email, password });
      
      console.log('Login success:', success);
      
      if (success) {
        toast.success('Logged in successfully!');
        navigate('/', { replace: true });
      }
      // Error is handled by useEffect watching the error state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-primary-foreground/80 text-sm mt-2">
                {isRegister ? 'Join our community of book lovers' : 'Sign in to manage your libraries'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    First Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Last Name
                  </Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Doe"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="transition-all duration-300 focus:scale-[1.02]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.02]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="transition-all duration-300 focus:scale-[1.02]"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                {isRegister ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 underline-offset-4 hover:underline"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
