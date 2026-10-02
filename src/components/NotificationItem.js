// src/components/NotificationItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme, { FONTS, SIZES } from '../constants/theme';
import { getTimeAgo } from '../utils/helpers';

const NotificationItem = ({ notification, onPress }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'DIET_UPDATE': return 'food-apple';
      case 'TRAINER_MESSAGE': return 'message-text';
      case 'MEMBERSHIP_ALERT': return 'card-account-details';
      default: return 'bell';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
        !notification.is_read && { borderLeftWidth: 4, borderLeftColor: theme.primary }
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
        <Icon name={getIcon()} size={20} color={theme.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.heading }]}>{notification.title}</Text>
        <Text style={[styles.message, { color: theme.textPrimary }]} numberOfLines={2}>{notification.message}</Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>{getTimeAgo(notification.sent_at)}</Text>
      </View>
      {!notification.is_read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: 'bold' },
  message: { fontSize: 12, marginTop: 4, lineHeight: 18 },
  time: { fontSize: 10, marginTop: 6, textTransform: 'uppercase' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
});

export default NotificationItem;
