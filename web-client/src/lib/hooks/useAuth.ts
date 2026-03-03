import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi, type RegisterRequest, type LoginRequest } from '../api/auth';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      navigate({ to: '/login' });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Registration failed:', error.response?.data);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      // No need to store anything - the httpOnly cookie is set by the server!
      // Just navigate to the home page
      navigate({ to: '/' });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Login failed:', error.response?.data);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Cookie is cleared by the server
      // Just navigate to login page
      navigate({ to: '/login' });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Logout failed:', error.response?.data);
    },
  });
};
