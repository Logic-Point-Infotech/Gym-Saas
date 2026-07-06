// src/components/MealLogItem.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { SIZES, SPACING, FONTS } from '../constants/theme';

const MealLogItem = ({ imageUri, foodNames, timeLogged, totalCalories, verificationStatus, coachComment }) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const isVerified = verificationStatus === 'Verified by Coach';

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <TouchableOpacity onPress={toggleExpand} style={styles.mainRow}>
        <Image
          source={{ uri: imageUri }}
          style={[styles.thumbnail, { backgroundColor: theme.muted }]}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={[styles.foodNames, { color: theme.heading }]} numberOfLines={1}>{foodNames}</Text>
          <View style={styles.statusRow}>
            <Icon
              name={isVerified ? "check-decagram" : "clock-outline"}
              size={12}
              color={isVerified ? theme.success : theme.warning}
            />
            <Text style={[styles.statusText, { color: isVerified ? theme.success : theme.warning }]}>
              {verificationStatus}
            </Text>
          </View>
          <Text style={[styles.time, { color: theme.textSecondary }]}>{timeLogged}</Text>
        </View>
        <View style={styles.calorieContainer}>
          <Text style={[styles.calories, { color: theme.primary }]}>{totalCalories}</Text>
          <Text style={[styles.unit, { color: theme.textSecondary }]}>kcal</Text>
        </View>
      </TouchableOpacity>

      {expanded && coachComment && (
        <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>
          <View style={[styles.commentBox, { backgroundColor: theme.background }]}>
            <View style={styles.commentHeader}>
              <Icon name="message-outline" size={14} color={theme.primary} />
              <Text style={[styles.commentTitle, { color: theme.primary }]}>COACH'S NOTE</Text>
            </View>
            <Text style={[styles.commentBody, { color: theme.textPrimary }]}>{coachComment}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    marginBottom: SPACING.m,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  thumbnail: { width: 50, height: 50, borderRadius: 10 },
  infoContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  foodNames: { ...FONTS.bodyLarge, fontWeight: 'bold' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statusText: { fontSize: 10, fontWeight: '600' },
  time: { fontSize: 10, marginTop: 2, opacity: 0.8 },
  calorieContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  calories: { ...FONTS.title, fontWeight: 'bold' },
  unit: { fontSize: 10, marginTop: -4 },
  expandedContent: { padding: 16, paddingTop: 0 },
  commentBox: { padding: 12, borderRadius: 12 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  commentTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  commentBody: { fontSize: 12, lineHeight: 18 },
});

export default MealLogItem;
