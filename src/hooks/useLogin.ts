import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

interface LoginPayload {
  phone: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosClient.post(API_ENDPOINTS.LOGIN, null, {
        params: {
          phone: payload.phone,
          password: payload.password,
        },
      });
      return data;
    },
  });
};
