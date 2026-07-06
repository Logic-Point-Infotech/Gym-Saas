// src/screens/WorkoutScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';
import { MOCK_WORKOUT_PLAN } from '../utils/mockData';
import ExerciseItem from '../components/ExerciseItem';

const WorkoutScreen = () => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Workout Plan</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Stick to your routine and stay fit</Text>
      </View>

      {MOCK_WORKOUT_PLAN.map((dayPlan, index) => (
        <View key={index} style={styles.daySection}>
          <View style={styles.dayHeader}>
            <Text style={[styles.dayText, { color: theme.primary }]}>{dayPlan.day}</Text>
            <View style={[styles.badge, { backgroundColor: theme.muted }]}>
              <Text style={[styles.badgeText, { color: theme.textSecondary }]}>{dayPlan.focus}</Text>
            </View>
          </View>

          <View style={[styles.exercisesCard, { backgroundColor: theme.surface, borderColor: theme.border, ...theme.cardShadow }]}>
            {dayPlan.exercises.map((exercise) => (
              <ExerciseItem key={exercise.id} exercise={exercise} />
            ))}
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.m, paddingTop: 60, marginBottom: SPACING.s },
  title: { ...FONTS.h1 },
  subtitle: { ...FONTS.body, marginTop: 4 },
  daySection: { marginBottom: SPACING.l },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s
  },
  dayText: { ...FONTS.h2 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { ...FONTS.caption, fontWeight: 'bold' },
  exercisesCard: {
    marginHorizontal: SPACING.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    overflow: 'hidden'
  }
});

export default WorkoutScreen;
