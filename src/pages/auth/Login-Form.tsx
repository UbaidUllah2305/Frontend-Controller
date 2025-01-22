import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LoginFormValues, loginSchema } from '@/types/auth';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store';
import { loginUser } from '@/store/features/auth.slice';
import { Link, useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isLoading, SetIsLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Handle the Input credentials for the login form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Handle the Credential login
  const HandleCredentialLogin = async (data: LoginFormValues) => {
    SetIsLoading(true);
    // Handle the login logic here
    const re = await dispatch(loginUser(data));
    if (re.meta.requestStatus === 'fulfilled') {
      toast.success('Login Successfully');
      SetIsLoading(false);
      navigate('/', {
        replace: true,
      });
      return;
    }
    if (re.meta.requestStatus === 'rejected') {
      toast.error(re.payload as string);
      SetIsLoading(false);
      return;
    }
  };
  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit(HandleCredentialLogin)}
        className="grid gap-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-accent-foreground text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="huzaifamajeed@gmail.com"
            disabled={isSubmitting || isLoading}
            {...register('email')}
          />
          {errors.email && (
            <span className="text-muted-foreground text-sm">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label
              htmlFor="password"
              className="text-accent-foreground text-sm"
            >
              Password
            </Label>
            {/* <Link
              to=""
              className="ml-auto inline-block text-accent-foreground text-sm underline"
            >
              Forgot password?
            </Link> */}
          </div>
          <div className="relative">
            <Input
              id="password"
              {...register('password')}
              placeholder="******"
              type={showPassword ? 'text' : 'password'}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isSubmitting || isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeIcon
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <EyeOffIcon
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>{' '}
          </div>
          {errors.password && (
            <span className="text-muted-foreground text-sm">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full"
          size={'sm'}
          variant={'shine'}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </React.Fragment>
  );
};

export default LoginForm;
