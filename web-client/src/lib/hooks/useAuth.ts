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
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userId', data.user.id);
      
      navigate({ to: '/' });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Login failed:', error.response?.data);
    },
  });
};
