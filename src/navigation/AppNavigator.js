// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import HealthReportScreen from '../screens/HealthReportScreen';
import BloodReportScreen from '../screens/BloodReportScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import TrainerScreen from '../screens/TrainerScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
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
            name="BloodReport"
            component={BloodReportScreen}
          />
          <Stack.Screen
            name="DietPlan"
            component={DietPlanScreen}
          />
          <Stack.Screen
            name="Trainer"
            component={TrainerScreen}
          />
          <Stack.Screen
            name="WorkoutDetail"
            component={WorkoutScreen}
            options={{ headerShown: true, title: 'Workout Routine' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
