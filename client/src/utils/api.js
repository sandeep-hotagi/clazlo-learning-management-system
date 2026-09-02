// client/src/utils/api.js
// Centralized API and Socket URL configuration with mobile device & network auto-detection.

import axios from 'axios';

export const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      const protocol = window.location.protocol;
      const host = window.location.hostname;
      // If served via standard dev port or tunnel, dynamically target port 5000 or same origin
      const port = window.location.port === '5176' ? '5000' : window.location.port;
      return `${protocol}//${host}${port ? `:${port}` : ''}/api`;
    }
    return envUrl;
  }
  return envUrl || 'http://localhost:5000/api';
};

export const getSocketUrl = () => {
  const envSocketUrl = import.meta.env.VITE_SOCKET_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (!envSocketUrl || envSocketUrl.includes('localhost') || envSocketUrl.includes('127.0.0.1')) {
      const protocol = window.location.protocol;
      const host = window.location.hostname;
      const port = window.location.port === '5176' ? '5000' : window.location.port;
      return `${protocol}//${host}${port ? `:${port}` : ''}`;
    }
    return envSocketUrl;
  }
  return envSocketUrl || 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
