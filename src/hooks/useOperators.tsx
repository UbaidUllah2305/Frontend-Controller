import { axiosInstance } from '@/lib/axios';
import { shortOperatorT } from '@/types/Responses/Operators';
import ApiWrapper from '@/utils/ApiWrapper';
import { useMutation } from '@tanstack/react-query';

export function useOperators() {
  const addNewOperator = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      image: string;
      gender: string;
    }) => {
      const { data: response } = await axiosInstance.post('/operators', data);
      return response.data;
    },
  });
  // get all operators
  const getOperators = ApiWrapper<shortOperatorT[]>(async () => {
    const { data } = await axiosInstance.get('/operators');
    return data.data.operators;
  });
  // delete operator
  const deleteOperator = useMutation({
      mutationFn: async (email: string) => {
        const { data } = await axiosInstance.delete(`/operators/${email}`);
        return data.data;
      },
  })
  return {
    getOperators,
    addNewOperator,
    deleteOperator
  };
}
