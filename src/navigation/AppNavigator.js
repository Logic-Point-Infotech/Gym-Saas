// src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import TrainerTabNavigator from '../trainer/navigation/TrainerTabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import HealthReportScreen from '../screens/HealthReportScreen';
import BloodReportScreen from '../screens/BloodReportScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import TrainerScreen from '../screens/TrainerScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isLoading, userToken, activeRole, selectRole } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  // 1. Role Selection Screen (at launch if no active role chosen)
  if (!activeRole) {
    return <RoleSelectionScreen />;
  }

  // 2. Trainer Portal Flow
  if (activeRole === 'trainer') {
    return <TrainerTabNavigator onSwitchRole={() => selectRole(null)} />;
  }

  // 3. Client App Flow
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
