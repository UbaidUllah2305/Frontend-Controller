// src/pages/auth/Register-Form.tsx:

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Phone, Home, FileText } from 'lucide-react'; // Added icons
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define the schema for the registration form
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  vatNumber: z.string().min(1, 'VAT Number is required'),
  tradeLicense: z.instanceof(File).refine(file => file.size > 0, 'Trade License is required'),
  address: z.string().optional(),
  nationality: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tradeLicenseBase64, setTradeLicenseBase64] = React.useState<string | null>(null); // Store Base64 string
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Convert file to Base64
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setTradeLicenseBase64(base64); // Store Base64 string
      setValue('tradeLicense', file); // Update form value
    }
  };

  // Helper function to convert file to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);

    // Prepare form data
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      vatNumber: data.vatNumber,
      tradeLicense: tradeLicenseBase64, // Use Base64 string
      address: data.address || '',
      nationality: data.nationality || '',
    };

    console.log(payload);

    // Simulate API call
    try {
      // Replace with actual API call
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      // const result = await response.json();
      // if (result.success) {
      toast.success('Registration Successful');
      setIsLoading(false);
      navigate('/', { replace: true });
      // }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration Failed');
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(handleRegister)}
      className="grid gap-6"
    >
      {/* Grid layout for two fields per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="grid gap-3">
          <Label htmlFor="name" className="text-gray-700 text-sm flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-600" /> Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={isSubmitting || isLoading}
            {...register('name')}
            className="focus:ring-2 focus:ring-purple-500 pl-6"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Phone Field */}
        <div className="grid gap-3">
          <Label htmlFor="phone" className="text-gray-700 text-sm flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-600" /> Phone
          </Label>
          <Input
            id="phone"
            type="text"
            placeholder="+1234567890"
            disabled={isSubmitting || isLoading}
            {...register('phone')}
            className="focus:ring-2 focus:ring-purple-500 pl-6"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </div>
      </div>

      {/* Grid layout for two fields per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Field */}
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

        {/* Address Field */}
        <div className="grid gap-3">
          <Label htmlFor="address" className="text-gray-700 text-sm flex items-center">
            <Home className="h-4 w-4 mr-2 text-gray-600" /> Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Main St"
            disabled={isSubmitting || isLoading}
            {...register('address')}
            className="focus:ring-2 focus:ring-purple-500 pl-6"
          />
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address.message}</span>
          )}
        </div>
      </div>

      {/* Grid layout for two fields per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nationality Field */}
        <div className="grid gap-3">
          <Label htmlFor="nationality" className="text-gray-700 text-sm flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-600" /> Nationality
          </Label>
          <Input
            id="nationality"
            type="text"
            placeholder="Nationality"
            disabled={isSubmitting || isLoading}
            {...register('nationality')}
            className="focus:ring-2 focus:ring-purple-500 pl-6"
          />
          {errors.nationality && (
            <span className="text-red-500 text-sm">{errors.nationality.message}</span>
          )}
        </div>

        {/* VAT Number Field */}
        <div className="grid gap-3">
          <Label htmlFor="vatNumber" className="text-gray-700 text-sm flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-600" /> VAT Number
          </Label>
          <Input
            id="vatNumber"
            type="text"
            placeholder="VAT123456"
            disabled={isSubmitting || isLoading}
            {...register('vatNumber')}
            className="focus:ring-2 focus:ring-purple-500 pl-6"
          />
          {errors.vatNumber && (
            <span className="text-red-500 text-sm">{errors.vatNumber.message}</span>
          )}
        </div>
      </div>

      {/* Trade License Field */}
      <div className="grid gap-3">
        <Label htmlFor="tradeLicense" className="text-gray-700 text-sm flex items-center">
          <FileText className="h-4 w-4 mr-2 text-gray-600" /> Trade License
        </Label>
        <Input
          id="tradeLicense"
          type="file"
          accept=".pdf,image/*"
          disabled={isSubmitting || isLoading}
          onChange={handleFileChange}
          className="focus:ring-1 focus:ring-gray-700 pl-6"
        />
        {errors.tradeLicense && (
          <span className="text-red-500 text-sm">{errors.tradeLicense.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-2 rounded-lg transition-all duration-300 flex items-center justify-center"
        size={'sm'}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Register
      </Button>
    </motion.form>
  );
};

export default RegisterForm;