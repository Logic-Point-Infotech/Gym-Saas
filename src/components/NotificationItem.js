// src/components/NotificationItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { SIZES, SPACING, FONTS } from '../constants/theme';

const NotificationItem = ({ notification }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{notification.title}</Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>{notification.message}</Text>
        <Text style={[styles.time, { color: theme.textSecondary + '80' }]}>{notification.time}</Text>
      </View>
      {!notification.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: { flex: 1 },
  title: { ...FONTS.bodyLarge, fontWeight: 'bold' },
  message: { ...FONTS.bodySmall, marginVertical: 4 },
  time: { fontSize: 10, textTransform: 'uppercase' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10 },
});

export default NotificationItem;
