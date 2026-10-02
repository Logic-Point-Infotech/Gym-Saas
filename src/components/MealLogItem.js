// src/components/MealLogItem.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme, { FONTS, SIZES } from '../constants/theme';

const MealLogItem = ({ meal }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Image
        source={{ uri: meal.image_url || 'https://via.placeholder.com/100' }}
        style={[styles.image, { backgroundColor: theme.background }]}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.type, { color: theme.primary }]}>{meal.meal_type}</Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={[styles.foods, { color: theme.heading }]} numberOfLines={1}>
          {JSON.parse(meal.detected_foods).join(', ')}
        </Text>
        <View style={styles.macroRow}>
          <Text style={[styles.macro, { color: theme.textSecondary }]}>P: {meal.total_protein}g  </Text>
          <Text style={[styles.macro, { color: theme.textSecondary }]}>C: {meal.total_carbs}g  </Text>
          <Text style={[styles.macro, { color: theme.textSecondary }]}>F: {meal.total_fat}g</Text>
        </View>
      </View>
      <View style={styles.calorieBox}>
        <Text style={[styles.calories, { color: theme.primary }]}>{meal.total_calories}</Text>
        <Text style={[styles.unit, { color: theme.textSecondary }]}>kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  image: { width: 60, height: 60, borderRadius: 10 },
  content: { flex: 1, marginLeft: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  type: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  time: { fontSize: 10 },
  foods: { fontSize: 15, fontWeight: 'bold', marginVertical: 4 },
  macroRow: { flexDirection: 'row' },
  macro: { fontSize: 10, fontWeight: '600' },
  calorieBox: { alignItems: 'flex-end', marginLeft: 8 },
  calories: { fontSize: 18, fontWeight: 'bold' },
  unit: { fontSize: 10, marginTop: -2 },
});

export default MealLogItem;
