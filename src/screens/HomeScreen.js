// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { getProfile } from '../api/profileApi';
import { getTodayLog } from '../api/nutritionApi';
import { getWorkoutHistory } from '../api/workoutApi';
import CalorieRing from '../components/CalorieRing';
import MacroCard from '../components/MacroCard';
import theme, { SIZES, SPACING, FONTS } from '../constants/theme';
import { STORAGE_KEYS } from '../utils/helpers';

const TIPS = [
  "Consistency is more important than intensity.",
  "Drink at least 3-4 liters of water daily.",
  "Prioritize protein in every meal.",
  "Rest is where the muscle grows, not just the gym.",
  "Track your progress, not just your weight.",
  "Avoid processed sugars to reduce inflammation.",
  "Focus on form over lifting heavy weights.",
  "Fiber is your friend for digestion and fullness.",
  "A 10-minute walk after meals aids digestion.",
  "Sleep 7-8 hours for optimal hormonal balance."
];

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ profile: null, nutrition: null, workoutHistory: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadInitialUser = async () => {
    const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const fetchData = async () => {
    try {
      const [profile, nutrition, workoutHistory] = await Promise.all([
        getProfile(),
        getTodayLog(),
        getWorkoutHistory()
      ]);
      setData({ profile, nutrition, workoutHistory });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialUser();
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error && !data.profile) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.error, marginBottom: 16 }}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.primary }]} onPress={fetchData}>
          <Text style={{ color: theme.onPrimary, fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tipOfDay = TIPS[new Date().getDay()];
  const consumedKcal = data.nutrition?.total_calories || 0;
  const targetKcal = data.profile?.daily_calorie_target || 2000;
  const progress = Math.min(consumedKcal / targetKcal, 1);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Namaste,</Text>
          <Text style={[styles.name, { color: theme.heading }]}>{user?.name || 'Athlete'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell-outline" size={28} color={theme.heading} />
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.heading }]}>Today's Progress</Text>
        <View style={styles.ringContainer}>
          <CalorieRing
            calories={consumedKcal}
            target={targetKcal}
            progress={progress}
          />
        </View>
        <View style={styles.macroRow}>
          <MacroCard label="Prot" value={`${data.nutrition?.total_protein || 0}g`} color={theme.success} />
          <MacroCard label="Carb" value={`${data.nutrition?.total_carbs || 0}g`} color={theme.primary} />
          <MacroCard label="Fat" value={`${data.nutrition?.total_fat || 0}g`} color={theme.warning} />
        </View>
      </View>

      <View style={[styles.tipCard, { backgroundColor: theme.secondary + '22', borderColor: theme.secondary }]}>
        <Icon name="lightbulb-on" size={24} color={theme.primary} />
        <View style={styles.tipContent}>
          <Text style={[styles.tipTitle, { color: theme.primary }]}>TIP OF THE DAY</Text>
          <Text style={[styles.tipText, { color: theme.textPrimary }]}>{tipOfDay}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Recent Activity</Text>

        {data.nutrition?.meals?.slice(0, 2).map(meal => (
          <View key={meal.id} style={[styles.activityItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.primary + '22' }]}>
              <Icon name="food" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actTitle, { color: theme.heading }]}>{JSON.parse(meal.detected_foods).join(', ')}</Text>
              <Text style={[styles.actSub, { color: theme.textSecondary }]}>{meal.meal_type}</Text>
            </View>
            <Text style={[styles.actValue, { color: theme.primary }]}>+{meal.total_calories} kcal</Text>
          </View>
        ))}

        {data.workoutHistory?.[0] && (
          <View style={[styles.activityItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.success + '22' }]}>
              <Icon name="dumbbell" size={20} color={theme.success} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actTitle, { color: theme.heading }]}>{data.workoutHistory[0].day_focus}</Text>
              <Text style={[styles.actSub, { color: theme.textSecondary }]}>{new Date(data.workoutHistory[0].logged_date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.actValue, { color: theme.success }]}>{data.workoutHistory[0].completed_sets} Sets</Text>
          </View>
        )}

        {(!data.nutrition?.meals?.length && !data.workoutHistory?.length) && (
            <Text style={[styles.emptyText, { color: theme.muted }]}>No recent activities. Let's get moving!</Text>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  greeting: { fontSize: 16, fontWeight: '500' },
  name: { fontSize: 24, fontWeight: 'bold' },
  card: { margin: 20, padding: 20, borderRadius: 24, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  ringContainer: { alignItems: 'center', marginVertical: 20 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tipCard: { margin: 20, padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  tipContent: { flex: 1, marginLeft: 12 },
  tipTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  tipText: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actTitle: { fontSize: 14, fontWeight: 'bold' },
  actSub: { fontSize: 11, marginTop: 2 },
  actValue: { fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
});

export default HomeScreen;
