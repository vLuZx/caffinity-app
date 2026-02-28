import { apiClient } from '../../lib/api-client';
import type { User } from '../../lib/types';

export const usersApi = {
  getUsername: async (userId: string): Promise<string> => {
    const response = await apiClient.get<string>(`/users/${userId}/username`);
    return response.data;
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },
};