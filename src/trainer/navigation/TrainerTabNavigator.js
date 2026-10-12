// src/trainer/navigation/TrainerTabNavigator.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import TrainerDashboardScreen from '../screens/TrainerDashboardScreen';
import TrainerClientsScreen from '../screens/TrainerClientsScreen';
import TrainerWorkoutsScreen from '../screens/TrainerWorkoutsScreen';
import TrainerInsightsScreen from '../screens/TrainerInsightsScreen';
import TrainerProfileScreen from '../screens/TrainerProfileScreen';
import TopNavBar from '../components/TopNavBar';
import { AIProvider } from '../context/AIContext';

const Tab = createBottomTabNavigator();

export default function TrainerTabNavigator({ onSwitchRole }) {
  const ProfileScreenWithRole = (props) => (
    <TrainerProfileScreen {...props} onSwitchRole={onSwitchRole} />
  );

  return (
    <AIProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopNavBar onSwitchRole={onSwitchRole} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: styles.tabBar,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'grid-outline';
              if (route.name === 'Dashboard') iconName = focused ? 'grid' : 'grid-outline';
              else if (route.name === 'Clients') iconName = focused ? 'people' : 'people-outline';
              else if (route.name === 'Workouts') iconName = focused ? 'barbell' : 'barbell-outline';
              else if (route.name === 'Insights') iconName = focused ? 'analytics' : 'analytics-outline';
              else if (route.name === 'Profile') iconName = focused ? 'person-circle' : 'person-circle-outline';

              return <Ionicons name={iconName} size={size || 20} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Dashboard" component={TrainerDashboardScreen} />
          <Tab.Screen name="Clients" component={TrainerClientsScreen} />
          <Tab.Screen name="Workouts" component={TrainerWorkoutsScreen} />
          <Tab.Screen name="Insights" component={TrainerInsightsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreenWithRole} />
        </Tab.Navigator>
      </View>
    </AIProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
});
