import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckedState } from '@radix-ui/react-checkbox';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { toast } from 'sonner';
// Initialize the phone number utility
const phoneUtil = PhoneNumberUtil.getInstance();

// Define a custom validator for phone numbers
const phoneNumberSchema = z.string().refine(
  (value) => {
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(value);
      return phoneUtil.isValidNumber(phoneNumber);
    } catch (error) {
      return false;
    }
  },
  {
    message: 'This is not a valid phone number',
  },
);

// Validation schema using zod
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phoneNumber: phoneNumberSchema,
  streetAddress: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  notifications: z.object({
    email: z.boolean().optional(),
    system: z.boolean().optional(),
  }),
});

// TypeScript type inferred from the schema
type Profile = z.infer<typeof profileSchema>;

const ProfileChanges = () => {
  const { register, handleSubmit, control, setValue } = useForm<Profile>({
    resolver: zodResolver(profileSchema),
  });

  // Submit handler
  const onSubmit: SubmitHandler<Profile> = async (data) => {
    console.log(data);
  };
  const onError: SubmitErrorHandler<Profile> = async (errors) => {
    console.log(errors);
    for (const error of Object.values(errors)) {
      if (error.message) {
        toast.error(error.message);
        break; // Show only the first error message
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <Label className="text-xl">Profile Changes</Label>
        <Label className="text-secondary-foreground/60 leading-normal text-base">
          Manage your profile changes. Once approved, your profile will be
          visible to other users. New changes will be reflected in your profile
          within 24 hours.
        </Label>
        <Label className="text-secondary-foreground/60 leading-normal text-base">
          This information will be displayed publicly so be careful what you
          share.
        </Label>
      </div>
      <form
        className="pt-10 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Label
              htmlFor="first-name"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              First name
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                {...register('firstName')}
                id="firstName"
                autoComplete="given-name"
                className="border border-primary focus:border-0"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <Label
              htmlFor="last-name"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              Last name
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                {...register('lastName')}
                id="last-name"
                autoComplete="family-name"
                className="border border-primary focus:border-0"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <Label
              htmlFor="gender"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              Gender
            </Label>
            <Select
              onValueChange={(value: any) =>  {
                setValue('gender', value);
              }}
            >
              <SelectTrigger className="mt-2 sm:col-span-3 border border-primary focus:border-0">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-3">
            <Label
              htmlFor="phoneNumber"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              Phone Number
            </Label>
            <div className="mt-2">
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    defaultCountry="US"
                    international
                    inputComponent={Input}
                    withCountryCallingCode
                    placeholder="Enter phone number"
                    className="mr-2 "
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-3">
          <Label
            htmlFor="street-address"
            className="block leading-6 text-base font-medium text-secondary-foreground"
          >
            Street Address
          </Label>
          <div className="mt-2">
            <Input
              type="text"
              {...register('streetAddress')}
              id="street-address"
              autoComplete="street-address"
              className="border border-primary focus:border-0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Label
              htmlFor="city"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              City
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                {...register('city')}
                id="city"
                autoComplete="city"
                className="border border-primary focus:border-0"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <Label
              htmlFor="state"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              State / Province
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                {...register('state')}
                id="state"
                autoComplete="state"
                className="border border-primary focus:border-0"
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <Label
              htmlFor="state"
              className="block leading-6 text-base font-medium text-secondary-foreground"
            >
              Postal code
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                {...register('postalCode')}
                id="postal-code"
                autoComplete="postal-code"
                className="border border-primary focus:border-0"
              />
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <Label className="text-base font-semibold leading-7 block">
            Notifications
          </Label>
          <Label className="mt-1 text-secondary-foreground/60 leading-normal text-base">
            We'll always let you know about important changes, but you pick what
            else you want to hear about.
          </Label>
          <div className="mt-10 space-y-10">
            <div className="items-top flex space-x-2">
              <Checkbox
                id="emailNotify"
                onCheckedChange={(checked: CheckedState) => {
                  if (checked) {
                    setValue('notifications.email', true);
                  } else {
                    setValue('notifications.email', false);
                  }
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="emailNotify"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  By Emails
                </Label>
                <p className="text-secondary-foreground">
                  Get notified by emails
                </p>
              </div>
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="systemNotify"
                onCheckedChange={(checked: CheckedState) => {
                  if (checked) {
                    setValue('notifications.system', true);
                  } else {
                    setValue('notifications.system', false);
                  }
                }}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="system"
                  className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  By System Notifications
                </Label>
                <p className="text-secondary-foreground">
                  Get notified by system popup notifications
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="submit"
            variant={'default'}
            size={'sm'}
            className="px-8"
          >
            Save
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileChanges;
