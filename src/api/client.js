// src/api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/helpers';

const client = axios.create({
  baseURL: 'https://gym-saas-j0f7.onrender.com/api',
  timeout: 25000, // 25s timeout handles Render free-tier cold starts
});

let onUnauthorizedCallback = null;

export const setOnUnauthorized = (cb) => {
  onUnauthorizedCallback = cb;
};

// Request Interceptor: Attach Token
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Auth Errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }

    // Extract readable error message
    const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);

export default client;
