// src/screens/DietPlanScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';

const DietPlanScreen = () => {
  const { theme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false); // Simulate trainer update lock

  const [guidelines, setGuidelines] = useState([
    { id: 1, title: '3L Water Intake', sub: 'Stay hydrated throughout the day', icon: 'water-outline', checked: false },
    { id: 2, title: '7hr Quality Sleep', sub: 'Crucial for muscle recovery', icon: 'bed-outline', checked: false },
    { id: 3, title: 'Zero Sugar Policy', sub: 'Avoid processed sweeteners', icon: 'block-helper', checked: false },
    { id: 4, title: 'Post-meal Walk', sub: '10 min walk after dinner', icon: 'walk', checked: false },
  ]);

  const toggleGuideline = (id) => {
    if (isUpdating) return;
    setGuidelines(guidelines.map(g => g.id === id ? { ...g, checked: !g.checked } : g));
  };

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

      <ScrollView contentContainerStyle={styles.content}>
        {/* Assigned By */}
        <View style={styles.assignedSection}>
          <View style={styles.assignedInfo}>
            <View>
              <Text style={[styles.labelCaps, { color: theme.textSecondary }]}>Assigned By</Text>
              <Text style={[styles.trainerName, { color: theme.heading }]}>Uday Patil</Text>
            </View>
            <TouchableOpacity
                onPress={() => setIsUpdating(!isUpdating)}
                style={[styles.badge, { backgroundColor: theme.primary + '1A', borderColor: theme.primary + '33' }]}
            >
              <Icon name="check-decagram" size={16} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.primary }]}>ELITE TRAINER</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.underline, { backgroundColor: theme.primary }]} />
        </View>

        {/* Daily Guidelines */}
        <Text style={[styles.sectionTitle, { color: theme.heading }]}>Daily Guidelines</Text>
        <View style={styles.guidelineGrid}>
          {guidelines.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.guidelineCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
                item.checked && { backgroundColor: theme.primary + '0D', borderColor: theme.primary }
              ]}
              onPress={() => toggleGuideline(item.id)}
            >
              <Icon
                name={item.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color={item.checked ? theme.primary : theme.textSecondary}
              />
              <View style={styles.guidelineText}>
                <Text style={[styles.guidelineTitle, { color: theme.heading }]}>{item.title}</Text>
                <Text style={[styles.guidelineSub, { color: theme.textSecondary }]}>{item.sub}</Text>
              </View>
              <Icon name={item.icon} size={20} color={theme.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal Sections */}
        <Text style={[styles.sectionTitle, { color: theme.heading, marginTop: SPACING.l }]}>Meal Sections</Text>

        {/* Timed Meals */}
        <View style={[styles.mealCard, { borderLeftColor: theme.secondary, backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.mealHeader}>
            <View style={styles.mealTitleRow}>
              <View style={[styles.mealIconBox, { backgroundColor: theme.secondary + '1A' }]}>
                <Icon name="weather-sunset-up" size={24} color={theme.secondary} />
              </View>
              <View>
                <Text style={[styles.mealType, { color: theme.heading }]}>Breakfast</Text>
                <Text style={[styles.mealTime, { color: theme.textSecondary }]}>07:30 AM - 08:30 AM</Text>
              </View>
            </View>
            <View style={[styles.kcalBadge, { backgroundColor: theme.border }]}>
              <Text style={[styles.kcalText, { color: theme.textPrimary }]}>450 kcal</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]}>
            <Icon name="download" size={20} color={theme.onPrimary} />
            <Text style={[styles.primaryBtnText, { color: theme.onPrimary }]}>Download Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Icon name="share-variant" size={20} color={theme.heading} />
            <Text style={[styles.secondaryBtnText, { color: theme.heading }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* DIET PLAN LOCKING OVERLAY - NEW BRIDGING FEATURE */}
      {isUpdating && (
        <View style={[styles.lockOverlay, { backgroundColor: 'rgba(10, 10, 18, 0.85)' }]}>
            <View style={styles.lockBox}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.lockTitle, { color: theme.heading }]}>Updating Your Plan</Text>
                <Text style={[styles.lockSub, { color: theme.textSecondary }]}>Coach Uday is currently making adjustments to your nutrition strategy. Please wait...</Text>
                <TouchableOpacity onPress={() => setIsUpdating(false)} style={styles.dismissBtn}>
                    <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Dismiss</Text>
                </TouchableOpacity>
            </View>
        </View>
      )}

      <View style={{ height: 100 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appTitle: { ...FONTS.title, fontWeight: 'bold', flex: 1, marginLeft: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SIZES.padding },
  assignedSection: { marginBottom: SPACING.l },
  assignedInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  labelCaps: { ...FONTS.labelCaps },
  trainerName: { ...FONTS.headlineMobile },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  badgeText: { ...FONTS.labelCaps, marginLeft: 4 },
  underline: { height: 4, width: 60, borderRadius: 2 },
  sectionTitle: { ...FONTS.title, marginBottom: SPACING.m },
  guidelineGrid: { gap: 10 },
  guidelineCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: SIZES.radius, borderWidth: 1 },
  guidelineText: { flex: 1, marginLeft: 12 },
  guidelineTitle: { ...FONTS.bodyLarge, fontWeight: '600' },
  guidelineSub: { ...FONTS.caption, marginTop: 2 },
  mealCard: { padding: 16, borderRadius: SIZES.radius, borderLeftWidth: 4, marginBottom: 16, borderWidth: 1 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mealTitleRow: { flexDirection: 'row', alignItems: 'center' },
  mealIconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  mealType: { ...FONTS.bodyLarge, fontWeight: 'bold' },
  mealTime: { ...FONTS.caption },
  kcalBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  kcalText: { ...FONTS.labelCaps },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: SPACING.l },
  primaryBtn: { flex: 2, height: 56, borderRadius: SIZES.radius, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  secondaryBtn: { flex: 1, height: 56, borderRadius: SIZES.radius, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  secondaryBtnText: { fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  lockOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: 'center', alignItems: 'center', padding: 30 },
  lockBox: { width: '100%', padding: 30, borderRadius: 24, alignItems: 'center', backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#303030' },
  lockTitle: { ...FONTS.h3, marginTop: 20, textAlign: 'center' },
  lockSub: { ...FONTS.bodySmall, textAlign: 'center', marginTop: 12, lineHeight: 18 },
  dismissBtn: { marginTop: 24, padding: 10 }
});

export default DietPlanScreen;
