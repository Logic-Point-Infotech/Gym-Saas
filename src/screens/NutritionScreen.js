// src/screens/NutritionScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';
import { DAILY_MEAL_LOG_MOCK } from '../utils/mockData';
import MealLogItem from '../components/MealLogItem';

const NutritionScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Icon name="menu" size={24} color={theme.primary} />
          <Text style={[styles.appTitle, { color: theme.heading }]}>MacroMate</Text>
          <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
            <Icon name="account-circle-outline" size={28} color={theme.textSecondary} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Daily Summary Ring */}
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.ringContainer}>
            <Svg width={140} height={140} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="42" stroke={theme.border} strokeWidth="8" fill="transparent" />
              <Circle
                cx="50" cy="50" r="42"
                stroke={theme.primary} strokeWidth="8" fill="transparent"
                strokeDasharray="264" strokeDashoffset="80" strokeLinecap="round"
              />
            </Svg>
            <View style={styles.ringText}>
              <Text style={[styles.kcalLeft, { color: theme.primary }]}>1,450</Text>
              <Text style={[styles.kcalLabel, { color: theme.textSecondary }]}>kcal left</Text>
            </View>
          </View>

          <View style={styles.macroTargetList}>
            <Text style={[styles.macroTitle, { color: theme.heading }]}>Macro Targets</Text>
            <View style={styles.macroProgress}>
              <View style={styles.macroHeader}>
                <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Protein</Text>
                <Text style={[styles.macroVal, { color: theme.heading }]}>120g / 180g</Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: theme.border }]}><View style={[styles.barFill, { backgroundColor: theme.primary, width: '66%' }]} /></View>
            </View>
            <View style={styles.macroProgress}>
              <View style={styles.macroHeader}>
                <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Carbs</Text>
                <Text style={[styles.macroVal, { color: theme.heading }]}>210g / 300g</Text>
              </View>
              <View style={[styles.barBg, { backgroundColor: theme.border }]}><View style={[styles.barFill, { backgroundColor: theme.secondary, width: '70%' }]} /></View>
            </View>
          </View>
        </View>

        {/* Meal History Timeline */}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.heading }]}>Meal History</Text>
            <View style={[styles.statusBadge, { backgroundColor: theme.primary + '1A' }]}>
                <Text style={[styles.statusBadgeText, { color: theme.primary }]}>TODAY</Text>
            </View>
        </View>

        <View style={styles.timeline}>
          <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
          {DAILY_MEAL_LOG_MOCK.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Icon name={index === 0 ? "weather-sunset-up" : "white-balance-sunny"} size={16} color={theme.primary} />
                </View>
                <View style={styles.logItemWrapper}>
                    <MealLogItem
                        imageUri={item.imageUri}
                        foodNames={item.foodNames}
                        timeLogged={item.timeLogged}
                        totalCalories={item.totalCalories}
                        verificationStatus={item.verificationStatus}
                        coachComment={item.coachComment}
                    />
                </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]}>
        <Icon name="camera" size={24} color={theme.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appTitle: { ...FONTS.title, fontWeight: 'bold', flex: 1, marginLeft: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SIZES.padding },
  summaryCard: { padding: 20, borderRadius: SIZES.radius, flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 32, borderWidth: 1 },
  ringContainer: { position: 'relative', width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
  ringText: { position: 'absolute', alignItems: 'center' },
  kcalLeft: { ...FONTS.headlineMobile, fontWeight: 'bold' },
  kcalLabel: { ...FONTS.labelCaps, fontSize: 10 },
  macroTargetList: { flex: 1, gap: 12 },
  macroTitle: { ...FONTS.bodyLarge, fontWeight: 'bold', marginBottom: 8 },
  macroProgress: { gap: 4 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  macroVal: { fontSize: 10, fontWeight: 'bold' },
  barBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { ...FONTS.title },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold' },
  timeline: { paddingLeft: 10 },
  timelineLine: { position: 'absolute', left: 29, top: 0, bottom: 0, width: 2 },
  timelineItem: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  timelineDot: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', zIndex: 1, borderWidth: 1 },
  logItemWrapper: { flex: 1 },
  fab: { position: 'absolute', bottom: 100, right: 24, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});

export default NutritionScreen;
