// src/pages/auth/Login.tsx:

import LoginForm from './Register-Form';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Link } from 'react-router-dom';
import BlurFade from '@/components/ui/blur-fade';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const Regsiter = () => {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme('light'); // Set your theme here after component mounts
  }, []);

  return (
    <React.Fragment>
      {/* Root container with full viewport height and no overflow */}
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center light overflow-hidden">
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
                    <Label className="text-3xl font-bold text-gray-900">Welcome User</Label>
                    <Label className="block text-gray-500 text-sm">
                      Enter your data to send query for Registration.
                    </Label>
                  </div>
                  <LoginForm />
                  <div className="flex items-center justify-center w-full my-5">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="px-4 text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="mt-6">
                    <p className="text-start text-sm text-gray-500">
                      Have an account?{' '}
                      <Link
                        to="/auth/login"
                        className="font-medium text-gray-600 hover:text-gray-800"
                      >
                        Login now
                      </Link>
                    </p>
                  </div>
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
              backgroundImage: `url('https://plus.unsplash.com/premium_photo-1686730540277-c7e3a5571553?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGNhcnxlbnwwfHwwfHx8MA%3D%3D')`,
            }}
          >

          </motion.div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Regsiter;