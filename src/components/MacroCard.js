// src/components/MacroCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme, { SIZES, FONTS } from '../constants/theme';

const MacroCard = ({ label, value, color }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={[styles.indicator, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.heading }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: SIZES.radius,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  label: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  value: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
});

export default MacroCard;
