import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, Animated, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { shadows } from '../theme/typography';
import { dashboardData } from '../data/mockData';

const { width } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 110;

// ─── Animated bar for weekly/monthly charts ───────────────────────────────────
function ChartBar({ value, maxValue, color, label, isHighlight }) {
  const anim = useRef(new Animated.Value(0)).current;
  const normalised = value / maxValue;

  useEffect(() => {
    Animated.spring(anim, { toValue: normalised, delay: 80, useNativeDriver: false }).start();
  }, []);

  const barH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_MAX_HEIGHT] });

  return (
    <View style={styles.barWrapper}>
      <View style={[styles.barContainer, { height: BAR_MAX_HEIGHT }]}>
        <Animated.View
          style={[styles.bar, { height: barH, backgroundColor: isHighlight ? colors.accent : color }]}
        />
      </View>
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

// ─── SVG donut ring ───────────────────────────────────────────────────────────
function MacroRing({ protein, carbs, total }) {
  const size = 96;
  const sw = 9;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.border} strokeWidth={sw} />
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.accent}
          strokeWidth={sw} strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ - (protein / 100) * circ}
          strokeLinecap="round" rotation="-90" origin={`${size/2}, ${size/2}`} />
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.accentSecondary}
          strokeWidth={sw} strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ - (carbs / 100) * circ}
          strokeLinecap="round" rotation={`${-90 + (protein/100)*360}`} origin={`${size/2}, ${size/2}`} />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.ringText}>{total}%</Text>
        </View>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [activeMonth, setActiveMonth] = useState(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const maxGrowth = Math.max(...dashboardData.monthlyGrowth.map(m => m.count));

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 64 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1E1E10', '#141410', '#0A0A12']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        {/* Lime accent glow */}
        <View style={styles.heroGlow} />
        <View style={styles.heroContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroGreeting}>{dashboardData.greeting}</Text>
            <Text style={styles.heroName}>{dashboardData.trainerName}</Text>
            <View style={styles.achievementBadge}>
              <Ionicons name="trophy" size={13} color={colors.accent} />
              <Text style={styles.achievementText}>{dashboardData.goalAchievement}</Text>
            </View>
          </View>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.heroBtnPrimary} activeOpacity={0.8}>
              <Ionicons name="flash" size={14} color={colors.onPrimary} />
              <Text style={styles.heroBtnPrimaryText}>AI Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtnSecondary} activeOpacity={0.8}>
              <Text style={styles.heroBtnSecondaryText}>Diet Plans</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* ── Stats Grid ───────────────────────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Overview</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {dashboardData.stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon} size={18} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ── AI Coaching Insights ─────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.cardTitle}>AI Coaching Insights</Text>
            <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          </View>
          <View style={styles.trendBadge}>
            <Ionicons name="trending-up" size={11} color={colors.accent} />
            <Text style={styles.trendText}>+14.2%</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>Real-time performance optimization</Text>
        {dashboardData.insights.map((item) => (
          <View key={item.id} style={styles.insightRow}>
            <View style={[styles.insightIcon, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>{item.title}</Text>
              <Text style={styles.insightDesc}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Monthly Member Growth ─────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Monthly Member Growth</Text>
          <Text style={styles.cardSubtitleInline}>Last 12 months</Text>
        </View>
        <View style={styles.chartContainer}>
          {dashboardData.monthlyGrowth.map((item, i) => (
            <ChartBar
              key={item.month}
              value={item.count}
              maxValue={maxGrowth}
              color={colors.accentSecondary}
              label={item.month.slice(0, 1)}
              isHighlight={i === dashboardData.monthlyGrowth.length - 1}
            />
          ))}
        </View>
        <View style={styles.growthFooter}>
          <View style={styles.growthBadge}>
            <Ionicons name="arrow-up" size={12} color={colors.accent} />
            <Text style={styles.growthBadgeText}>+3 this month</Text>
          </View>
        </View>
      </View>

      {/* ── Today's Sessions ─────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Today's Sessions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.sessions.map((session) => (
          <TouchableOpacity key={session.id} style={styles.sessionRow} activeOpacity={0.7}>
            <Image source={{ uri: session.avatar }} style={styles.sessionAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionName}>{session.name}</Text>
              <Text style={styles.sessionMeta}>{session.time} · {session.type}</Text>
            </View>
            <View style={[styles.sessionTypeBadge, { backgroundColor: colors.accentDim }]}>
              <Text style={[styles.sessionTypeText, { color: colors.accent }]}>{session.type}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
          <Text style={styles.outlineBtnText}>View Full Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* ── Upcoming Renewals ────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.cardTitle}>Upcoming Renewals</Text>
            <View style={styles.alertCountBadge}>
              <Text style={styles.alertCountText}>{dashboardData.upcomingRenewals.length}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Send Reminders</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.upcomingRenewals.map((r) => (
          <View key={r.id} style={styles.renewalRow}>
            <Image source={{ uri: r.avatar }} style={styles.renewalAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.renewalName}>{r.name}</Text>
              <Text style={styles.renewalDate}>Expires: {r.expiry}</Text>
            </View>
            <View style={[
              styles.daysLeftBadge,
              { backgroundColor: r.daysLeft <= 3 ? colors.errorContainer : colors.accentDim },
            ]}>
              <Text style={[
                styles.daysLeftText,
                { color: r.daysLeft <= 3 ? colors.error : colors.accent },
              ]}>
                {r.daysLeft}d
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Weekly Progress Chart ─────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Weekly Progress</Text>
          <View style={styles.periodPill}>
            <Text style={styles.periodText}>Last 7 Days</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          {dashboardData.weeklyProgress.map((item, i) => (
            <ChartBar
              key={item.day}
              value={item.value}
              maxValue={1}
              color={colors.accentSecondary}
              label={item.day.slice(0, 1)}
              isHighlight={item.value > 0.9}
            />
          ))}
        </View>
      </View>

      {/* ── Macro + Goals row ─────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        {/* Macros */}
        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
          <Text style={[styles.cardTitle, { marginBottom: 12, fontSize: 15 }]}>Macros</Text>
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <MacroRing
              protein={dashboardData.macros.protein}
              carbs={dashboardData.macros.carbs}
              total={dashboardData.macros.total}
            />
          </View>
          {[
            { label: 'Protein', pct: dashboardData.macros.protein, color: colors.accent },
            { label: 'Carbs',   pct: dashboardData.macros.carbs,   color: colors.accentSecondary },
            { label: 'Fats',    pct: dashboardData.macros.fats,    color: colors.textSecondary },
          ].map((m) => (
            <View key={m.label} style={styles.macroRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.dot, { backgroundColor: m.color }]} />
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
              <Text style={[styles.macroValue, { color: m.color }]}>{m.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Goal Tracker */}
        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
          <Text style={[styles.cardTitle, { marginBottom: 12, fontSize: 15 }]}>Goals</Text>
          {dashboardData.goals.map((g) => (
            <View key={g.label} style={{ marginBottom: 14 }}>
              <View style={styles.goalHeaderRow}>
                <Text style={styles.goalLabel}>{g.label}</Text>
                <Text style={[styles.goalPct, { color: g.color }]}>{g.value}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${g.value}%`, backgroundColor: g.color }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Recent Activities ────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Recent Activities</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.recentActivities.map((act) => (
          <View key={act.id} style={styles.activityRow}>
            <View style={[styles.activityIcon, { backgroundColor: `${act.color}15` }]}>
              <Ionicons name={act.icon} size={16} color={act.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityText}>{act.text}</Text>
              <Text style={styles.activityTime}>{act.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Upcoming Tasks ───────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Upcoming Tasks</Text>
          <View style={styles.trendBadge}>
            <Text style={styles.trendText}>
              {dashboardData.upcomingTasks.filter(t => !t.done).length} pending
            </Text>
          </View>
        </View>
        {dashboardData.upcomingTasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
              {task.done && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
            </View>
            <Text style={[styles.taskText, task.done && styles.taskTextDone]}>{task.task}</Text>
            <View style={[styles.dueBadge, { backgroundColor: task.due === 'Today' ? colors.accentDim : colors.surfaceContainerHigh }]}>
              <Text style={[styles.dueText, { color: task.due === 'Today' ? colors.accent : colors.textSecondary }]}>
                {task.due}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },

  // Hero
  heroCard: { borderRadius: 24, padding: 22, marginTop: 12, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(232,232,64,0.12)' },
  heroGlow:  { position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(232,232,64,0.06)' },
  heroContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroGreeting: { fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginBottom: 2 },
  heroName:     { fontSize: 28, fontWeight: '800', color: colors.heading, letterSpacing: -0.5 },
  achievementBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accentDim, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginTop: 10, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  achievementText: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  heroButtons: { gap: 8, minWidth: 110 },
  heroBtnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 14 },
  heroBtnPrimaryText: { color: colors.onPrimary, fontWeight: '700', fontSize: 13 },
  heroBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  heroBtnSecondaryText: { color: colors.textBody, fontWeight: '600', fontSize: 13 },

  // Section labels
  sectionHeader: { marginBottom: 12, marginTop: 4 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: colors.heading },

  // Stat cards (horizontal scroll)
  statCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginRight: 12, minWidth: 120, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  statIcon:  { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.heading, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', marginTop: 3 },

  // Cards
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle:     { fontSize: 16, fontWeight: '700', color: colors.heading },
  cardSubtitle:  { fontSize: 12, color: colors.textMuted, marginBottom: 14 },
  cardSubtitleInline: { fontSize: 12, color: colors.textMuted },
  seeAll:        { fontSize: 12, fontWeight: '600', color: colors.accent },

  // Pulse + trend
  pulseDot:   { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentDim, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  trendText:  { color: colors.accent, fontSize: 11, fontWeight: '700' },

  // Insight rows
  insightRow:  { flexDirection: 'row', gap: 12, padding: 12, backgroundColor: colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 10, alignItems: 'flex-start' },
  insightIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 13, fontWeight: '700', color: colors.heading, marginBottom: 3 },
  insightDesc:  { fontSize: 12, color: colors.textBody, lineHeight: 18 },

  // Chart
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, marginTop: 8, marginBottom: 8 },
  barWrapper:   { flex: 1, alignItems: 'center', gap: 5 },
  barContainer: { width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  bar:          { width: '100%', borderRadius: 6 },
  barLabel:     { fontSize: 9, color: colors.textMuted, fontWeight: '500' },

  // Growth footer
  growthFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  growthBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  growthBadgeText: { fontSize: 11, fontWeight: '700', color: colors.accent },

  // Sessions
  sessionRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  sessionAvatar:  { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.border },
  sessionName:    { fontSize: 14, fontWeight: '700', color: colors.heading },
  sessionMeta:    { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sessionTypeBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  sessionTypeText:  { fontSize: 11, fontWeight: '700' },

  outlineBtn:     { borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  outlineBtnText: { color: colors.accent, fontWeight: '700', fontSize: 13 },

  // Renewals
  renewalRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  renewalAvatar:  { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.border },
  renewalName:    { fontSize: 14, fontWeight: '600', color: colors.heading },
  renewalDate:    { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  daysLeftBadge:  { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  daysLeftText:   { fontSize: 12, fontWeight: '800' },
  alertCountBadge:{ width: 20, height: 20, borderRadius: 7, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center' },
  alertCountText: { fontSize: 10, fontWeight: '800', color: '#fff' },

  // Period selector
  periodPill:   { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  periodText:   { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },

  // Macro ring
  ringText: { fontSize: 18, fontWeight: '800', color: colors.heading },

  // Macro legend
  macroRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  macroLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  macroValue: { fontSize: 12, fontWeight: '700' },

  // Goal tracker
  goalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  goalLabel:     { fontSize: 12, fontWeight: '600', color: colors.textBody },
  goalPct:       { fontSize: 12, fontWeight: '700' },
  progressBg:    { height: 5, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  progressFill:  { height: '100%', borderRadius: 5 },

  // Activities
  activityRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  activityIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  activityText: { fontSize: 13, color: colors.textBody, lineHeight: 19, fontWeight: '500' },
  activityTime: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  // Tasks
  taskRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  taskCheck:     { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  taskCheckDone: { backgroundColor: colors.accent, borderColor: colors.accent },
  taskText:      { flex: 1, fontSize: 13, color: colors.textBody, fontWeight: '500' },
  taskTextDone:  { color: colors.textMuted, textDecorationLine: 'line-through' },
  dueBadge:      { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  dueText:       { fontSize: 11, fontWeight: '700' },
});
