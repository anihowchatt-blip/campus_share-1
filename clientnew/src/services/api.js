import axios from 'axios';

// Create Axios client instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Modify config before request is sent if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Return standard response data directly
    return response.data;
  },
  (error) => {
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
      isNetworkError: !error.response,
    };

    return Promise.reject(formattedError);
  }
);

// Common service methods
export const checkHealth = async () => {
  return api.get('/health');
};

export default api;
