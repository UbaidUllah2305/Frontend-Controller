import { PhoneNumberUtil } from "google-libphonenumber";
import { z } from "zod";

// Initialize the phone number utility
const phoneUtil = PhoneNumberUtil.getInstance();

// Define a custom validator for phone numbers
const phoneNumberSchema = z.string().refine(
  (value) => {
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(value);
      return phoneUtil.isValidNumber(phoneNumber);
    } catch {
      return false;
    }
  },
  {
    message: 'This is not a valid phone number',
  },
);

// Validation schema using zod
export const NewCompanySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phoneNumber: phoneNumberSchema,
  avatar: z.string().default('blueEverywhere'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street address is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().min(1, 'Company website is required'),
  companyDescription: z.string().min(1, 'Company description is required'),
  companySerialCode: z.string().min(1, 'Company serial code is required'),
});

// TypeScript type inferred from the schema
export type Company = z.infer<typeof NewCompanySchema>;
