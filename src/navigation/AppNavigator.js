// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import HealthReportScreen from '../screens/HealthReportScreen';
import WorkoutScreen from '../screens/WorkoutScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Remove the conditional check here */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: true, title: 'Notifications' }}
        />
        <Stack.Screen
          name="HealthReport"
          component={HealthReportScreen}
        />
        <Stack.Screen
          name="WorkoutDetail"
          component={WorkoutScreen}
          options={{ headerShown: true, title: 'Workout Routine' }}
        />
      </Stack.Navigator>
    );
};

export default AppNavigator;
