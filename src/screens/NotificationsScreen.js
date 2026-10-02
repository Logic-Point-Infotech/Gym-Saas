// src/screens/NotificationsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { getNotifications, markAsRead } from '../api/notificationApi';
import NotificationItem from '../components/NotificationItem';
import theme, { SIZES } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !refreshing) {
    return <View style={[styles.center, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.heading }]}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleRead(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={{ color: theme.muted }}>No notifications yet.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  header: { padding: 20, paddingTop: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold' },
  list: { padding: 20 },
});

export default NotificationsScreen;
