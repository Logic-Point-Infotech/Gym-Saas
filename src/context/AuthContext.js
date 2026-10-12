// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/helpers';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null); // 'client' | 'trainer' | null

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const savedRole = await AsyncStorage.getItem('macromate_active_role');
      if (token) {
        setUserToken(token);
        setUser(userData ? JSON.parse(userData) : null);
      }
      if (savedRole) {
        setActiveRole(savedRole);
      }
    } catch (e) {
      console.log('Error loading auth data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = async (role) => {
    setActiveRole(role);
    await AsyncStorage.setItem('macromate_active_role', role);
  };

  const login = async (token, userData) => {
    setUserToken(token);
    setUser(userData);
    const role = userData?.role === 'trainer' ? 'trainer' : 'client';
    setActiveRole(role);
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    await AsyncStorage.setItem('macromate_active_role', role);
  };

  const logout = async () => {
    setUserToken(null);
    setUser(null);
    setActiveRole(null);
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER, 'macromate_active_role']);
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, user, activeRole, selectRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
