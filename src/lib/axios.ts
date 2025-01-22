import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    origin: import.meta.env.VITE_API_ORIGIN,
    credentials: 'include',
  },
  withCredentials: true,
});
