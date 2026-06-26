import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { workoutsData, nutritionData } from '../data/mockData';

const { width } = Dimensions.get('window');

const WORKOUT_CATS = ['All', 'HIIT', 'Strength', 'Cardio', 'Mobility'];

const CAT_CONFIG = {
  HIIT:     { icon: 'flame',          color: '#FF5252' },
  Strength: { icon: 'barbell',        color: '#FF9800' },
  Cardio:   { icon: 'heart-circle',   color: '#B8B8D8' },
  Mobility: { icon: 'body',           color: '#4CAF50' },
};

// ─── Workout Card ─────────────────────────────────────────────────────────────
function WorkoutCard({ workout }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CAT_CONFIG[workout.category] || { icon: 'fitness', color: colors.accent };

  return (
    <View style={styles.workoutCard}>
      <View style={[styles.cardTopBar, { backgroundColor: cfg.color }]} />
      <View style={styles.workoutContent}>
        {/* Header */}
        <View style={styles.workoutHeader}>
          <View style={[styles.catIcon, { backgroundColor: `${cfg.color}18` }]}>
            <Ionicons name={cfg.icon} size={20} color={cfg.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutCat}>{workout.category}</Text>
          </View>
          <View style={[styles.diffBadge, { backgroundColor: `${workout.difficultyColor}15` }]}>
            <Text style={[styles.diffText, { color: workout.difficultyColor }]}>{workout.difficulty}</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statChip}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.statChipText}>{workout.duration}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Ionicons name="list-outline" size={13} color={colors.textMuted} />
            <Text style={styles.statChipText}>{workout.exercises} exercises</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Ionicons name="flame-outline" size={13} color={colors.accent} />
            <Text style={[styles.statChipText, { color: colors.accent }]}>{workout.calories} kcal</Text>
          </View>
        </View>

        {/* Expanded detail */}
        {expanded && (
          <View style={styles.expandedBody}>
            <Text style={styles.expandDesc}>{workout.description}</Text>
            <Text style={styles.assignedLabel}>Assigned clients</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {workout.assigned.map((n) => (
                <View key={n} style={styles.assignedChip}>
                  <Text style={styles.assignedChipText}>{n}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.workoutFooter}>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={15} color={colors.accentSecondary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.assignBtn} activeOpacity={0.8}>
            <Ionicons name="person-add-outline" size={15} color={colors.onPrimary} />
            <Text style={styles.assignBtnText}>Assign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(!expanded)}>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={17} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Meal Card ────────────────────────────────────────────────────────────────
function MealCard({ meal }) {
  return (
    <View style={styles.mealCard}>
      {/* Emoji food image */}
      <View style={styles.mealEmoji}>
        <Text style={{ fontSize: 28 }}>{meal.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.mealTop}>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealTime}>{meal.time}</Text>
        </View>
        <View style={styles.macroStrip}>
          <View style={styles.macroPill}>
            <Ionicons name="flame" size={11} color={colors.accent} />
            <Text style={[styles.macroPillText, { color: colors.accent }]}>{meal.calories} kcal</Text>
          </View>
          <View style={styles.macroPill}>
            <Text style={styles.macroPillLabel}>P</Text>
            <Text style={styles.macroPillText}>{meal.protein}g</Text>
          </View>
          <View style={styles.macroPill}>
            <Text style={styles.macroPillLabel}>C</Text>
            <Text style={styles.macroPillText}>{meal.carbs}g</Text>
          </View>
          <View style={styles.macroPill}>
            <Text style={styles.macroPillLabel}>F</Text>
            <Text style={styles.macroPillText}>{meal.fat}g</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab]       = useState('workouts');  // 'workouts' | 'nutrition'
  const [catFilter, setCatFilter] = useState('All');

  const filtered = catFilter === 'All'
    ? workoutsData
    : workoutsData.filter(w => w.category === catFilter);

  const { summary, meals } = nutritionData;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 64 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page tabs */}
      <View style={styles.pageTabs}>
        <TouchableOpacity
          style={[styles.pageTab, tab === 'workouts' && styles.pageTabActive]}
          onPress={() => setTab('workouts')} activeOpacity={0.8}
        >
          <Ionicons name="barbell-outline" size={15} color={tab === 'workouts' ? colors.onPrimary : colors.textSecondary} />
          <Text style={[styles.pageTabText, tab === 'workouts' && styles.pageTabTextActive]}>Workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pageTab, tab === 'nutrition' && styles.pageTabActive]}
          onPress={() => setTab('nutrition')} activeOpacity={0.8}
        >
          <Ionicons name="nutrition-outline" size={15} color={tab === 'nutrition' ? colors.onPrimary : colors.textSecondary} />
          <Text style={[styles.pageTabText, tab === 'nutrition' && styles.pageTabTextActive]}>Nutrition</Text>
        </TouchableOpacity>
      </View>

      {/* ── WORKOUTS TAB ─────────────────────────────────────────────────── */}
      {tab === 'workouts' && (
        <>
          {/* Page header */}
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageTitle}>Workout Library</Text>
              <Text style={styles.pageSubtitle}>{workoutsData.length} programs available</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>

          {/* Category chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {WORKOUT_CATS.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCatFilter(cat)}
                style={[styles.chip, catFilter === cat && styles.chipActive]}
                activeOpacity={0.8}
              >
                {cat !== 'All' && CAT_CONFIG[cat] && (
                  <Ionicons
                    name={CAT_CONFIG[cat].icon}
                    size={13}
                    color={catFilter === cat ? colors.onPrimary : CAT_CONFIG[cat].color}
                  />
                )}
                <Text style={[styles.chipText, catFilter === cat && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Quick stats */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
            {[
              { label: 'Total Programs', value: '24', icon: 'library',   color: colors.accent },
              { label: 'Active Plans',   value: '18', icon: 'checkmark-circle', color: colors.statusActive },
              { label: 'Avg Duration',   value: '46 min', icon: 'time',  color: colors.accentSecondary },
            ].map((s) => (
              <View key={s.label} style={styles.quickStat}>
                <View style={[styles.quickStatIcon, { backgroundColor: `${s.color}15` }]}>
                  <Ionicons name={s.icon} size={17} color={s.color} />
                </View>
                <Text style={styles.quickStatValue}>{s.value}</Text>
                <Text style={styles.quickStatLabel}>{s.label}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={{ gap: 14 }}>
            {filtered.map((w) => <WorkoutCard key={w.id} workout={w} />)}
          </View>
        </>
      )}

      {/* ── NUTRITION TAB ─────────────────────────────────────────────────── */}
      {tab === 'nutrition' && (
        <>
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageTitle}>Nutrition Logs</Text>
              <Text style={styles.pageSubtitle}>Daily meal tracking</Text>
            </View>
          </View>

          {/* Summary cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
            {[
              { label: 'Daily Calories',   value: `${summary.dailyCalories} kcal`,  icon: 'flame',         color: colors.accent },
              { label: 'Weekly Calories',  value: `${summary.weeklyCalories} kcal`, icon: 'calendar',      color: colors.accentSecondary },
              { label: 'Protein Intake',   value: `${summary.proteinIntake}g`,       icon: 'barbell',       color: colors.statusActive },
              { label: 'Compliance',       value: `${summary.complianceRate}%`,      icon: 'checkmark-circle', color: '#FF9800' },
            ].map((s) => (
              <View key={s.label} style={[styles.quickStat, { minWidth: 140 }]}>
                <View style={[styles.quickStatIcon, { backgroundColor: `${s.color}15` }]}>
                  <Ionicons name={s.icon} size={18} color={s.color} />
                </View>
                <Text style={[styles.quickStatValue, { fontSize: 19 }]}>{s.value}</Text>
                <Text style={styles.quickStatLabel}>{s.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Meal cards */}
          <Text style={styles.sectionLabel}>Today's Meals</Text>
          <View style={{ gap: 12 }}>
            {meals.map((meal) => <MealCard key={meal.id} meal={meal} />)}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },

  // Page tabs
  pageTabs:         { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, padding: 4, marginTop: 14, marginBottom: 18, borderWidth: 1, borderColor: colors.border },
  pageTab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11 },
  pageTabActive:    { backgroundColor: colors.accent },
  pageTabText:      { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  pageTabTextActive:{ color: colors.onPrimary, fontWeight: '700' },

  // Page header
  pageHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle:   { fontSize: 22, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  pageSubtitle:{ fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  addBtn:      { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },

  // Filter chips
  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: colors.surfaceContainerHigh, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  chipActive:       { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText:         { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive:   { color: colors.onPrimary, fontWeight: '700' },

  // Quick stats
  quickStat:      { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginRight: 12, minWidth: 120, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  quickStatIcon:  { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickStatValue: { fontSize: 20, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  quickStatLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', marginTop: 3 },

  // Workout card
  workoutCard:    { backgroundColor: colors.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  cardTopBar:     { height: 3 },
  workoutContent: { padding: 18 },
  workoutHeader:  { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  catIcon:        { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  workoutName:    { fontSize: 17, fontWeight: '700', color: colors.heading, marginBottom: 2 },
  workoutCat:     { fontSize: 11, color: colors.textMuted, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },
  diffBadge:      { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  diffText:       { fontSize: 11, fontWeight: '700' },

  statsStrip:   { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  statChip:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  statChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  statDivider:  { width: 1, height: 14, backgroundColor: colors.border },

  expandedBody:  { paddingTop: 4, paddingBottom: 12 },
  expandDesc:    { fontSize: 13, color: colors.textBody, lineHeight: 20, marginBottom: 12 },
  assignedLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  assignedChip:  { backgroundColor: colors.accentDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  assignedChipText: { fontSize: 12, fontWeight: '600', color: colors.accent },

  workoutFooter: { flexDirection: 'row', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  editBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.border },
  editBtnText:   { fontSize: 13, fontWeight: '600', color: colors.accentSecondary },
  assignBtn:     { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.accent },
  assignBtnText: { fontSize: 13, fontWeight: '700', color: colors.onPrimary },
  expandBtn:     { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },

  // Meal card
  mealCard:      { backgroundColor: colors.surface, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 14, borderWidth: 1, borderColor: colors.border },
  mealEmoji:     { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  mealTop:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mealName:      { fontSize: 15, fontWeight: '700', color: colors.heading },
  mealTime:      { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  macroStrip:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  macroPill:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, borderWidth: 1, borderColor: colors.border },
  macroPillLabel:{ fontSize: 10, fontWeight: '800', color: colors.textMuted },
  macroPillText: { fontSize: 11, fontWeight: '700', color: colors.textBody },

  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.heading, marginBottom: 12 },
});
