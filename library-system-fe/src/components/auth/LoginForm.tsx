import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleMode: () => void;
}

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const errorTitle = error.title || error.message || 'An error occurred';
      const errorDetails = error.details;
      
      if (errorDetails && errorDetails !== errorTitle) {
        toast.error(errorTitle, {
          description: errorDetails,
          duration: 5000,
        });
      } else {
        toast.error(errorTitle, {
          duration: 5000,
        });
      }
    }
  }, [error]);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      toast.success('Logged in successfully!');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black">
      <div className="bg-black text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-300 text-sm mt-2">
              Sign in to manage your libraries
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-black font-medium">
            <Mail className="w-4 h-4 text-gray-600" />
            Email Address
          </Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter your email"
            {...register('email')}
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2 text-black font-medium">
            <Lock className="w-4 h-4 text-gray-600" />
            Password
          </Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Enter your password"
            {...register('password')}
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:shadow-lg font-semibold h-11 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Signing In...
            </span>
          ) : (
            <span>Sign In</span>
          )}
        </Button>

        <div className="text-center">
          <button 
            type="button" 
            onClick={onToggleMode} 
            className="text-sm text-black hover:text-gray-700 transition-colors duration-300 underline-offset-4 hover:underline font-medium cursor-pointer"
          >
            Don't have an account? Register
          </button>
        </div>
      </form>
    </div>
  );
}
