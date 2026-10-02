// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/helpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (token) {
        setUserToken(token);
        setUser(userData ? JSON.parse(userData) : null);
      }
    } catch (e) {
      console.log('Error loading auth data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData) => {
    setUserToken(token);
    setUser(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
