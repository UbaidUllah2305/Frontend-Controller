// src/pages/auth/Login.tsx:

import LoginForm from './Login-Form';
import { Label } from '@/components/ui/label';
import React from 'react';
import BlurFade from '@/components/ui/blur-fade';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const Login = () => {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme('light'); // Set your theme here after component mounts
  }, []);

  return (
    <React.Fragment>
      {/* Root container with full viewport height and no overflow */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center light overflow-hidden">
        {/* Grid container for split layout */}
        <div className="w-full h-screen grid lg:grid-cols-2 p-4">
          {/* Left Side: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center p-8 overflow-y-auto" // Allow scrolling only inside this container
          >
            <div className="w-full max-w-md">
              <BlurFade delay={0.6} inView>
                <div className="mt-10">
                  <div className="mb-6 space-y-2">
                    <Label className="text-3xl font-bold text-gray-900">Welcome Back</Label>
                    <Label className="block text-gray-500 text-sm">
                      Enter your email and password to access your account.
                    </Label>
                  </div>
                  <LoginForm />
              
                </div>
              </BlurFade>
            </div>
          </motion.div>

          {/* Right Side: Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex items-center justify-center bg-cover bg-center overflow-hidden rounded-xl" // Ensure no overflow
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW9iaWxlfGVufDB8fDB8fHww')`,
            }}
          >

          </motion.div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;