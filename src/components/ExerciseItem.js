// src/components/ExerciseItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const ExerciseItem = ({ exercise }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={[styles.statusIndicator, { backgroundColor: exercise.done ? theme.success : theme.border }]} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.textPrimary }]}>{exercise.name}</Text>
        <Text style={[styles.details, { color: theme.textSecondary }]}>
          {exercise.sets} sets • {exercise.reps} reps
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.checkBtn, { backgroundColor: exercise.done ? theme.success : theme.muted }]}
      >
        <Icon name="check" size={20} color={exercise.done ? '#fff' : theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
  },
  statusIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: SPACING.m,
  },
  content: { flex: 1 },
  name: { ...FONTS.body, fontWeight: 'bold' },
  details: { ...FONTS.caption, marginTop: 2 },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ExerciseItem;
