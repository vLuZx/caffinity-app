import axios from 'axios';
import { APP } from '../config/app';

export const apiClient = axios.create({
	baseURL: APP.API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Forbidden/Unauthorized = login page
		if (error.response?.status === 401) {
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);
