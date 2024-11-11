import axios from 'axios';
import { BACKEND_URL } from '../utils';

// Create an Axios instance
const API = axios.create({
  baseURL: BACKEND_URL+'/api/v1',
  withCredentials: true,
});

// Handle 401 error globally
API.interceptors.response.use(
  (response) => response, // Simply return the response if no error
  (error) => {
    if (error.response && error.response.status === 401) {
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Delete cookie
    }
    return Promise.reject(error); // Reject the error to propagate it
  }
);

export default API;
