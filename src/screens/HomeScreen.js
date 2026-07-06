// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';
import { MOCK_USER, MOCK_TASKS, MOCK_COACH_RECOMMENDATION } from '../utils/mockData';
import CalorieRing from '../components/CalorieRing';
import MacroCard from '../components/MacroCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Icon name="menu" size={24} color={theme.primary} />
          <Text style={[styles.appTitle, { color: theme.heading }]}>MacroMate</Text>
          <TouchableOpacity onPress={toggleTheme} style={[styles.avatar, { backgroundColor: theme.surface }]}>
            <Icon name={theme.mode === 'light' ? "weather-night" : "white-balance-sunny"} size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greetingText, { color: theme.heading }]}>Namaste, {MOCK_USER.name.split(' ')[0]} 👋</Text>
          <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>Your health journey is in sync with Coach Uday.</Text>
        </View>

        {/* RESTORED: Main Calorie & Macro Progress Card */}
        <View style={[styles.mainProgressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.heading }]}>Today's Progress</Text>
          <View style={styles.ringContainer}>
            <CalorieRing calories={1350} target={2200} progress={1350/2200} />
          </View>
          <View style={styles.macroRow}>
            <MacroCard label="Protein" value="81g" color={theme.success} />
            <MacroCard label="Carbs" value="168g" color={theme.primary} />
            <MacroCard label="Fat" value="42g" color={theme.warning} />
          </View>
        </View>

        {/* NEW: Coach Recommendation Card */}
        <View style={[styles.recommendationCard, { backgroundColor: theme.primary + '1A', borderColor: theme.primary + '33' }]}>
          <View style={styles.recHeader}>
            <View style={[styles.recIconBox, { backgroundColor: theme.primary }]}>
              <Icon name="lightning-bolt" size={20} color={theme.onPrimary} />
            </View>
            <View style={styles.recTitleGroup}>
              <Text style={[styles.recLabel, { color: theme.primary }]}>COACH'S QUICK ACTION</Text>
              <Text style={[styles.recTitle, { color: theme.heading }]}>{MOCK_COACH_RECOMMENDATION.title}</Text>
            </View>
          </View>
          <Text style={[styles.recContent, { color: theme.textPrimary }]}>{MOCK_COACH_RECOMMENDATION.content}</Text>
          <View style={styles.recFooter}>
            <Text style={[styles.recTime, { color: theme.textSecondary }]}>{MOCK_COACH_RECOMMENDATION.timestamp}</Text>
            <TouchableOpacity><Text style={[styles.recLink, { color: theme.primary }]}>Accept Action</Text></TouchableOpacity>
          </View>
        </View>

        {/* Bento Grid */}
        <View style={styles.bentoGrid}>
          {/* Upcoming Tasks */}
          <View style={[styles.bentoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.bentoHeader}>
              <Text style={[styles.bentoTitle, { color: theme.heading }]}>Tasks</Text>
              <View style={[styles.taskCount, { backgroundColor: theme.primary }]}>
                <Text style={[styles.taskCountText, { color: theme.onPrimary }]}>{MOCK_TASKS.filter(t => !t.completed).length}</Text>
              </View>
            </View>
            <View style={styles.taskList}>
              {MOCK_TASKS.slice(0, 2).map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <Icon
                    name={task.completed ? "check-circle" : "circle-outline"}
                    size={14}
                    color={task.completed ? theme.success : theme.textSecondary}
                  />
                  <Text numberOfLines={1} style={[styles.taskText, { color: task.completed ? theme.textSecondary : theme.textPrimary }]}>
                    {task.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Workout Link */}
          <TouchableOpacity
            style={[styles.bentoCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => navigation.navigate('WorkoutDetail')}
          >
            <View style={styles.bentoHeader}>
              <Text style={[styles.bentoTitle, { color: theme.heading }]}>Workout</Text>
              <Icon name="dumbbell" size={16} color={theme.primary} />
            </View>
            <Text style={[styles.workoutLinkTitle, { color: theme.primary }]}>Leg Day</Text>
            <Text style={[styles.workoutLinkSub, { color: theme.textSecondary }]}>6:00 PM</Text>
          </TouchableOpacity>
        </View>

        {/* Membership Renewal Alert */}
        <View style={[styles.renewalAlert, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Icon name="alert-decagram" size={24} color={theme.warning} />
          <View style={styles.renewalInfo}>
            <Text style={[styles.renewalTitle, { color: theme.heading }]}>Membership Renewal</Text>
            <Text style={[styles.renewalDate, { color: theme.textSecondary }]}>Expires on {MOCK_USER.expiryDate}</Text>
          </View>
          <TouchableOpacity style={[styles.renewBtn, { backgroundColor: theme.primary }]}>
            <Text style={[styles.renewBtnText, { color: theme.onPrimary }]}>RENEW</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appTitle: { ...FONTS.title, fontWeight: 'bold', flex: 1, marginLeft: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SIZES.padding },
  greetingSection: { marginBottom: 24 },
  greetingText: { ...FONTS.headlineMobile },
  greetingSub: { ...FONTS.bodySmall, marginTop: 4 },
  mainProgressCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 24 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  ringContainer: { alignItems: 'center', marginVertical: 10 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  recommendationCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
  recHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 12 },
  recIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  recTitleGroup: { flex: 1 },
  recLabel: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  recTitle: { fontSize: 16, fontWeight: 'bold' },
  recContent: { fontSize: 13, lineHeight: 20, marginBottom: 15 },
  recFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  recTime: { fontSize: 10 },
  recLink: { fontSize: 12, fontWeight: 'bold' },
  bentoGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  bentoCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1, height: 110, justifyContent: 'space-between' },
  bentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bentoTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8 },
  taskCount: { width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  taskCountText: { fontSize: 9, fontWeight: 'bold' },
  taskList: { gap: 6 },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  taskText: { fontSize: 11, flex: 1 },
  workoutLinkTitle: { fontSize: 16, fontWeight: 'bold' },
  workoutLinkSub: { fontSize: 10 },
  renewalAlert: { padding: 16, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  renewalInfo: { flex: 1 },
  renewalTitle: { fontSize: 14, fontWeight: 'bold' },
  renewalDate: { fontSize: 10, marginTop: 2 },
  renewBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  renewBtnText: { fontSize: 11, fontWeight: 'bold' },
});

export default HomeScreen;
