// src/utils/helpers.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  TOKEN: 'macromate_token',
  USER: 'macromate_user',
};

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

export const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval}y ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval}mo ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval}d ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval}h ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval}m ago`;

  return 'just now';
};
