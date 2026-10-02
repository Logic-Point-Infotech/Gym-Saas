// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import theme, { FONTS } from '../constants/theme';

const SplashScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.logoBox, { borderColor: theme.primary }]}>
        <Text style={[styles.logoText, { color: theme.primary }]}>M</Text>
      </View>
      <Text style={[styles.title, { color: theme.heading }]}>MacroMate</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Precision AI Fitness</Text>
      <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBox: { width: 100, height: 100, borderRadius: 24, borderWidth: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 60, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  subtitle: { fontSize: 16, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
  loader: { marginTop: 40 },
});

export default SplashScreen;
