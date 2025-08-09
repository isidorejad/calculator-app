import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// IMPORTANT: Replace with your computer's local IP address.
// Do NOT use 'localhost' if you are testing on a physical device.
// Find your IP address by typing `ipconfig` (Windows) or `ifconfig` (macOS) in your terminal.
const API_URL = 'https://calculator-app-2ltz.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the auth token to every request if it exists
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;