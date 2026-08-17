import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Dimensions, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { dashboardData } from '../data/mockData';
import { usersApi, membershipsApi, allocationsApi, healthApi } from '../services/api';
import { Toast } from '../components/UIKit';
import { useAI } from '../context/AIContext';

const { width } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 110;

// ─── Animated bar ─────────────────────────────────────────────────────────────
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
        <Animated.View style={[styles.bar, { height: barH, backgroundColor: isHighlight ? colors.accent : color }]} />
      </View>
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

// ─── SVG donut ring ───────────────────────────────────────────────────────────
function MacroRing({ protein, carbs, total }) {
  const size = 96; const sw = 9; const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r; const cx = size / 2; const cy = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.border} strokeWidth={sw} />
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.accent} strokeWidth={sw}
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ - (protein / 100) * circ}
          strokeLinecap="round" transform={`rotate(-90, ${cx}, ${cy})`} />
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.accentSecondary} strokeWidth={sw}
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ - (carbs / 100) * circ}
          strokeLinecap="round" transform={`rotate(${-90 + (protein / 100) * 360}, ${cx}, ${cy})`} />
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
  const [tasks, setTasks] = useState(dashboardData.upcomingTasks);
  const [liveStats, setLiveStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  // ─── AI Context ─────────────────────────────────────────────────────────────
  const {
    dailyBriefing, briefingLoading, fetchDailyBriefing,
    riskScores, riskLoading, fetchRiskScores,
  } = useAI();

  // ─── Fetch live stats ────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const [usersRes, memRes, allocRes, healthRes] = await Promise.all([
        usersApi.getAll(), membershipsApi.getAll(), allocationsApi.getAll(), healthApi.getAll(),
      ]);
      setLiveStats({
        totalClients:   usersRes.count  || 0,
        memberships:    memRes.count    || 0,
        allocations:    allocRes.count  || 0,
        healthRecords:  healthRes.count || 0,
        activeMembers:  (memRes.data || []).filter(m => m.status === 'active').length,
        expiredMembers: (memRes.data || []).filter(m => m.status === 'expired').length,
      });
    } catch (e) { showToast('Backend offline — showing demo data', 'error'); }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.2, duration: 900, useNativeDriver: false }),
      Animated.timing(pulseAnim, { toValue: 1,   duration: 900, useNativeDriver: false }),
    ])).start();
  }, []);

  const handleAIReport = async () => {
    showToast('Generating AI Briefing…', 'info');
    try { await fetchDailyBriefing(); showToast('AI Daily Briefing refreshed!'); }
    catch (e) { showToast('Could not reach backend: ' + e.message, 'error'); }
  };
  const handleDietPlans = async () => {
    showToast('Loading Diet Plans…', 'info');
    try { const res = await membershipsApi.getAll('active'); showToast(`${res.count} active members have diet plans`); }
    catch (e) { showToast('Failed to load diet plans', 'error'); }
  };
  const handleViewAllSessions = async () => {
    showToast('Loading all sessions…', 'info');
    try { const res = await allocationsApi.getAll(); showToast(`${res.count} trainer-client sessions found`); }
    catch (e) { showToast('Could not load sessions', 'error'); }
  };
  const handleSendReminders = async () => {
    showToast('Checking expiring memberships…', 'info');
    try { const res = await membershipsApi.getAll('expired'); showToast(`Reminders sent to ${res.count} expired members!`); }
    catch (e) { showToast('Failed to send reminders', 'error'); }
  };
  const handleViewSchedule = async () => {
    showToast('Loading full schedule…', 'info');
    try { const res = await allocationsApi.getAll(); showToast(`${res.count} scheduled sessions total`); }
    catch (e) { showToast('Could not load schedule', 'error'); }
  };
  const handleViewAllInsights = async () => {
    showToast('Syncing AI insights…', 'info');
    try { const res = await healthApi.getAll(); showToast(`${res.count} health records analysed by AI`); }
    catch (e) { showToast('Could not load insights', 'error'); }
  };
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
  };

  const maxGrowth = Math.max(...dashboardData.monthlyGrowth.map(m => m.count));

  return (
    <View style={{ flex: 1 }}>
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
            <TouchableOpacity style={styles.heroBtnPrimary} activeOpacity={0.8} onPress={handleAIReport}>
              <Ionicons name="flash" size={14} color={colors.onPrimary} />
              <Text style={styles.heroBtnPrimaryText}>AI Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtnSecondary} activeOpacity={0.8} onPress={handleDietPlans}>
              <Text style={styles.heroBtnSecondaryText}>Diet Plans</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* ── AI Daily Briefing ─────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1A1A08', '#0E0E14']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.briefingCard}
      >
        <View style={styles.briefingHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={styles.briefingIconWrap}>
              <Ionicons name="sparkles" size={16} color={colors.accent} />
            </View>
            <Text style={styles.briefingTitle}>AI Daily Briefing</Text>
            <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          </View>
          <TouchableOpacity onPress={fetchDailyBriefing} style={styles.refreshBtn}>
            {briefingLoading
              ? <ActivityIndicator size="small" color={colors.accent} />
              : <Ionicons name="refresh-outline" size={16} color={colors.accent} />}
          </TouchableOpacity>
        </View>

        {briefingLoading && !dailyBriefing ? (
          <View style={{ gap: 8, marginTop: 4 }}>
            {[1, 2, 3].map(i => (
              <View key={i} style={[styles.skeletonLine, { width: i === 3 ? '60%' : '100%' }]} />
            ))}
          </View>
        ) : dailyBriefing ? (
          <>
            <Text style={styles.briefingGreeting}>{dailyBriefing.greeting}</Text>
            <Text style={styles.briefingSummary}>{dailyBriefing.summary}</Text>
            <View style={{ gap: 7, marginTop: 10 }}>
              {(dailyBriefing.priorities || []).slice(0, 3).map((p, i) => (
                <View key={i} style={styles.priorityRow}>
                  <Ionicons name="chevron-forward" size={12} color={colors.accent} />
                  <Text style={styles.priorityText}>{p}</Text>
                </View>
              ))}
            </View>
            {dailyBriefing.motivational_tip && (
              <View style={styles.motivationRow}>
                <Ionicons name="bulb-outline" size={14} color="#9C88FF" />
                <Text style={styles.motivationText}>{dailyBriefing.motivational_tip}</Text>
              </View>
            )}
            {dailyBriefing.ai_generated && (
              <View style={styles.aiGeneratedTag}>
                <Ionicons name="sparkles" size={10} color={colors.accent} />
                <Text style={styles.aiGeneratedText}>Generated by Gemini AI</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.briefingOffline}>Start your backend and add GEMINI_API_KEY to see AI briefings</Text>
        )}
      </LinearGradient>

      {/* ── Stats Grid ───────────────────────────────────────────────────── */}
      <View style={[styles.sectionHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <TouchableOpacity onPress={fetchStats} style={styles.refreshBtn}>
          {statsLoading
            ? <ActivityIndicator size="small" color={colors.accent} />
            : <Ionicons name="refresh-outline" size={16} color={colors.accent} />}
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {liveStats && [
          { id: 'db-clients', label: 'DB Clients',    value: liveStats.totalClients,  icon: 'people',          color: '#E8E840' },
          { id: 'db-active',  label: 'Active Members', value: liveStats.activeMembers, icon: 'checkmark-circle', color: '#4CAF50' },
          { id: 'db-expired', label: 'Expired',        value: liveStats.expiredMembers,icon: 'time',             color: '#F44336' },
          { id: 'db-alloc',   label: 'Allocations',    value: liveStats.allocations,   icon: 'git-branch',       color: '#B8B8D8' },
          { id: 'db-health',  label: 'Health Records', value: liveStats.healthRecords,  icon: 'pulse',            color: '#FF9800' },
        ].map((stat) => (
          <View key={stat.id} style={[styles.statCard, { borderColor: 'rgba(232,232,64,0.2)' }]}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon} size={18} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <View style={styles.liveTag}><Text style={styles.liveTagText}>LIVE</Text></View>
          </View>
        ))}
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

      {/* ── Client Risk Analysis (ML) ─────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="shield-checkmark" size={16} color={colors.accent} />
            <Text style={styles.cardTitle}>Client Risk Analysis</Text>
          </View>
          <TouchableOpacity onPress={fetchRiskScores} style={styles.refreshBtn}>
            {riskLoading
              ? <ActivityIndicator size="small" color={colors.accent} />
              : <Ionicons name="refresh-outline" size={16} color={colors.accent} />}
          </TouchableOpacity>
        </View>
        <Text style={styles.cardSubtitle}>Rule-based ML — BMI + membership expiry scoring</Text>
        <View style={styles.riskRow}>
          <View style={[styles.riskBox, { backgroundColor: 'rgba(244,67,54,0.1)', borderColor: 'rgba(244,67,54,0.3)' }]}>
            <Text style={[styles.riskCount, { color: '#F44336' }]}>{riskScores?.summary?.high ?? '—'}</Text>
            <Text style={[styles.riskLabel, { color: '#F44336' }]}>⚠ HIGH</Text>
          </View>
          <View style={[styles.riskBox, { backgroundColor: 'rgba(255,152,0,0.1)', borderColor: 'rgba(255,152,0,0.3)' }]}>
            <Text style={[styles.riskCount, { color: '#FF9800' }]}>{riskScores?.summary?.medium ?? '—'}</Text>
            <Text style={[styles.riskLabel, { color: '#FF9800' }]}>⚡ MEDIUM</Text>
          </View>
          <View style={[styles.riskBox, { backgroundColor: 'rgba(76,175,80,0.1)', borderColor: 'rgba(76,175,80,0.3)' }]}>
            <Text style={[styles.riskCount, { color: '#4CAF50' }]}>{riskScores?.summary?.low ?? '—'}</Text>
            <Text style={[styles.riskLabel, { color: '#4CAF50' }]}>✓ LOW</Text>
          </View>
        </View>
        {riskScores?.summary?.total > 0 && (
          <Text style={styles.riskFooter}>
            {riskScores.summary.total} clients scored · {riskScores.summary.high} need immediate attention
          </Text>
        )}
      </View>

      {/* ── AI Coaching Insights ─────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.cardTitle}>AI Coaching Insights</Text>
            <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
          </View>
          <TouchableOpacity style={styles.trendBadge} onPress={handleViewAllInsights}>
            <Ionicons name="trending-up" size={11} color={colors.accent} />
            <Text style={styles.trendText}>+14.2% View</Text>
          </TouchableOpacity>
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
              key={item.month} value={item.count} maxValue={maxGrowth}
              color={colors.accentSecondary} label={item.month.slice(0, 1)}
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
          <TouchableOpacity onPress={handleViewAllSessions}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.sessions.map((session) => (
          <TouchableOpacity key={session.id} style={styles.sessionRow} activeOpacity={0.7}>
            <View style={styles.sessionAvatarPlaceholder}>
              <Text style={styles.sessionAvatarLetter}>{session.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionName}>{session.name}</Text>
              <Text style={styles.sessionMeta}>{session.time} · {session.type}</Text>
            </View>
            <View style={[styles.sessionTypeBadge, { backgroundColor: colors.accentDim }]}>
              <Text style={[styles.sessionTypeText, { color: colors.accent }]}>{session.type}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8} onPress={handleViewSchedule}>
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
          <TouchableOpacity onPress={handleSendReminders}>
            <Text style={styles.seeAll}>Send Reminders</Text>
          </TouchableOpacity>
        </View>
        {dashboardData.upcomingRenewals.map((r) => (
          <View key={r.id} style={styles.renewalRow}>
            <View style={styles.renewalAvatarPlaceholder}>
              <Text style={styles.renewalAvatarLetter}>{r.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.renewalName}>{r.name}</Text>
              <Text style={styles.renewalDate}>Expires: {r.expiry}</Text>
            </View>
            <View style={[styles.daysLeftBadge, { backgroundColor: r.daysLeft <= 3 ? colors.errorContainer : colors.accentDim }]}>
              <Text style={[styles.daysLeftText, { color: r.daysLeft <= 3 ? colors.error : colors.accent }]}>
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
          {dashboardData.weeklyProgress.map((item) => (
            <ChartBar key={item.day} value={item.value} maxValue={1}
              color={colors.accentSecondary} label={item.day.slice(0, 1)}
              isHighlight={item.value > 0.9}
            />
          ))}
        </View>
      </View>

      {/* ── Macro + Goals row ─────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
        <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
          <Text style={[styles.cardTitle, { marginBottom: 12, fontSize: 15 }]}>Macros</Text>
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <MacroRing protein={dashboardData.macros.protein} carbs={dashboardData.macros.carbs} total={dashboardData.macros.total} />
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
          <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
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
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <TouchableOpacity
              onPress={() => handleToggleTask(task.id)}
              style={[styles.taskCheck, task.done && styles.taskCheckDone]}
            >
              {task.done && <Ionicons name="checkmark" size={12} color={colors.onPrimary} />}
            </TouchableOpacity>
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
    <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  refreshBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  liveTag:    { backgroundColor: 'rgba(232,232,64,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, marginTop: 4, alignSelf: 'flex-start' },
  liveTagText:{ fontSize: 8, fontWeight: '800', color: colors.accent, letterSpacing: 0.5 },

  // Hero
  heroCard:    { borderRadius: 24, padding: 22, marginTop: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(232,232,64,0.12)' },
  heroGlow:    { position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(232,232,64,0.06)' },
  heroContent: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  heroGreeting:{ fontSize: 14, color: colors.textSecondary, fontWeight: '500', marginBottom: 2 },
  heroName:    { fontSize: 28, fontWeight: '800', color: colors.heading, letterSpacing: -0.5 },
  achievementBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accentDim, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginTop: 10, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  achievementText: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  heroButtons: { gap: 8, minWidth: 110 },
  heroBtnPrimary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 14 },
  heroBtnPrimaryText: { color: colors.onPrimary, fontWeight: '700', fontSize: 13 },
  heroBtnSecondary: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingVertical: 11, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  heroBtnSecondaryText: { color: colors.textBody, fontWeight: '600', fontSize: 13 },

  // AI Daily Briefing
  briefingCard:     { borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(232,232,64,0.15)', overflow: 'hidden' },
  briefingHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  briefingIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  briefingTitle:    { fontSize: 15, fontWeight: '700', color: colors.heading },
  briefingGreeting: { fontSize: 13, color: colors.textSecondary, marginBottom: 4, fontWeight: '500' },
  briefingSummary:  { fontSize: 13, color: colors.textBody, lineHeight: 20, fontWeight: '400' },
  priorityRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  priorityText:     { flex: 1, fontSize: 12, color: colors.textBody, lineHeight: 18 },
  motivationRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  motivationText:   { flex: 1, fontSize: 12, color: '#9C88FF', fontStyle: 'italic', lineHeight: 18 },
  aiGeneratedTag:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, alignSelf: 'flex-end' },
  aiGeneratedText:  { fontSize: 10, color: colors.accent, fontWeight: '600' },
  briefingOffline:  { fontSize: 12, color: colors.textMuted, textAlign: 'center', paddingVertical: 8, lineHeight: 18 },
  skeletonLine:     { height: 11, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, marginVertical: 4 },

  // Risk Overview
  riskRow:   { flexDirection: 'row', gap: 10, marginTop: 10 },
  riskBox:   { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1 },
  riskCount: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  riskLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.4, marginTop: 3 },
  riskFooter:{ fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 10, fontStyle: 'italic' },

  // Section labels
  sectionHeader: { marginBottom: 12, marginTop: 4 },
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: colors.heading },

  // Stat cards
  statCard:  { backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginRight: 12, minWidth: 120, borderWidth: 1, borderColor: colors.border, alignItems: 'flex-start' },
  statIcon:  { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.heading, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500', marginTop: 3 },

  // Cards
  card:              { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  cardHeaderRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle:         { fontSize: 16, fontWeight: '700', color: colors.heading },
  cardSubtitle:      { fontSize: 12, color: colors.textMuted, marginBottom: 14 },
  cardSubtitleInline:{ fontSize: 12, color: colors.textMuted },
  seeAll:            { fontSize: 12, fontWeight: '600', color: colors.accent },

  // Pulse + trend
  pulseDot:   { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.accent },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentDim, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  trendText:  { color: colors.accent, fontSize: 11, fontWeight: '700' },

  // Insight rows
  insightRow:   { flexDirection: 'row', gap: 12, padding: 12, backgroundColor: colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 10, alignItems: 'flex-start' },
  insightIcon:  { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 13, fontWeight: '700', color: colors.heading, marginBottom: 3 },
  insightDesc:  { fontSize: 12, color: colors.textBody, lineHeight: 18 },

  // Chart
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, marginTop: 8, marginBottom: 8 },
  barWrapper:     { flex: 1, alignItems: 'center', gap: 5 },
  barContainer:   { width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  bar:            { width: '100%', borderRadius: 6 },
  barLabel:       { fontSize: 9, color: colors.textMuted, fontWeight: '500' },

  // Growth footer
  growthFooter:    { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  growthBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.accentDim, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  growthBadgeText: { fontSize: 11, fontWeight: '700', color: colors.accent },

  // Sessions
  sessionRow:            { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  sessionAvatarPlaceholder: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(232,232,64,0.3)' },
  sessionAvatarLetter:   { fontSize: 18, fontWeight: '800', color: colors.accent },
  sessionName:           { fontSize: 14, fontWeight: '700', color: colors.heading },
  sessionMeta:           { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sessionTypeBadge:      { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  sessionTypeText:       { fontSize: 11, fontWeight: '700' },
  outlineBtn:            { borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  outlineBtnText:        { color: colors.accent, fontWeight: '700', fontSize: 13 },

  // Renewals
  renewalRow:               { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  renewalAvatarPlaceholder: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  renewalAvatarLetter:      { fontSize: 15, fontWeight: '800', color: colors.accent },
  renewalName:              { fontSize: 14, fontWeight: '600', color: colors.heading },
  renewalDate:              { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  daysLeftBadge:            { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  daysLeftText:             { fontSize: 12, fontWeight: '800' },
  alertCountBadge:          { width: 20, height: 20, borderRadius: 7, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center' },
  alertCountText:           { fontSize: 10, fontWeight: '800', color: '#fff' },

  // Period selector
  periodPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  periodText: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },

  // Macro ring
  ringText:   { fontSize: 18, fontWeight: '800', color: colors.heading },
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
