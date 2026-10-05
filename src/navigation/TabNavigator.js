// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import TrainerScreen from '../screens/TrainerScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MemberHistoryScreen from '../screens/MemberHistoryScreen';
import { useTheme } from '../constants/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="MemberHistory"
      component={MemberHistoryScreen}
      options={{
        title: 'Member History',
        headerStyle: { backgroundColor: '#0A0A12' },
        headerTintColor: '#F0F0F0',
      }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'view-dashboard';
          else if (route.name === 'Nutrition') iconName = 'food-apple';
          else if (route.name === 'Workouts') iconName = 'dumbbell';
          else if (route.name === 'Diet Plan') iconName = 'silverware-fork-knife';
          else if (route.name === 'Trainer') iconName = 'account-tie';
          else if (route.name === 'Profile') iconName = 'account';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Workouts" component={WorkoutScreen} />
      <Tab.Screen name="Diet Plan" component={DietPlanScreen} />
      <Tab.Screen name="Trainer" component={TrainerScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
