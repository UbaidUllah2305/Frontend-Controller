import z from 'zod';


// Zod schema for the login credentials form
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

// TypeScript type inferred from the schema
export type LoginFormValues = z.infer<typeof loginSchema>;
