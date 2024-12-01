import axios from 'axios';
import { BACKEND_URL } from '../utils';

// Create an Axios instance
const API = axios.create({
  baseURL: `${BACKEND_URL}/v1`,
  withCredentials: true,
});

// Attach token from localStorage to each request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 error globally and redirect to login
API.interceptors.response.use(
  (response) => response, // Simply return the response if no error
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Remove token from localStorage
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; // Direct the user to login page
      }    }
    return Promise.reject(error); // Reject the error to propagate it
  }
);

export default API;
