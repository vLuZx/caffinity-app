import axios from 'axios';
import { APP } from '../config/app';

export const apiClient = axios.create({
  	baseURL: APP.API_URL,
  	headers: {
    	'Content-Type': 'application/json',
  	},
  	withCredentials: true,
});

apiClient.interceptors.request.use(
  	(config) => {
    	const token = localStorage.getItem('accessToken');
    	if (token) {
      		config.headers.Authorization = `Bearer ${token}`;
    	}
    	return config;
  	},
  	(error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  	(response) => response,
  	(error) => {
    	if (error.response?.status === 401) {
      		localStorage.removeItem('accessToken');
      		localStorage.removeItem('userId');
      		window.location.href = '/login';
    	}
    	return Promise.reject(error);
  	}
);
