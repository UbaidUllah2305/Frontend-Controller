import { store } from '@/store';
import { logoutUser } from '@/store/features/auth.slice';
import { AxiosError } from 'axios';

// Type for generic async functions
type GenericAsyncFunction<T = any> = (...args: any[]) => Promise<T>;

// Error handling wrapper using direct store dispatch
const ApiWrapper = <T,>(apiFunction: GenericAsyncFunction<T>): GenericAsyncFunction<T> => {
  return async (...args: any[]): Promise<T> => {
    try {
      return await apiFunction(...args);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.isAxiosError) {
        if (axiosError.response) {
          // Handle unauthorized error and trigger logout
          if (axiosError.response.status === 401) {
            store.dispatch(logoutUser()); 
            throw new Error('Session expired. Please log in again.');
          }
          const message = (axiosError.response.data as { message?: string })?.message || axiosError.response.statusText;
          throw new Error(`Error ${axiosError.response.status}: ${message}`);
        } else if (axiosError.request) {
          throw new Error('No response received from server. Please check your network connection.');
        } else {
          throw new Error('Error setting up the request. Please check the request configuration.');
        }
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  };
};

export default ApiWrapper;
