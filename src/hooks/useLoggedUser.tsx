import { axiosInstance } from '@/lib/axios';
import { LoggedUserResponse } from '@/types/Responses/LoggedUser';
import ApiWrapper from '@/utils/ApiWrapper';

export const useLoggedUser = () => {
  // Fetched the Logged User Profile Data
  const UserProfile = ApiWrapper<LoggedUserResponse>(async (): Promise<LoggedUserResponse> => {
    const { data } = await axiosInstance.get('/users/profile');
    return data.data;
  });
  return {
    UserProfile,
  };
};
