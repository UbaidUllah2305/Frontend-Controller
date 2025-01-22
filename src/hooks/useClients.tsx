import { axiosInstance } from '@/lib/axios';
import { Company } from '@/pages/clients/company/add-new-company/client-form.types';
import {
  Client,
  FullCompanyProfileAPIResponse,
} from '@/types/Responses/Client';
import ApiWrapper from '@/utils/ApiWrapper';
import { useMutation } from '@tanstack/react-query';

export function useClients() {
  // Function to get all clients with optional search and page parameters
  // This Function help to implement the Infinite Scroll feature
  const getClients = ApiWrapper<Client[]>(
    async ({
      search = '',
      page = 1,
    }: {
      search?: string;
      page?: number;
    }): Promise<Client[]> => {
      const { data } = await axiosInstance.get(
        `/clients?search=${search}&page=${page}`,
      );
      return data.data;
    },
  );

  // Function to add a new client
  const addClient = useMutation({
    mutationFn: async (client: Company) => {
      const { data } = await axiosInstance.post(
        '/clients/add-new-client',
        client,
      );
      return data.data;
    },
  });

  // Function to get a Client by their Serial Code
  const getCompanyProfile = ApiWrapper<FullCompanyProfileAPIResponse>(
    async (serialCode: string): Promise<FullCompanyProfileAPIResponse> => {
      const { data } = await axiosInstance.get(`/clients/company-profile/${serialCode}`);
      return data.data;
    },
  );

  return { getClients, addClient, getCompanyProfile };
}
