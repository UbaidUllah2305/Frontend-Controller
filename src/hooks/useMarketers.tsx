import { axiosInstance } from '@/lib/axios';
import { shortMarketerT } from '@/types/Responses/Marketers';
import ApiWrapper from '@/utils/ApiWrapper';
import { useMutation } from '@tanstack/react-query';

export function useMarketers() {
  const addNewMarketer = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      image: string;
      gender: string;
    }) => {
      const { data: response } = await axiosInstance.post('/marketers', data);
      return response.data;
    },
  });
  // get all Marketers
  const getMarketers = ApiWrapper<shortMarketerT[]>(async () => {
    const { data } = await axiosInstance.get('/marketers');
    return data.data.marketers;
  });
  // delete operator
  const deleteMarketer = useMutation({
      mutationFn: async (email: string) => {
        const { data } = await axiosInstance.delete(`/marketers/${email}`);
        return data.data;
      },
  })
  return {
    getMarketers,
    addNewMarketer,
    deleteMarketer
  };
}
