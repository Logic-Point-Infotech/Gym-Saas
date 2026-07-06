// src/components/ReportInsightItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, COLORS } from '../constants/theme';

const ReportInsightItem = ({ item }) => {
  const { theme } = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return theme.success;
      case 'Low': return theme.warning;
      case 'High': return theme.error;
      default: return theme.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>{item.label}</Text>
        <Text style={[styles.value, { color: theme.textSecondary }]}>{item.value} {item.unit}</Text>
      </View>
      <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  labelContainer: { flex: 1 },
  label: { ...FONTS.body, fontWeight: '600' },
  value: { ...FONTS.caption, marginTop: 2 },
  statusTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, minWidth: 70, alignItems: 'center' },
  statusText: { ...FONTS.caption, color: '#fff', fontWeight: 'bold' },
});

export default ReportInsightItem;
