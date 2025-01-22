import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserAvatars } from '@/constants/Avatars';
import { useMarketers } from '@/hooks/useMarketers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import React from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema for form validation
const MarketerSchema = z.object({
  firstName: z.string().min(1, 'Marketer first name is required'),
  lastName: z.string().min(1, 'Marketer last name is required'),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  gender: z.enum(['male', 'female']),
});

// TypeScript type inferred from the schema
type MarketerFormTypes = z.infer<typeof MarketerSchema>;

const AddNewMarketerModal = () => {
  const { addNewMarketer } = useMarketers();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MarketerFormTypes>({
    resolver: zodResolver(MarketerSchema),
  });

  const query = useQueryClient();

  const onSubmit: SubmitHandler<MarketerFormTypes> = (data) => {
    const image =
      UserAvatars[data.gender][
        Math.floor(Math.random() * UserAvatars[data.gender].length)
      ];
    addNewMarketer.mutate(
      {
        ...data,
        image,
      },
      {
        onSuccess: () => {
          toast.success('New Marketer added successfully!');
          query.invalidateQueries({ queryKey: ['marketers'] });
          query.refetchQueries({ queryKey: ['marketers'] });
          setIsOpen(false);
          reset();
        },
        onError: () => {
          toast.error('Failed to add Marketer');
        },
      },
    );
  };

  const onError: SubmitErrorHandler<MarketerFormTypes> = (errors) => {
    console.error('Form Errors:', errors);
    toast.error('Please correct the errors in the form.');
  };

  return (
    <React.Fragment>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
          <Plus className="mr-2 w-4 h-4" />
          Add New Marketer
        </AlertDialogTrigger>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Marketer</AlertDialogTitle>
            <AlertDialogDescription>
              Enter new marketer details below to add a new marketer, make sure
              the email address is valid and does not already exist.
            </AlertDialogDescription>
            <form
              className="space-y-4 py-3"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="text-base">
                    First Name
                    <span className="ml-1 text-destructive">*</span>
                  </label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="First Name"
                    className="mt-1"
                  />
                  {errors.firstName && (
                    <span className="text-destructive text-sm">
                      {errors.firstName.message as React.ReactNode}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="name" className="text-base">
                    Last / Family Name
                    <span className="ml-1 text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    {...register('lastName')}
                    placeholder="Last Name"
                    className="mt-1"
                  />
                  {errors.lastName && (
                    <span className="text-destructive text-sm">
                      {errors.lastName.message as React.ReactNode}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-base">
                  Email
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="Email"
                  className="mt-1"
                />
                {errors.email && (
                  <span className="text-destructive text-sm">
                    {errors.email.message as React.ReactNode}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="password" className="text-base">
                  Password
                  <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="password"
                  {...register('password')}
                  placeholder="********"
                  className="mt-1"
                />
                {errors.password && (
                  <span className="text-destructive text-sm">
                    {errors.password.message as React.ReactNode}
                  </span>
                )}
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="gender">Gender</Label>
                <span className="ml-1 text-destructive">*</span>
                <Select
                  onValueChange={(value: any) => {
                    setValue('gender', value);
                  }}
                >
                  <SelectTrigger className="mt-2 sm:col-span-3">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  size={'sm'}
                  variant={'outline'}
                >
                  Cancel
                </Button>
                <Button size={'sm'}>Add</Button>
              </div>
            </form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default AddNewMarketerModal;
