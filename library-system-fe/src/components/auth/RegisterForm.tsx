import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, User, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(1, 'Username is required').min(3, 'Username must be at least 3 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  dateOfBirth: z.string().min(1, 'Date of birth is required').refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 13;
  }, 'You must be at least 13 years old'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onToggleMode: () => void;
}

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, isAuthenticated, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registrationData } = data;
    const success = await registerUser(registrationData);
    if (success) {
      toast.success('Account created and logged in successfully!');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-black">
      <div className="bg-black text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-gray-300 text-sm mt-2">
              Join our community of book lovers
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-black font-medium">
              <User className="w-4 h-4 text-gray-600" />
              First Name
            </Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Enter your first name"
              {...register('name')}
              className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="surname" className="flex items-center gap-2 text-black font-medium">
              <User className="w-4 h-4 text-gray-600" />
              Last Name
            </Label>
            <Input 
              id="surname" 
              type="text" 
              placeholder="Enter your last name"
              {...register('surname')}
              className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
            />
            {errors.surname && (
              <p className="text-red-600 text-sm mt-1">{errors.surname.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2 text-black font-medium">
            <User className="w-4 h-4 text-gray-600" />
            Username
          </Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="Choose a username"
            {...register('username')}
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-black font-medium">
            <Calendar className="w-4 h-4 text-gray-600" />
            Date of Birth
          </Label>
          <Input 
            id="dateOfBirth" 
            type="date"
            {...register('dateOfBirth')}
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
          />
          {errors.dateOfBirth && (
            <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-black font-medium">
            <Lock className="w-4 h-4 text-gray-600" />
            Confirm Password
          </Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            className="bg-white border-2 border-gray-300 text-black placeholder:text-gray-400 focus-visible:border-gray-500 focus-visible:ring-gray-500/50" 
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
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
              Creating Account...
            </span>
          ) : (
            <span>Create Account</span>
          )}
        </Button>

        <div className="text-center">
          <button 
            type="button" 
            onClick={onToggleMode} 
            className="text-sm text-black hover:text-gray-700 transition-colors duration-300 underline-offset-4 hover:underline font-medium cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
