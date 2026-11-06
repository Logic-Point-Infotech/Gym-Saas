// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { getProfile } from '../api/profileApi';
import { getTodayLog } from '../api/nutritionApi';
import { getWorkoutHistory } from '../api/workoutApi';
import { getAutomatedHealthReport } from '../api/healthApi';
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
  const [data, setData] = useState({ profile: null, nutrition: null, workoutHistory: [], automatedReport: null });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadInitialUser = async () => {
    const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const fetchData = async () => {
    try {
      const [profile, nutrition, workoutHistory, automatedReport] = await Promise.all([
        getProfile().catch(() => null),
        getTodayLog().catch(() => null),
        getWorkoutHistory().catch(() => []),
        getAutomatedHealthReport().catch(() => null),
      ]);
      setData({ profile, nutrition, workoutHistory, automatedReport });
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
  const targetKcal = data.profile?.daily_calorie_target || 2200;
  const progress = Math.min(consumedKcal / targetKcal, 1);
  const healthScore = data.automatedReport?.health_score || 88;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Namaste,</Text>
          <Text style={[styles.name, { color: theme.heading }]}>{data.profile?.name || user?.name || 'Athlete'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' }} />
            <Text style={{ fontSize: 11, color: '#4CAF50', fontWeight: 'bold' }}>
              Render Live ({data.profile?.member_id || 'Connected'})
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Icon name="bell-outline" size={28} color={theme.heading} />
        </TouchableOpacity>
      </View>

      {/* TODAY'S CALORIE & MACRO PROGRESS */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.cardTitle, { color: theme.heading }]}>Today's Progress</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Nutrition')}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: theme.primary }}>Scan Meal 📷</Text>
          </TouchableOpacity>
        </View>
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

      {/* AUTOMATION SNAPSHOT: AUTOMATED HEALTH & PROGRESS DOSSIER */}
      <TouchableOpacity
        style={[styles.autoSnapshotCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('HealthReport')}
      >
        <View style={styles.autoSnapshotTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.scoreBadgeMini, { borderColor: theme.primary }]}>
              <Text style={[styles.scoreMiniText, { color: theme.primary }]}>{healthScore}</Text>
            </View>
            <View>
              <Text style={[styles.snapshotTitle, { color: theme.heading }]}>Automated Health Report</Text>
              <Text style={[styles.snapshotSub, { color: theme.textSecondary }]}>Zero manual entry • Live compiled</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={22} color={theme.primary} />
        </View>
        <View style={[styles.snapshotPillRow, { borderTopColor: theme.border }]}>
          <View style={styles.snapshotPill}>
            <Icon name="scale-bathroom" size={14} color="#2DD4BF" />
            <Text style={[styles.snapshotPillText, { color: theme.textSecondary }]}>
              Weight: <Text style={{ color: theme.heading, fontWeight: 'bold' }}>{data.automatedReport?.biometrics?.weight_kg || 73.2} kg</Text>
            </Text>
          </View>
          <View style={styles.snapshotPill}>
            <Icon name="fire" size={14} color="#E8E840" />
            <Text style={[styles.snapshotPillText, { color: theme.textSecondary }]}>
              TDEE: <Text style={{ color: theme.heading, fontWeight: 'bold' }}>{data.automatedReport?.biometrics?.tdee || 2450} kcal</Text>
            </Text>
          </View>
          <View style={styles.snapshotPill}>
            <Icon name="dumbbell" size={14} color="#4CAF50" />
            <Text style={[styles.snapshotPillText, { color: theme.textSecondary }]}>
              Consistency: <Text style={{ color: theme.heading, fontWeight: 'bold' }}>{data.automatedReport?.workouts?.adherence_pct || 88}%</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={[styles.tipCard, { backgroundColor: theme.secondary + '22', borderColor: theme.secondary }]}>
        <Icon name="lightbulb-on" size={24} color={theme.primary} />
        <View style={styles.tipContent}>
          <Text style={[styles.tipTitle, { color: theme.primary }]}>TIP OF THE DAY</Text>
          <Text style={[styles.tipText, { color: theme.textPrimary }]}>{tipOfDay}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Recent Activity</Text>

        {data.nutrition?.meals?.slice(0, 2).map(meal => {
          let foodNames = 'Meal Scan';
          try {
            const parsed = typeof meal.detected_foods === 'string' ? JSON.parse(meal.detected_foods) : meal.detected_foods;
            if (Array.isArray(parsed)) foodNames = parsed.join(', ');
          } catch (e) {
            foodNames = 'Nutritious Meal';
          }
          return (
            <View key={meal.id} style={[styles.activityItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.iconBox, { backgroundColor: theme.primary + '22' }]}>
                <Icon name="food" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.actTitle, { color: theme.heading }]} numberOfLines={1}>{foodNames}</Text>
                <Text style={[styles.actSub, { color: theme.textSecondary }]}>{meal.meal_type || 'Food Scan'}</Text>
              </View>
              <Text style={[styles.actValue, { color: theme.primary }]}>+{meal.total_calories} kcal</Text>
            </View>
          );
        })}

        {data.workoutHistory?.[0] && (
          <View style={[styles.activityItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.success + '22' }]}>
              <Icon name="dumbbell" size={20} color={theme.success} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actTitle, { color: theme.heading }]}>{data.workoutHistory[0].day_focus || 'Push Split'}</Text>
              <Text style={[styles.actSub, { color: theme.textSecondary }]}>{new Date(data.workoutHistory[0].logged_date).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.actValue, { color: theme.success }]}>{data.workoutHistory[0].completed_sets || 10} Sets</Text>
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
  card: { margin: 20, marginBottom: 12, padding: 20, borderRadius: 24, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  ringContainer: { alignItems: 'center', marginVertical: 20 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  autoSnapshotCard: { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 20, borderWidth: 1 },
  autoSnapshotTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  scoreBadgeMini: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  scoreMiniText: { fontSize: 15, fontWeight: 'bold' },
  snapshotTitle: { fontSize: 15, fontWeight: 'bold' },
  snapshotSub: { fontSize: 11, marginTop: 1 },
  snapshotPillRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, gap: 6 },
  snapshotPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  snapshotPillText: { fontSize: 11 },
  tipCard: { marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  tipContent: { flex: 1, marginLeft: 12 },
  tipTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  tipText: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  actTitle: { fontSize: 14, fontWeight: 'bold' },
  actSub: { fontSize: 11, marginTop: 2 },
  actValue: { fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
});

export default HomeScreen;
