// src/components/CalorieRing.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme, { FONTS } from '../constants/theme';

const CalorieRing = ({ size = 200, strokeWidth = 15, progress = 0.6, calories = 1200, target = 2000 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.calories, { color: theme.heading }]}>{calories}</Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>of {target} kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  textContainer: { position: 'absolute', alignItems: 'center' },
  calories: { fontSize: 32, fontWeight: 'bold' },
  label: { fontSize: 12, marginTop: -4 },
});

export default CalorieRing;
