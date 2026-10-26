import axios from 'axios';
import { getToken, clearSession } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});


api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
