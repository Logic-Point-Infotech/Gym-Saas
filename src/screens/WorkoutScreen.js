// src/screens/WorkoutScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { getWorkoutPlan, logWorkout, getWorkoutHistory } from '../api/workoutApi';
import ExerciseItem from '../components/ExerciseItem';
import theme, { SIZES, SPACING, FONTS } from '../constants/theme';

const WorkoutScreen = () => {
  const { theme } = useTheme();
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(0);
  const [doneExercises, setDoneExercises] = useState({}); // { dayId_exId: true }

  const fetchData = async () => {
    try {
      const [planData, historyData] = await Promise.all([
        getWorkoutPlan(),
        getWorkoutHistory()
      ]);
      setPlan(planData);
      setHistory(historyData);
    } catch (err) {
      if (err.status !== 404) Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = (dayId, exId) => {
    const key = `${dayId}_${exId}`;
    setDoneExercises({ ...doneExercises, [key]: !doneExercises[key] });
  };

  const handleComplete = async (day) => {
    const setLogs = day.exercises.map(ex => ({
      exercise_id: ex.exercise_id,
      set_number: 1,
      reps_done: parseInt(ex.reps),
      weight_kg: 0,
      is_completed: !!doneExercises[`${day.id}_${ex.id}`]
    }));

    try {
      setLoading(true);
      await logWorkout({
        plan_id: plan.id,
        day_id: day.id,
        logged_date: new Date().toISOString().split('T')[0],
        duration_minutes: 45,
        notes: 'Completed session',
        set_logs: setLogs
      });
      Alert.alert('Success', 'Workout session logged!');
      fetchData();
    } catch (err) {
      Alert.alert('Failed', err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={[styles.center, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.heading }]}>Training Plan</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{plan?.title || 'No active plan'} • {plan?.split_type}</Text>
      </View>

      {!plan ? (
        <View style={styles.emptyPlan}>
          <Icon name="dumbbell" size={60} color={theme.muted} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No workout plan assigned by your coach yet.</Text>
        </View>
      ) : (
        plan.days.map((day, index) => (
          <View key={day.id} style={styles.daySection}>
            <TouchableOpacity
              onPress={() => setExpandedDay(expandedDay === index ? -1 : index)}
              style={[styles.dayHeader, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <View>
                <Text style={[styles.dayName, { color: theme.primary }]}>{day.day_name}</Text>
                <Text style={[styles.dayFocus, { color: theme.heading }]}>{day.focus}</Text>
              </View>
              <Icon name={expandedDay === index ? "chevron-up" : "chevron-down"} size={24} color={theme.textSecondary} />
            </TouchableOpacity>

            {expandedDay === index && (
              <View style={[styles.exercisesBox, { backgroundColor: theme.surface + '88', borderColor: theme.border }]}>
                {day.exercises.map(ex => (
                  <ExerciseItem
                    key={ex.id}
                    exercise={ex}
                    isDone={!!doneExercises[`${day.id}_${ex.id}`]}
                    onToggle={() => handleToggle(day.id, ex.id)}
                  />
                ))}
                <TouchableOpacity
                  style={[styles.completeBtn, { backgroundColor: theme.primary }]}
                  onPress={() => handleComplete(day)}
                >
                  <Text style={[styles.completeText, { color: theme.onPrimary }]}>Complete {day.day_name}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}

      <View style={styles.historySection}>
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Workout History</Text>
        {history.length > 0 ? (
          history.map(item => (
            <View key={item.id} style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.historyInfo}>
                <Text style={[styles.histDate, { color: theme.textSecondary }]}>{new Date(item.logged_date).toLocaleDateString()}</Text>
                <Text style={[styles.histFocus, { color: theme.heading }]}>{item.day_focus}</Text>
              </View>
              <View style={[styles.setCount, { backgroundColor: theme.primary + '22' }]}>
                <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{item.completed_sets} Sets</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ color: theme.muted, textAlign: 'center', marginTop: 20 }}>No sessions logged yet.</Text>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 4 },
  emptyPlan: { alignItems: 'center', marginTop: 60, padding: 40 },
  emptyText: { textAlign: 'center', marginTop: 16 },
  daySection: { marginHorizontal: 20, marginBottom: 12 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
  dayName: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  dayFocus: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  exercisesBox: { paddingHorizontal: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, marginTop: -8, paddingTop: 8 },
  completeBtn: { marginVertical: 20, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  completeText: { fontWeight: 'bold' },
  historySection: { padding: 20, marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  histDate: { fontSize: 10, fontWeight: 'bold' },
  histFocus: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  setCount: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }
});

export default WorkoutScreen;
