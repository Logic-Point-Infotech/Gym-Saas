// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { FONTS } from '../constants/theme';

const SplashScreen = ({ onFinish }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <View style={[styles.logoPlaceholder, { borderColor: theme.onPrimary }]}>
        <Text style={{color: theme.onPrimary, fontSize: 60, fontWeight: 'bold'}}>M</Text>
      </View>
      <Text style={[styles.title, { color: theme.onPrimary }]}>MACROMATE</Text>
      <Text style={[styles.subtitle, { color: theme.onPrimary, opacity: 0.8 }]}>Your AI Fitness Coach</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...FONTS.h1,
    letterSpacing: 2,
  },
  subtitle: {
    ...FONTS.body,
    marginTop: 10,
    opacity: 0.8,
  },
});

export default SplashScreen;
