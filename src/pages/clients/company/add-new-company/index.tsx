import CountrySelect from '@/components/ui/country-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
// import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
// import { PhoneNumberUtil } from 'google-libphonenumber';
import PhoneInput from 'react-phone-number-input';
import RegionSelect from '@/components/ui/region-select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { UserAvatars } from '@/constants/Avatars';
import { Company, NewCompanySchema } from './client-form.types';
import { useClients } from '@/hooks/useClients';
import axios from 'axios';

const AddNewCompany = () => {
  const { addClient } = useClients();
  const [Logo, setLogo] = React.useState(UserAvatars.male[0]);
  const { register, handleSubmit, watch, control, setValue, reset } =
    useForm<Company>({
      resolver: zodResolver(NewCompanySchema),
    });
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const selectedCountry = watch('country');

  // Submit handler
  const onSubmit: SubmitHandler<Company> = async (data) => {
    addClient.mutate(data, {
      onSuccess: () => {
        toast.success('Client added successfully');
        reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage =
            error.response.data.message || 'An error occurred';
          toast.error(`Error: ${errorMessage}`);
        } else {
          toast.error(`Error: ${error.message}`);
        }
      },
    });
  };

  const onError: SubmitErrorHandler<Company> = async (errors) => {
    for (const error of Object.values(errors)) {
      if (error.message) {
        toast.error('Please fill all the fields');
        break;
      }
    }
  };
  return (
    <React.Fragment>
      <form
        className="pt-10 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div className="space-y-12">
          <div className="border-b border-primary pb-12">
            <Label className="text-lg font-semibold">
              Personal Information
            </Label>
            <Label className="block text-muted-foreground mt-1 text-sm/6 ">
              Add Client Personal Information.
            </Label>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label htmlFor="firstName" className="text-base">
                  First name
                </Label>
                <div className="mt-2">
                  <Input
                    id="firstName"
                    required
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="lastName" className="text-base">
                  Last name
                </Label>
                <div className="mt-2">
                  <Input
                    id="lastName"
                    required
                    {...register('lastName')}
                    type="text"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="email" className="text-base">
                  Email address
                </Label>
                <div className="mt-2">
                  <Input
                    required
                    {...register('email')}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    {...register('password')}
                    placeholder="******"
                    type={showPassword ? 'text' : 'password'}
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>{' '}
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
                  onValueChange={(value: any) => {
                    setValue('gender', value);
                  }}
                >
                  <SelectTrigger className="mt-2 sm:col-span-3 border border-primary focus:border-0">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
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
              <div className="sm:col-span-6">
                <Label
                  htmlFor="avatar"
                  className=" text-sm font-medium leading-6 "
                >
                  Avatar
                </Label>
                <div className="mt-2">
                  <Dialog>
                    <DialogTrigger>
                      {' '}
                      <img
                        src={`${Logo}`}
                        alt="selected-avatar"
                        className="rounded-full object-contain object-center w-16 h-16"
                        width={200}
                        height={200}
                      />
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <AlertDialogHeader>
                        <DialogTitle className="text-center">
                          Select Your Favorite Avatar
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          Soon we will add more avatars
                        </DialogDescription>
                        <div className="grid grid-cols-4 gap-4 py-2">
                          {UserAvatars.male.map((logo, logoKey) => (
                            <div key={logoKey} className="relative">
                              <img
                                src={logo}
                                alt={'user-avatar'}
                                className={`rounded-2xl object-contain object-center ${
                                  Logo === logo
                                    ? 'border-4 border-primary'
                                    : 'border-4 border-transparent'
                                }`}
                                width={200}
                                id="avatar"
                                height={200}
                                onClick={() => {
                                  setLogo(logo);
                                  setValue('avatar', logo);
                                }}
                              />{' '}
                            </div>
                          ))}
                          {UserAvatars.female.map((logo, logoKey) => (
                            <div key={logoKey} className="relative">
                              <img
                                src={logo}
                                alt={'user-avatar'}
                                className={`rounded-2xl object-contain object-center ${
                                  Logo === logo
                                    ? 'border-4 border-primary'
                                    : 'border-4 border-transparent'
                                }`}
                                width={200}
                                id="avatar"
                                height={200}
                                onClick={() => {
                                  setLogo(logo);
                                  setValue('avatar', logo);
                                }}
                              />{' '}
                            </div>
                          ))}
                        </div>
                      </AlertDialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 border-b border-primary pb-12">
            <Label className="text-lg font-semibold">
              Client / Company Address
            </Label>
            <Label className="block text-muted-foreground mt-1 text-sm/6 ">
              Add Client or Company Address.
            </Label>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label htmlFor="country" className="text-base">
                  Country
                </Label>
                <div className="mt-2">
                  <CountrySelect
                    priorityOptions={['US', 'CA']}
                    onChange={(value) => setValue('country', value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="country" className="text-base">
                  State/Province
                </Label>
                <div className="mt-2">
                  <RegionSelect
                    onChange={(value) => setValue('state', value)}
                    countryCode={selectedCountry}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 sm:col-start-1">
                <Label htmlFor="city" className="text-base">
                  City
                </Label>
                <div className="mt-2">
                  <Input
                    id="city"
                    {...register('city')}
                    type="text"
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="postalCode" className="text-base">
                  ZIP / Postal code
                </Label>
                <div className="mt-2">
                  <Input
                    id="postalCode"
                    {...register('postalCode')}
                    type="text"
                    autoComplete="postal-code"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="street" className="text-base">
                  Street Address
                </Label>
                <div className="mt-2">
                  <Input
                    id="street"
                    {...register('street')}
                    type="text"
                    autoComplete="street-address"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pb-12">
            <Label className="text-lg font-semibold">Company Info</Label>
            <Label className="block text-muted-foreground mt-1 text-sm/6 ">
              Add Client Company Information.
            </Label>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label htmlFor="companyName" className="text-base">
                  Company Name
                </Label>
                <div className="mt-2">
                  <Input
                    id="companyName"
                    {...register('companyName')}
                    type="text"
                    autoComplete="companyName"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="companyWebsite" className="text-base">
                  Company Website
                </Label>
                <div className="mt-2">
                  <Input
                    id="companyWebsite"
                    {...register('companyWebsite')}
                    type="text"
                    autoComplete="companyWebsite"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="companySerialCode" className="text-base">
                  Serial Code
                </Label>
                <div className="mt-2">
                  <Input
                    id="companySerialCode"
                    {...register('companySerialCode')}
                    autoCapitalize="on"
                    type="text"
                    autoComplete="companySerialCode"
                  />
                </div>
              </div>
              <div className="sm:col-span-full">
                <Label htmlFor="companyDescription" className="text-base">
                  Company Description
                </Label>
                <div className="mt-2">
                  <Textarea
                    id="companyDescription"
                    {...register('companyDescription')}
                    autoComplete="companyDescription"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button type="submit" variant={'default'} size={'lg'}>
            Create
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default AddNewCompany;
