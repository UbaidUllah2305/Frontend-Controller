// src/pages/auth/Login-Form.tsx:

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '@/types/auth';
import { EyeIcon, EyeOffIcon, Key, User } from 'lucide-react'; // Added icons
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store';
import { loginUser } from '@/store/features/auth.slice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isLoading, SetIsLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const HandleCredentialLogin = async (data: LoginFormValues) => {
    SetIsLoading(true);
    const re = await dispatch(loginUser(data));
    if (re.meta.requestStatus === 'fulfilled') {
      toast.success('Login Successful');
      SetIsLoading(false);
      navigate('/', { replace: true });
      return;
    }
    if (re.meta.requestStatus === 'rejected') {
      toast.error(re.payload as string);
      SetIsLoading(false);
      return;
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(HandleCredentialLogin)}
      className="grid gap-6"
    >
      <div className="grid gap-3">
        <Label htmlFor="email" className="text-gray-700 text-sm flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-600" /> Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@gmail.com"
          disabled={isSubmitting || isLoading}
          {...register('email')}
          className="focus:ring-2 focus:ring-purple-500 pl-6"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email.message}</span>
        )}
      </div>
      <div className="grid gap-3">
        <div className="flex items-center">
          <Label htmlFor="password" className="text-gray-700 text-sm flex items-center">
            <Key className="h-4 w-4 mr-2 text-gray-600" /> Password
          </Label>
        </div>
        <div className="relative">
          <Input
            id="password"
            {...register('password')}
            placeholder="******"
            type={showPassword ? 'text' : 'password'}
            disabled={isSubmitting || isLoading}
            className="focus:ring-2 focus:ring-purple-500 pl-6"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password.message}</span>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-2 rounded-lg transition-all duration-300 flex items-center justify-center"
        size={'sm'}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>
    </motion.form>
  );
};

export default LoginForm;