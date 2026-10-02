// src/components/ReportInsightItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme, { FONTS } from '../constants/theme';

const ReportInsightItem = ({ label, value, unit, status }) => {
  const getStatusColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'normal': return theme.success;
      case 'low': return theme.warning;
      case 'high': return theme.error;
      default: return theme.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View>
        <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.textSecondary }]}>{value} {unit}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: getStatusColor(status) + '22', borderColor: getStatusColor(status) }]}>
        <Text style={[styles.badgeText, { color: getStatusColor(status) }]}>{status}</Text>
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
  label: { ...FONTS.bodyLarge, fontWeight: 'bold' },
  value: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
});

export default ReportInsightItem;
