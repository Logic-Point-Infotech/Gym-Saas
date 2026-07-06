// src/components/MacroCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { SIZES, FONTS } from '../constants/theme';

const MacroCard = ({ label, value, target, progress, color }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.muted }]}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    borderRadius: SIZES.radius,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  label: {
    ...FONTS.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    ...FONTS.bold,
    fontSize: 16,
    marginTop: 2,
  },
});

export default MacroCard;
