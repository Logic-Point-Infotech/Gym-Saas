import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import TopNavBar from './src/components/TopNavBar';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={colors.surface} />
        <View style={styles.root}>
          <TopNavBar />
          <BottomTabNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
