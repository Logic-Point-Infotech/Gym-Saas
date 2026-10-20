// src/api/client.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/helpers';

const BASE_URL = 'https://gym-saas-j0f7.onrender.com/api';

let onUnauthorizedCallback = null;

export const setOnUnauthorized = (cb) => {
  onUnauthorizedCallback = cb;
};

async function apiRequest(endpoint, method = 'GET', data = null, customHeaders = {}) {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${cleanEndpoint}`;

  const config = {
    method,
    headers,
  };

  if (data && !(data instanceof FormData)) {
    config.body = JSON.stringify(data);
  } else if (data instanceof FormData) {
    config.body = data;
    delete headers['Content-Type'];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const resData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
      throw new Error(resData.message || 'Not authorized, please login again.');
    }

    if (!response.ok) {
      throw new Error(resData.message || `Server Error (${response.status})`);
    }

    return { data: resData, status: response.status };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your internet connection.');
    }
    throw error;
  }
}

const client = {
  get: (url, config = {}) => apiRequest(url, 'GET', null, config?.headers),
  post: (url, data, config = {}) => apiRequest(url, 'POST', data, config?.headers),
  put: (url, data, config = {}) => apiRequest(url, 'PUT', data, config?.headers),
  delete: (url, config = {}) => apiRequest(url, 'DELETE', null, config?.headers),
  request: (options) => apiRequest(options.url, options.method, options.data, options.headers),
};

export default client;
