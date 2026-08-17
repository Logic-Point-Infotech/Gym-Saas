import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import DashboardScreen from '../screens/DashboardScreen';
import ClientsScreen   from '../screens/ClientsScreen';
import WorkoutsScreen  from '../screens/WorkoutsScreen';
import InsightsScreen  from '../screens/InsightsScreen';
import ProfileScreen   from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Dashboard', icon: 'grid',         screen: DashboardScreen },
  { name: 'Clients',   icon: 'people',        screen: ClientsScreen   },
  { name: 'Workouts',  icon: 'barbell',       screen: WorkoutsScreen  },
  { name: 'Insights',  icon: 'analytics',     screen: InsightsScreen  },
  { name: 'Profile',   icon: 'person-circle', screen: ProfileScreen   },
];

function TabIcon({ name, focused }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: false,
      tension: 300,
      friction: 10,
    }).start();
  }, [focused]);

  const tab = TABS.find((t) => t.name === name);

  return (
    <Animated.View
      style={[
        styles.tabIcon,
        focused && styles.tabIconActive,
        { transform: [{ scale }] },
      ]}
    >
      <Ionicons
        name={focused ? tab.icon : `${tab.icon}-outline`}
        size={20}
        color={focused ? colors.onPrimary : colors.textSecondary}
      />
    </Animated.View>
  );
}

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom - 8 : 8 },
        ],
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      {TABS.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.screen} />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    paddingTop: 10,
    paddingBottom: 10,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
