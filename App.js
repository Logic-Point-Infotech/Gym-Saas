// App.js
import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/constants/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore specific warnings for clean production feel
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#0A0A12" />
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
