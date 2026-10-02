// src/components/ExerciseItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme, { FONTS, SPACING } from '../constants/theme';

const ExerciseItem = ({ exercise, isDone, onToggle }) => {
  return (
    <View style={[styles.container, { borderBottomColor: theme.border }]}>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.heading }]}>{exercise.name}</Text>
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          {exercise.muscle_group} • {exercise.sets} x {exercise.reps} • {exercise.rest_seconds}s rest
        </Text>
        {exercise.notes && <Text style={[styles.notes, { color: theme.textPrimary }]}>{exercise.notes}</Text>}
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.checkBtn,
          { backgroundColor: isDone ? theme.success : theme.border }
        ]}
      >
        <Icon name="check" size={20} color={isDone ? '#fff' : theme.muted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  content: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 12, marginTop: 4, textTransform: 'uppercase' },
  notes: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  checkBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
});

export default ExerciseItem;
