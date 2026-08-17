import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { workoutsData, nutritionData } from '../data/mockData';
import { nutritionApi, usersApi, aiApi, workoutsApi } from '../services/api';
import { Toast, ActionModal, FormInput, ConfirmDialog } from '../components/UIKit';

const { width } = Dimensions.get('window');

const WORKOUT_CATS = ['All', 'HIIT', 'Strength', 'Cardio', 'Mobility'];

const CAT_CONFIG = {
  HIIT:     { icon: 'flame',          color: '#FF5252' },
  Strength: { icon: 'barbell',        color: '#FF9800' },
  Cardio:   { icon: 'heart-circle',   color: '#B8B8D8' },
  Mobility: { icon: 'body',           color: '#4CAF50' },
};

// ─── Workout Card ─────────────────────────────────────────────────────────────
function WorkoutCard({ workout, onAssign, onEdit }) {
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
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8} onPress={() => onEdit(workout)}>
            <Ionicons name="create-outline" size={15} color={colors.accentSecondary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.assignBtn} activeOpacity={0.8} onPress={() => onAssign(workout)}>
            <Ionicons name="person-add-outline" size={15} color={colors.onPrimary} />
            <Text style={styles.assignBtnText}>Assign Client</Text>
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
function MealCard({ meal, onDelete }) {
  const isApiMeal = !!meal.detected_food;
  const name      = isApiMeal ? meal.detected_food : meal.name;
  const kcal      = meal.calories;
  const protein   = meal.protein;
  const emoji     = meal.emoji || '🍽️';
  const time      = isApiMeal
    ? new Date(meal.logged_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : meal.time;

  return (
    <View style={styles.mealCard}>
      <View style={styles.mealEmoji}>
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.mealTop}>
          <Text style={styles.mealName}>{name}</Text>
          <Text style={styles.mealTime}>{time}</Text>
        </View>
        <View style={styles.macroStrip}>
          <View style={styles.macroPill}>
            <Ionicons name="flame" size={11} color={colors.accent} />
            <Text style={[styles.macroPillText, { color: colors.accent }]}>{kcal} kcal</Text>
          </View>
          <View style={styles.macroPill}>
            <Text style={styles.macroPillLabel}>P</Text>
            <Text style={styles.macroPillText}>{protein}g</Text>
          </View>
          {meal.carbs != null && (
            <View style={styles.macroPill}>
              <Text style={styles.macroPillLabel}>C</Text>
              <Text style={styles.macroPillText}>{meal.carbs}g</Text>
            </View>
          )}
          {meal.fat != null && (
            <View style={styles.macroPill}>
              <Text style={styles.macroPillLabel}>F</Text>
              <Text style={styles.macroPillText}>{meal.fat}g</Text>
            </View>
          )}
        </View>
      </View>
      {isApiMeal && onDelete && (
        <TouchableOpacity onPress={() => onDelete(meal)} style={styles.mealDeleteBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab]           = useState('workouts');
  const [catFilter, setCatFilter] = useState('All');

  // Nutrition state
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Log Meal modal
  const [logMealModal, setLogMealModal] = useState(false);
  const [mealForm, setMealForm] = useState({ detected_food: '', calories: '', protein: '', client_id: '1' });
  const [mealLoading, setMealLoading] = useState(false);

  // Assign workout modal
  const [assignModal, setAssignModal]   = useState(false);
  const [assignWorkout, setAssignWorkout] = useState(null);
  const [clients, setClients]           = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  // Edit workout modal
  const [editModal, setEditModal] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);

  // Delete nutrition confirm
  const [deleteNutDialog, setDeleteNutDialog] = useState(false);
  const [deleteNutTarget, setDeleteNutTarget] = useState(null);
  const [deleteNutLoading, setDeleteNutLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  // Live Workouts from DB
  const [liveWorkouts, setLiveWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);

  // AI Nutrition Analyzer
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiNutritionResult, setAiNutritionResult] = useState(null);

  // Use live workouts when available, fallback to mock
  const sourceWorkouts = liveWorkouts.length > 0 ? liveWorkouts : workoutsData;
  const filtered = catFilter === 'All' ? sourceWorkouts : sourceWorkouts.filter(w => w.category === catFilter);
  const { summary } = nutritionData;

  // ─── Fetch live workouts from DB ────────────────────────────────────────────
  const fetchWorkouts = useCallback(async () => {
    setWorkoutsLoading(true);
    try {
      const res = await workoutsApi.getAll();
      if (res.data && res.data.length > 0) {
        // Normalise DB workout to match WorkoutCard expectations
        const normalised = res.data.map(w => ({
          ...w,
          exercises:       Array.isArray(w.exercises) ? w.exercises.length : w.exercises,
          difficultyColor: w.difficulty === 'Advanced' ? '#F44336' : w.difficulty === 'Beginner' ? '#4CAF50' : '#FF9800',
          assigned:        (w.assignments || []).map(a => a.client?.name || 'Unknown'),
        }));
        setLiveWorkouts(normalised);
      }
    } catch (e) {
      // Silently fall back to mock data
    } finally {
      setWorkoutsLoading(false);
    }
  }, []);

  // ─── Fetch nutrition logs from backend ──────────────────────────────────────
  const fetchNutrition = useCallback(async () => {
    setNutritionLoading(true);
    try {
      const res = await nutritionApi.getAll();
      setNutritionLogs(res.data || []);
    } catch (e) {
      showToast('Failed to load nutrition data', 'error');
    } finally {
      setNutritionLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ─── Fetch clients for assign modal ────────────────────────────────────────
  const fetchClients = useCallback(async () => {
    try {
      const res = await usersApi.getAll();
      setClients(res.data || []);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (tab === 'nutrition') fetchNutrition();
  }, [tab]);

  useEffect(() => { fetchClients(); fetchWorkouts(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchNutrition(); };

  // ─── Log Meal ───────────────────────────────────────────────────────────────
  const handleLogMeal = async () => {
    if (!mealForm.detected_food.trim() || !mealForm.calories || !mealForm.protein) {
      showToast('Food name, calories and protein are required', 'error'); return;
    }
    setMealLoading(true);
    try {
      await nutritionApi.log({
        client_id:     parseInt(mealForm.client_id) || 1,
        detected_food: mealForm.detected_food.trim(),
        calories:      parseFloat(mealForm.calories),
        protein:       parseFloat(mealForm.protein),
      });
      showToast('Meal logged successfully!');
      setLogMealModal(false);
      setMealForm({ detected_food: '', calories: '', protein: '', client_id: '1' });
      fetchNutrition();
    } catch (e) {
      showToast(e.message || 'Failed to log meal', 'error');
    } finally {
      setMealLoading(false);
    }
  };

  // ─── AI Nutrition Analyze ───────────────────────────────────────────────────
  const handleAINutritionAnalyze = async () => {
    if (!mealForm.detected_food.trim()) {
      showToast('Enter a food description first', 'error'); return;
    }
    setAiAnalyzing(true);
    setAiNutritionResult(null);
    try {
      const res = await aiApi.nutritionAnalyze(mealForm.detected_food.trim());
      setAiNutritionResult(res);
      // Auto-fill the form fields
      setMealForm(p => ({
        ...p,
        detected_food: res.meal_name || p.detected_food,
        calories: String(res.calories || ''),
        protein:  String(res.protein  || ''),
      }));
    } catch (e) {
      showToast('AI analysis failed: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setAiAnalyzing(false);
    }
  };

  // ─── Delete Nutrition Log ───────────────────────────────────────────────────
  const handleDeleteNutrition = async () => {
    setDeleteNutLoading(true);
    try {
      await nutritionApi.delete(deleteNutTarget.id);
      showToast('Meal log deleted');
      setDeleteNutDialog(false);
      fetchNutrition();
    } catch (e) {
      showToast(e.message || 'Delete failed', 'error');
    } finally {
      setDeleteNutLoading(false);
    }
  };

  // ─── Assign Workout (logs allocation note) ──────────────────────────────────
  const handleAssignWorkout = async () => {
    if (!selectedClientId) {
      showToast('Please select a client', 'error'); return;
    }
    setAssignLoading(true);
    try {
      // Log a nutrition placeholder as the assignment record (matches existing backend model)
      await nutritionApi.log({
        client_id:     parseInt(selectedClientId),
        detected_food: `[Workout Assigned] ${assignWorkout.name}`,
        calories:      assignWorkout.calories,
        protein:       0,
      });
      showToast(`"${assignWorkout.name}" assigned!`);
      setAssignModal(false);
      setSelectedClientId(null);
    } catch (e) {
      showToast(e.message || 'Assignment failed', 'error');
    } finally {
      setAssignLoading(false);
    }
  };

  const allLogs = tab === 'nutrition' ? nutritionLogs : [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 64 }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          tab === 'nutrition'
            ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
            : undefined
        }
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
            onPress={() => { setTab('nutrition'); }}
            activeOpacity={0.8}
          >
            <Ionicons name="nutrition-outline" size={15} color={tab === 'nutrition' ? colors.onPrimary : colors.textSecondary} />
            <Text style={[styles.pageTabText, tab === 'nutrition' && styles.pageTabTextActive]}>Nutrition</Text>
          </TouchableOpacity>
        </View>

        {/* ── WORKOUTS TAB ─────────────────────────────────────────────────── */}
        {tab === 'workouts' && (
          <>
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.pageTitle}>Workout Library</Text>
                <Text style={styles.pageSubtitle}>
                  {workoutsLoading ? 'Loading…' : `${filtered.length} programs${liveWorkouts.length > 0 ? ' (live)' : ' (demo)'}`}
                </Text>
              </View>
              <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={fetchWorkouts}>
                {workoutsLoading
                  ? <ActivityIndicator size="small" color={colors.onPrimary} />
                  : <Ionicons name="refresh" size={20} color={colors.onPrimary} />}
              </TouchableOpacity>
            </View>

            {/* Category chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {WORKOUT_CATS.map((cat) => (
                <TouchableOpacity
                  key={cat} onPress={() => setCatFilter(cat)}
                  style={[styles.chip, catFilter === cat && styles.chipActive]}
                  activeOpacity={0.8}
                >
                  {cat !== 'All' && CAT_CONFIG[cat] && (
                    <Ionicons name={CAT_CONFIG[cat].icon} size={13}
                      color={catFilter === cat ? colors.onPrimary : CAT_CONFIG[cat].color} />
                  )}
                  <Text style={[styles.chipText, catFilter === cat && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Quick stats */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
              {[
                { label: 'Total Programs', value: '24',     icon: 'library',          color: colors.accent },
                { label: 'Active Plans',   value: '18',     icon: 'checkmark-circle', color: colors.statusActive },
                { label: 'Avg Duration',   value: '46 min', icon: 'time',             color: colors.accentSecondary },
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
              {filtered.map((w) => (
                <WorkoutCard
                  key={w.id} workout={w}
                  onAssign={(wk) => { setAssignWorkout(wk); setAssignModal(true); }}
                  onEdit={(wk) => { setEditWorkout(wk); setEditModal(true); }}
                />
              ))}
            </View>
          </>
        )}

        {/* ── NUTRITION TAB ─────────────────────────────────────────────────── */}
        {tab === 'nutrition' && (
          <>
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.pageTitle}>Nutrition Logs</Text>
                <Text style={styles.pageSubtitle}>
                  {allLogs.length} entries from backend
                </Text>
              </View>
              <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={() => setLogMealModal(true)}>
                <Ionicons name="add" size={20} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>

            {/* Summary cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
              {[
                { label: 'Daily Calories',  value: `${summary.dailyCalories} kcal`,  icon: 'flame',            color: colors.accent },
                { label: 'Weekly Calories', value: `${summary.weeklyCalories} kcal`, icon: 'calendar',         color: colors.accentSecondary },
                { label: 'Protein Intake',  value: `${summary.proteinIntake}g`,       icon: 'barbell',          color: colors.statusActive },
                { label: 'DB Logs',         value: String(allLogs.length),            icon: 'server-outline',   color: '#FF9800' },
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

            {/* Backend logs */}
            {allLogs.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Backend Logs</Text>
                <View style={{ gap: 12, marginBottom: 18 }}>
                  {nutritionLoading
                    ? <ActivityIndicator size="small" color={colors.accent} style={{ marginVertical: 20 }} />
                    : allLogs.slice(0, 20).map((log) => (
                        <MealCard
                          key={log.id} meal={log}
                          onDelete={(m) => { setDeleteNutTarget(m); setDeleteNutDialog(true); }}
                        />
                      ))
                  }
                </View>
              </>
            )}

            {/* Mock meals */}
            <Text style={styles.sectionLabel}>Today's Sample Meals</Text>
            <View style={{ gap: 12 }}>
              {nutritionData.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Log Meal Modal ───────────────────────────────────────────────── */}
      <ActionModal
        visible={logMealModal}
        title="Log a Meal"
        onClose={() => { setLogMealModal(false); setAiNutritionResult(null); }}
        onSubmit={handleLogMeal}
        loading={mealLoading}
      >
        <FormInput label="Food Description" value={mealForm.detected_food} onChangeText={(v) => setMealForm(p => ({ ...p, detected_food: v }))} placeholder="e.g. 2 eggs scrambled with toast and butter" />

        {/* AI Analyze Button */}
        <TouchableOpacity
          style={styles.aiAnalyzeBtn}
          onPress={handleAINutritionAnalyze}
          activeOpacity={0.8}
          disabled={aiAnalyzing}
        >
          {aiAnalyzing
            ? <ActivityIndicator size="small" color={colors.onPrimary} />
            : <Ionicons name="sparkles" size={16} color={colors.onPrimary} />}
          <Text style={styles.aiAnalyzeBtnText}>
            {aiAnalyzing ? 'Analyzing…' : 'Analyze with AI'}
          </Text>
        </TouchableOpacity>

        {/* AI Result Card */}
        {aiNutritionResult && (
          <LinearGradient
            colors={['#1A1A08', '#111118']}
            style={styles.aiResultCard}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Ionicons name="sparkles" size={14} color={colors.accent} />
              <Text style={styles.aiResultTitle}>AI Analysis</Text>
              {aiNutritionResult.health_score && (
                <View style={styles.healthScorePill}>
                  <Text style={styles.healthScoreText}>Score: {aiNutritionResult.health_score}/10</Text>
                </View>
              )}
            </View>
            <View style={styles.macroGrid}>
              {[
                { label: 'Calories', value: aiNutritionResult.calories, unit: 'kcal', color: colors.accent },
                { label: 'Protein',  value: aiNutritionResult.protein,  unit: 'g',    color: '#4CAF50' },
                { label: 'Carbs',    value: aiNutritionResult.carbs,    unit: 'g',    color: '#FF9800' },
                { label: 'Fats',     value: aiNutritionResult.fats,     unit: 'g',    color: '#B8B8D8' },
              ].map(m => (
                <View key={m.label} style={styles.macroGridItem}>
                  <Text style={[styles.macroGridValue, { color: m.color }]}>{m.value}{m.unit}</Text>
                  <Text style={styles.macroGridLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
            {aiNutritionResult.tips?.length > 0 && (
              <Text style={styles.aiTip}>• {aiNutritionResult.tips[0]}</Text>
            )}
          </LinearGradient>
        )}

        <FormInput label="Calories (kcal)" value={mealForm.calories} onChangeText={(v) => setMealForm(p => ({ ...p, calories: v }))} placeholder="e.g. 480" keyboardType="numeric" />
        <FormInput label="Protein (g)" value={mealForm.protein} onChangeText={(v) => setMealForm(p => ({ ...p, protein: v }))} placeholder="e.g. 52" keyboardType="numeric" />
        <FormInput label="Client ID" value={mealForm.client_id} onChangeText={(v) => setMealForm(p => ({ ...p, client_id: v }))} placeholder="1" keyboardType="numeric" />
      </ActionModal>

      {/* ── Assign Workout Modal ─────────────────────────────────────────── */}
      <ActionModal
        visible={assignModal}
        title={`Assign: ${assignWorkout?.name}`}
        onClose={() => { setAssignModal(false); setSelectedClientId(null); }}
        onSubmit={handleAssignWorkout}
        loading={assignLoading}
      >
        <Text style={styles.assignLabel}>Select a client to assign this workout to:</Text>
        <View style={{ gap: 8 }}>
          {clients.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setSelectedClientId(c.id)}
              style={[styles.clientSelectRow, selectedClientId === c.id && styles.clientSelectRowActive]}
            >
              <View style={styles.clientSelectDot}>
                <Text style={styles.clientSelectLetter}>{c.name?.[0]?.toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientSelectName}>{c.name}</Text>
                <Text style={styles.clientSelectEmail}>{c.email}</Text>
              </View>
              {selectedClientId === c.id && <Ionicons name="checkmark-circle" size={20} color={colors.accent} />}
            </TouchableOpacity>
          ))}
          {clients.length === 0 && <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 20 }}>No clients found in DB. Add clients first.</Text>}
        </View>
      </ActionModal>

      {/* ── Edit Workout Modal ───────────────────────────────────────────── */}
      <ActionModal
        visible={editModal}
        title={`Edit: ${editWorkout?.name}`}
        onClose={() => setEditModal(false)}
        onSubmit={() => { showToast('Workout updated! (mock)'); setEditModal(false); }}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 20 }}>
          Editing workout details. In production this would update the workout database.
        </Text>
        <View style={{ marginTop: 12 }}>
          <FormInput label="Workout Name" value={editWorkout?.name || ''} onChangeText={() => {}} placeholder="Workout name" />
          <FormInput label="Duration" value={editWorkout?.duration || ''} onChangeText={() => {}} placeholder="e.g. 45 min" />
        </View>
      </ActionModal>

      {/* ── Delete Nutrition Confirm ─────────────────────────────────────── */}
      <ConfirmDialog
        visible={deleteNutDialog}
        title="Delete Meal Log?"
        message={`Remove "${deleteNutTarget?.detected_food}" from nutrition logs?`}
        onConfirm={handleDeleteNutrition}
        onCancel={() => { setDeleteNutDialog(false); setDeleteNutTarget(null); }}
        loading={deleteNutLoading}
      />

      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },

  pageTabs:          { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, padding: 4, marginTop: 14, marginBottom: 18, borderWidth: 1, borderColor: colors.border },
  pageTab:           { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11 },
  pageTabActive:     { backgroundColor: colors.accent },
  pageTabText:       { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  pageTabTextActive: { color: colors.onPrimary, fontWeight: '700' },

  pageHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle:    { fontSize: 22, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  pageSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  addBtn:       { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },

  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: colors.surfaceContainerHigh, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  chipActive:       { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText:         { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive:   { color: colors.onPrimary, fontWeight: '700' },

  quickStat:      { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginRight: 12, minWidth: 120, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  quickStatIcon:  { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickStatValue: { fontSize: 20, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  quickStatLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', marginTop: 3 },

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

  expandedBody:     { paddingTop: 4, paddingBottom: 12 },
  expandDesc:       { fontSize: 13, color: colors.textBody, lineHeight: 20, marginBottom: 12 },
  assignedLabel:    { fontSize: 11, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  assignedChip:     { backgroundColor: colors.accentDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  assignedChipText: { fontSize: 12, fontWeight: '600', color: colors.accent },

  workoutFooter: { flexDirection: 'row', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  editBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.border },
  editBtnText:   { fontSize: 13, fontWeight: '600', color: colors.accentSecondary },
  assignBtn:     { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.accent },
  assignBtnText: { fontSize: 13, fontWeight: '700', color: colors.onPrimary },
  expandBtn:     { width: 40, height: 40, borderRadius: 11, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },

  mealCard:       { backgroundColor: colors.surface, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 14, borderWidth: 1, borderColor: colors.border },
  mealEmoji:      { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.surfaceContainerLow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  mealTop:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mealName:       { fontSize: 15, fontWeight: '700', color: colors.heading, flex: 1, marginRight: 8 },
  mealTime:       { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  macroStrip:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  macroPill:      { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, borderWidth: 1, borderColor: colors.border },
  macroPillLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted },
  macroPillText:  { fontSize: 11, fontWeight: '700', color: colors.textBody },
  mealDeleteBtn:  { padding: 6, alignSelf: 'flex-start' },

  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.heading, marginBottom: 12 },

  assignLabel:          { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
  clientSelectRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceContainerLow, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border },
  clientSelectRowActive:{ borderColor: colors.accent, backgroundColor: colors.accentDim },
  clientSelectDot:      { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  clientSelectLetter:   { fontSize: 16, fontWeight: '800', color: colors.accent },
  clientSelectName:     { fontSize: 14, fontWeight: '700', color: colors.heading },
  clientSelectEmail:    { fontSize: 11, color: colors.textMuted },

  // AI Nutrition Analyzer
  aiAnalyzeBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 13, marginVertical: 10 },
  aiAnalyzeBtnText: { fontSize: 14, fontWeight: '700', color: colors.onPrimary },
  aiResultCard:     { borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(232,232,64,0.15)' },
  aiResultTitle:    { fontSize: 13, fontWeight: '700', color: colors.heading, flex: 1 },
  healthScorePill:  { backgroundColor: colors.accentDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  healthScoreText:  { fontSize: 10, fontWeight: '800', color: colors.accent },
  macroGrid:        { flexDirection: 'row', gap: 8, marginBottom: 10 },
  macroGridItem:    { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 10 },
  macroGridValue:   { fontSize: 14, fontWeight: '800' },
  macroGridLabel:   { fontSize: 10, color: colors.textMuted, fontWeight: '500', marginTop: 2 },
  aiTip:            { fontSize: 11, color: colors.textMuted, fontStyle: 'italic', lineHeight: 16 },
});
