// src/screens/NotificationsScreen.js
import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';
import { MOCK_NOTIFICATIONS } from '../utils/mockData';
import NotificationItem from '../components/NotificationItem';

const NotificationsScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Recent Notifications</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: SIZES.padding },
  header: { marginBottom: 20 },
  title: { ...FONTS.h3, fontWeight: 'bold' },
});

export default NotificationsScreen;
