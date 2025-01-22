import LoginForm from './Login-Form';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BlurFade from '@/components/ui/blur-fade';
import { useTheme } from 'next-themes';
const Login = () => {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme('light'); //set your theme here after component mounts
  }, []);
  return (
    <React.Fragment>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 light">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-8">
          <div className="w-full max-w-md mx-auto flex flex-col justify-center">
            <div className="flex-1 md:top-10 md:absolute">
              <BlurFade delay={0.5} inView>
                <div className="flex items-center space-x-2">
                  {/* <Avatar className="rounded-md">
                    <AvatarImage
                      src="/src/assets/logo/ADP.svg"
                      alt="adp-logo"
                    />
                    <AvatarFallback>ADP</AvatarFallback>
                  </Avatar> */}
                  <div className="flex flex-col">
                    <Label className="text-base">Medinven</Label>
                    <Label className="text-sm text-muted-foreground">
                      The best surgical distribution platform for your business
                    </Label>
                  </div>
                </div>
              </BlurFade>
            </div>{' '}
            <BlurFade delay={0.6} inView>
              <div className="mt-10">
                <div className="mb-3 space-y-2">
                  <Label className="text-2xl font-semibold mt-6 mb-2">
                    Login
                  </Label>
                  <Label className="block text-muted-foreground text-sm">
                    Enter your Email and Password to login your account.
                  </Label>
                </div>
                <LoginForm />
                <div className="flex items-center justify-center w-full my-5">
                  <div className="flex-1 h-px bg-muted" />
                  <span className="px-4 text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-muted" />
                </div>
                <div className="mt-6">
                  <p className="text-start text-sm text-muted-foreground">
                    Don&apos;t have an account? Connect to our operation team to
                    create your business account.{' '}
                    <Link
                      to="mailto:operationdepartment@artemamed.com"
                      className="font-medium text-gray-900"
                    >
                      Contact us
                    </Link>
                  </p>
                </div>
                {/* <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/" className="font-medium text-gray-900">
                  Log in
                </Link>
              </p>  */}
              </div>
            </BlurFade>
          </div>
          <div className="hidden lg:flex justify-center items-center w-full p-2 max-w-md mx-auto">
            <BlurFade delay={0.7} inView>
              <img
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
                alt="adp-login-image"
                className="h- w-fit rounded-lg"
              />
            </BlurFade>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
