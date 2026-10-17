import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = [error.response?.data?.message].flat().join(' ');
    return Promise.reject(new Error(message || 'Erro de conexão'));
  },
);
