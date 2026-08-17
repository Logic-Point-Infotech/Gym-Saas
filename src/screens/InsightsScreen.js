import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { insightsData } from '../data/mockData';
import { healthApi, usersApi, aiApi } from '../services/api';
import { Toast, ActionModal, FormInput } from '../components/UIKit';

const { width } = Dimensions.get('window');

// ─── Simple mini bar chart ────────────────────────────────────────────────────
function MiniBarChart({ data, valueKey, color }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <View style={styles.miniChart}>
      {data.map((d, i) => (
        <View key={i} style={styles.miniBarWrap}>
          <View style={styles.miniBarBg}>
            <View style={[
              styles.miniBarFill,
              {
                height: `${(d[valueKey] / max) * 100}%`,
                backgroundColor: i === data.length - 1 ? colors.accent : color,
              },
            ]} />
          </View>
          <Text style={styles.miniBarLabel}>{d.month.slice(0,1)}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Blood report card ────────────────────────────────────────────────────────
function BloodCard({ item }) {
  return (
    <View style={styles.bloodCard}>
      <View style={styles.bloodCardTop}>
        <Text style={styles.bloodLabel}>{item.label}</Text>
        <View style={[styles.bloodStatusBadge, { backgroundColor: `${item.statusColor}18` }]}>
          <Text style={[styles.bloodStatus, { color: item.statusColor }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.bloodValue}>{item.value}</Text>
      <Text style={styles.bloodNormal}>Normal: {item.normal}</Text>
    </View>
  );
}

// ─── Summary stat card ────────────────────────────────────────────────────────
function ReportStatCard({ label, value, icon, color }) {
  return (
    <View style={styles.reportStatCard}>
      <View style={[styles.reportStatIcon, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.reportStatValue}>{value}</Text>
      <Text style={styles.reportStatLabel}>{label}</Text>
    </View>
  );
}

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { summary, topPerformers, alerts, healthMetrics, bloodReport, weightProgress, bmiTrend, reportSummary } = insightsData;

  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [liveHealth, setLiveHealth]         = useState([]);
  const [loadingHealth, setLoadingHealth]   = useState(false);
  const [refreshing, setRefreshing]         = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  // AI Health Summary state
  const [aiSummary, setAiSummary]               = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryClientId, setAiSummaryClientId] = useState('1');

  // Log Health Metric modal
  const [logHealthModal, setLogHealthModal] = useState(false);
  const [healthForm, setHealthForm] = useState({ client_id: '1', weight_kg: '', bmi: '', body_fat: '' });
  const [healthLogLoading, setHealthLogLoading] = useState(false);

  const fetchLiveHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const res = await healthApi.getAll();
      setLiveHealth(res.data || []);
    } catch (e) {
      showToast('Could not load health data from backend', 'error');
    } finally {
      setLoadingHealth(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchLiveHealth(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchLiveHealth(); };

  const handleResolve = (alert) => {
    setResolvedAlerts(prev => [...prev, alert.client]);
    showToast(`Alert for ${alert.client} resolved!`);
  };

  const handleViewAllInsights = async () => {
    showToast('Refreshing AI insights…', 'info');
    await fetchLiveHealth();
    showToast(`${liveHealth.length} health records loaded from backend`);
  };

  const handleSeeAllPerformers = async () => {
    showToast('Loading all performers…', 'info');
    try {
      const res = await usersApi.getAll();
      showToast(`${res.count} total users in database`);
    } catch (e) {
      showToast('Failed to load users', 'error');
    }
  };

  // ─── AI Health Summary ───────────────────────────────────────────────────
  const handleAIHealthSummary = async () => {
    setAiSummaryLoading(true);
    setAiSummary(null);
    try {
      const res = await aiApi.healthInsights(parseInt(aiSummaryClientId) || 1);
      setAiSummary(res);
    } catch (e) {
      showToast('AI Health Summary failed: ' + e.message, 'error');
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // ─── Log Health Metric ───────────────────────────────────────────────────
  const handleLogHealth = async () => {
    if (!healthForm.weight_kg) { showToast('Weight is required', 'error'); return; }
    setHealthLogLoading(true);
    try {
      await healthApi.log({
        client_id: parseInt(healthForm.client_id) || 1,
        weight_kg: parseFloat(healthForm.weight_kg),
        bmi:       healthForm.bmi ? parseFloat(healthForm.bmi) : undefined,
        body_fat:  healthForm.body_fat ? parseFloat(healthForm.body_fat) : undefined,
      });
      showToast('Health metric logged!');
      setLogHealthModal(false);
      setHealthForm({ client_id: '1', weight_kg: '', bmi: '', body_fat: '' });
      fetchLiveHealth();
    } catch (e) {
      showToast(e.message || 'Failed to log health metric', 'error');
    } finally {
      setHealthLogLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 64 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>AI Insights</Text>
          <Text style={styles.pageSubtitle}>Powered by Zenith AI Engine</Text>
        </View>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Overview summary strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {[
          { label: 'Active Clients',   value: summary.activeClients,       icon: 'people',          color: colors.accent },
          { label: 'Goal Completion',  value: `${summary.avgGoalCompletion}%`, icon: 'trophy',       color: colors.statusActive },
          { label: 'Sessions / Week',  value: summary.sessionsThisWeek,    icon: 'calendar',        color: colors.accentSecondary },
          { label: 'AI Suggestions',   value: summary.aiRecommendations,   icon: 'bulb',            color: '#9C88FF' },
        ].map((s) => (
          <View key={s.label} style={styles.overviewCard}>
            <View style={[styles.overviewIcon, { backgroundColor: `${s.color}15` }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={styles.overviewValue}>{s.value}</Text>
            <Text style={styles.overviewLabel}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* AI Banner */}
      <LinearGradient
        colors={['#1E1E10', '#111108']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.aiBanner}
      >
        <View style={styles.aiBannerInner}>
          <View style={styles.aiBannerLeft}>
            <View style={styles.aiBannerIcon}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.aiBannerTitle}>AI Analysis Ready</Text>
              <Text style={styles.aiBannerSub}>
                {loadingHealth ? 'Syncing…' : `${liveHealth.length} health records from DB`}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.aiBannerBtn} activeOpacity={0.8} onPress={handleViewAllInsights}>
            {loadingHealth
              ? <ActivityIndicator size="small" color={colors.onPrimary} />
              : <Text style={styles.aiBannerBtnText}>Sync Now</Text>}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Health Metrics ─────────────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Health Metrics</Text>
      <View style={styles.metricsGrid}>
        {[
          { label: 'Weight',   value: healthMetrics.weight,  icon: 'scale-outline',    color: colors.accent },
          { label: 'Height',   value: healthMetrics.height,  icon: 'resize-outline',   color: colors.accentSecondary },
          { label: 'BMI',      value: healthMetrics.bmi,     icon: 'body-outline',     color: colors.statusActive },
          { label: 'Body Fat', value: healthMetrics.bodyFat, icon: 'pulse-outline',    color: '#FF9800' },
        ].map((m) => (
          <View key={m.label} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: `${m.color}15` }]}>
              <Ionicons name={m.icon} size={20} color={m.color} />
            </View>
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Blood Report Summary ─────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Blood Report Summary</Text>
      <View style={styles.bloodGrid}>
        {bloodReport.map((item) => <BloodCard key={item.label} item={item} />)}
      </View>

      {/* ── Weight Progress Chart ─────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Weight Progress</Text>
          <View style={styles.improveBadge}>
            <Ionicons name="arrow-down" size={11} color={colors.statusActive} />
            <Text style={[styles.improveText, { color: colors.statusActive }]}>−3.7 kg</Text>
          </View>
        </View>
        <MiniBarChart data={weightProgress} valueKey="weight" color={colors.accentSecondary} />
        <View style={styles.chartLegend}>
          {weightProgress.map((d) => (
            <Text key={d.month} style={styles.chartLegendText}>{d.month}</Text>
          ))}
        </View>
      </View>

      {/* ── BMI Trend ─────────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>BMI Trend</Text>
          <View style={styles.improveBadge}>
            <Ionicons name="trending-down" size={11} color={colors.statusActive} />
            <Text style={[styles.improveText, { color: colors.statusActive }]}>−1.2</Text>
          </View>
        </View>
        <MiniBarChart data={bmiTrend} valueKey="bmi" color={colors.accentSecondary} />
        <View style={styles.chartLegend}>
          {bmiTrend.map((d) => (
            <Text key={d.month} style={styles.chartLegendText}>{d.month}</Text>
          ))}
        </View>
      </View>

      {/* ── Reports Summary Cards ──────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Progress Summary</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        <ReportStatCard label="Weight Lost"       value={reportSummary.weightLost}      icon="trending-down"     color={colors.accent} />
        <ReportStatCard label="Calories Tracked"  value={reportSummary.caloriesTracked} icon="flame"             color={colors.statusActive} />
        <ReportStatCard label="BMI Improvement"   value={reportSummary.bmiImprovement}  icon="body"              color={colors.accentSecondary} />
        <ReportStatCard label="Diet Compliance"   value={reportSummary.dietCompliance}  icon="checkmark-circle"  color="#FF9800" />
      </ScrollView>

      {/* ── Top Performers ────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Top Performers</Text>
          <TouchableOpacity onPress={handleSeeAllPerformers}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {topPerformers.map((p, i) => (
          <View key={p.name} style={styles.performerRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{i+1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.performerName}>{p.name}</Text>
              <Text style={styles.performerMetric}>{p.metric}</Text>
            </View>
            <View style={styles.improvPill}>
              <Ionicons name="trending-up" size={11} color={colors.statusActive} />
              <Text style={styles.improvPillText}>{p.improvement}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Active Alerts ─────────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Active Alerts</Text>
          <View style={styles.alertCountBadge}>
            <Text style={styles.alertCountText}>{alerts.filter(a => !resolvedAlerts.includes(a.client)).length}</Text>
          </View>
        </View>
        {alerts.filter(a => !resolvedAlerts.includes(a.client)).map((a, i) => (
          <View key={i} style={[styles.alertCard, { borderLeftColor: a.severity === 'high' ? colors.error : '#FF9800' }]}>
            <View style={styles.alertHeader}>
              <Ionicons name={a.severity === 'high' ? 'warning' : 'information-circle'} size={16} color={a.severity === 'high' ? colors.error : '#FF9800'} />
              <Text style={styles.alertClient}>{a.client}</Text>
              <View style={[styles.alertSevBadge, { backgroundColor: a.severity === 'high' ? colors.errorContainer : 'rgba(255,152,0,0.12)' }]}>
                <Text style={[styles.alertSevText, { color: a.severity === 'high' ? colors.error : '#FF9800' }]}>{a.severity.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.alertType}>{a.type}</Text>
            <Text style={styles.alertMsg}>{a.message}</Text>
            <TouchableOpacity style={styles.resolveBtn} activeOpacity={0.8} onPress={() => handleResolve(a)}>
              <Text style={styles.resolveBtnText}>✓ Resolve Alert</Text>
            </TouchableOpacity>
          </View>
        ))}
        {alerts.filter(a => !resolvedAlerts.includes(a.client)).length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 20, gap: 8 }}>
            <Ionicons name="checkmark-circle" size={36} color={colors.statusActive} />
            <Text style={{ color: colors.statusActive, fontWeight: '700', fontSize: 14 }}>All alerts resolved!</Text>
          </View>
        )}
      </View>

      {/* ── AI Recommendations ────────────────────────────────────────── */}
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { marginBottom: 14 }]}>AI Recommendations</Text>
        {[
          { icon: 'nutrition',  text: 'Increase protein targets for Marcus and Tom by 15g/day',       color: colors.statusActive   },
          { icon: 'moon',       text: 'Recommend recovery days Wed/Thu for high-intensity clients',    color: colors.accentSecondary},
          { icon: 'trending-up',text: 'Elena shows plateau — consider progressive overload variation', color: colors.accent         },
        ].map((rec, i) => (
          <View key={i} style={styles.recRow}>
            <View style={[styles.recIcon, { backgroundColor: `${rec.color}15` }]}>
              <Ionicons name={rec.icon} size={17} color={rec.color} />
            </View>
            <Text style={styles.recText}>{rec.text}</Text>
          </View>
        ))}
      </View>

      {/* ── AI Health Summary ──────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1A1A08', '#111118']}
        style={styles.aiSummaryCard}
      >
        <View style={styles.aiSummaryHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="sparkles" size={17} color={colors.accent} />
            <Text style={styles.aiSummaryTitle}>AI Health Summary</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              style={styles.aiClientIdInput}
              value={aiSummaryClientId}
              onChangeText={setAiSummaryClientId}
              placeholder="Client ID"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.aiSummaryBtn}
              onPress={handleAIHealthSummary}
              disabled={aiSummaryLoading}
            >
              {aiSummaryLoading
                ? <ActivityIndicator size="small" color={colors.onPrimary} />
                : <Text style={styles.aiSummaryBtnText}>Generate</Text>}
            </TouchableOpacity>
          </View>
        </View>
        {aiSummaryLoading && (
          <View style={{ gap: 8, marginTop: 10 }}>
            {[1, 2, 3].map(i => <View key={i} style={[styles.skeletonLine, { width: i === 2 ? '70%' : '90%' }]} />)}
          </View>
        )}
        {aiSummary && !aiSummaryLoading && (
          <View style={{ marginTop: 10 }}>
            {aiSummary.narrative && (
              <Text style={styles.aiNarrative}>{aiSummary.narrative}</Text>
            )}
            {(aiSummary.alerts || []).map((al, i) => (
              <View key={i} style={[styles.aiAlertRow, { borderLeftColor: al.type === 'warning' ? '#F44336' : '#FF9800' }]}>
                <Ionicons name={al.type === 'warning' ? 'warning-outline' : 'information-circle-outline'} size={14} color={al.type === 'warning' ? '#F44336' : '#FF9800'} />
                <Text style={styles.aiAlertText}>{al.message}</Text>
              </View>
            ))}
            {(aiSummary.recommendations || []).slice(0, 3).map((rec, i) => (
              <View key={i} style={styles.aiRecRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color={colors.accent} />
                <Text style={styles.aiRecText}>{rec}</Text>
              </View>
            ))}
          </View>
        )}
        {!aiSummary && !aiSummaryLoading && (
          <Text style={styles.aiSummaryHint}>Enter a client ID and tap Generate to get an AI health narrative</Text>
        )}
      </LinearGradient>

      {/* Log Health Metric button */}
      <TouchableOpacity style={styles.logHealthBtn} onPress={() => setLogHealthModal(true)} activeOpacity={0.8}>
        <Ionicons name="add-circle-outline" size={18} color={colors.onPrimary} />
        <Text style={styles.logHealthBtnText}>Log Health Metric</Text>
      </TouchableOpacity>

    </ScrollView>

    {/* ── Log Health Modal ──────────────────────────────────────────────────── */}
    <ActionModal
      visible={logHealthModal}
      title="Log Health Metric"
      onClose={() => setLogHealthModal(false)}
      onSubmit={handleLogHealth}
      loading={healthLogLoading}
    >
      <FormInput label="Client ID" value={healthForm.client_id} onChangeText={(v) => setHealthForm(p => ({ ...p, client_id: v }))} placeholder="1" keyboardType="numeric" />
      <FormInput label="Weight (kg)" value={healthForm.weight_kg} onChangeText={(v) => setHealthForm(p => ({ ...p, weight_kg: v }))} placeholder="e.g. 72.5" keyboardType="decimal-pad" />
      <FormInput label="BMI (optional)" value={healthForm.bmi} onChangeText={(v) => setHealthForm(p => ({ ...p, bmi: v }))} placeholder="e.g. 23.4" keyboardType="decimal-pad" />
      <FormInput label="Body Fat % (optional)" value={healthForm.body_fat} onChangeText={(v) => setHealthForm(p => ({ ...p, body_fat: v }))} placeholder="e.g. 18" keyboardType="decimal-pad" />
    </ActionModal>

    <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },
  pageHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 18 },
  pageTitle:   { fontSize: 24, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  pageSubtitle:{ fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  livePill:    { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.accentDim, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  liveDot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  liveText:    { fontSize: 12, fontWeight: '700', color: colors.accent },

  sectionLabel:{ fontSize: 14, fontWeight: '700', color: colors.heading, marginBottom: 12, marginTop: 4 },

  // Overview strip
  overviewCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginRight: 12, minWidth: 128, borderWidth: 1, borderColor: colors.border },
  overviewIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  overviewValue:{ fontSize: 24, fontWeight: '800', color: colors.heading, letterSpacing: -0.5 },
  overviewLabel:{ fontSize: 11, color: colors.textSecondary, fontWeight: '500', marginTop: 3 },

  // AI Banner
  aiBanner:      { borderRadius: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(232,232,64,0.15)' },
  aiBannerInner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  aiBannerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 14 },
  aiBannerIcon:  { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  aiBannerTitle: { fontSize: 15, fontWeight: '700', color: colors.heading },
  aiBannerSub:   { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  aiBannerBtn:   { backgroundColor: colors.accent, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12 },
  aiBannerBtnText:{ color: colors.onPrimary, fontSize: 13, fontWeight: '700' },

  // Health Metrics
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  metricCard:  { backgroundColor: colors.surface, borderRadius: 16, padding: 14, width: (width - 28 - 10) / 2, borderWidth: 1, borderColor: colors.border },
  metricIcon:  { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  metricValue: { fontSize: 22, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  metricLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '500', marginTop: 2 },

  // Blood report
  bloodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bloodCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, width: (width - 28 - 10) / 2, borderWidth: 1, borderColor: colors.border },
  bloodCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bloodLabel:   { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  bloodStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  bloodStatus:  { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  bloodValue:   { fontSize: 18, fontWeight: '800', color: colors.heading, marginBottom: 3 },
  bloodNormal:  { fontSize: 10, color: colors.textMuted, fontWeight: '500' },

  // Mini chart
  miniChart:      { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 80, marginTop: 8 },
  miniBarWrap:    { flex: 1, alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' },
  miniBarBg:      { width: '100%', backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden', height: '80%', justifyContent: 'flex-end' },
  miniBarFill:    { width: '100%', borderRadius: 5 },
  miniBarLabel:   { fontSize: 9, color: colors.textMuted, fontWeight: '500' },
  chartLegend:    { flexDirection: 'row', marginTop: 4 },
  chartLegendText:{ flex: 1, fontSize: 9, color: colors.textMuted, textAlign: 'center' },
  improveBadge:   { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  improveText:    { fontSize: 12, fontWeight: '700' },

  // Report stat card
  reportStatCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, marginRight: 12, minWidth: 130, borderWidth: 1, borderColor: colors.border, borderTopWidth: 3, borderTopColor: colors.accent },
  reportStatIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  reportStatValue:{ fontSize: 20, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  reportStatLabel:{ fontSize: 11, color: colors.textSecondary, fontWeight: '500', marginTop: 2 },

  // Cards
  card:          { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle:     { fontSize: 16, fontWeight: '700', color: colors.heading },
  seeAll:        { fontSize: 12, fontWeight: '600', color: colors.accent },

  // Performers
  performerRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  rankBadge:     { width: 30, height: 30, borderRadius: 9, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  rankText:      { fontSize: 11, fontWeight: '800', color: colors.accent },
  performerName: { fontSize: 14, fontWeight: '700', color: colors.heading },
  performerMetric:{ fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  improvPill:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  improvPillText:{ fontSize: 12, fontWeight: '700', color: colors.statusActive },

  // Alerts
  alertCountBadge:{ width: 22, height: 22, borderRadius: 7, backgroundColor: colors.errorContainer, alignItems: 'center', justifyContent: 'center' },
  alertCountText: { fontSize: 11, fontWeight: '800', color: colors.error },
  alertCard:     { borderRadius: 14, borderLeftWidth: 4, backgroundColor: colors.surfaceContainerLow, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  alertHeader:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  alertClient:   { fontSize: 14, fontWeight: '700', color: colors.heading, flex: 1 },
  alertSevBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  alertSevText:  { fontSize: 9, fontWeight: '800', letterSpacing: 0.4 },
  alertType:     { fontSize: 10, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  alertMsg:      { fontSize: 13, color: colors.textBody, lineHeight: 19, marginBottom: 10 },
  resolveBtn:    { alignSelf: 'flex-start', backgroundColor: colors.accentDim, paddingHorizontal: 13, paddingVertical: 6, borderRadius: 9, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  resolveBtnText:{ fontSize: 12, fontWeight: '700', color: colors.accent },

  // Recommendations
  recRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  recIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  recText: { flex: 1, fontSize: 13, color: colors.textBody, lineHeight: 20, fontWeight: '500' },

  // AI Health Summary
  aiSummaryCard:   { borderRadius: 20, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(232,232,64,0.15)' },
  aiSummaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  aiSummaryTitle:  { fontSize: 15, fontWeight: '700', color: colors.heading },
  aiClientIdInput: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, fontSize: 13, color: colors.heading, width: 80, borderWidth: 1, borderColor: colors.border },
  aiSummaryBtn:    { backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  aiSummaryBtnText:{ fontSize: 12, fontWeight: '700', color: colors.onPrimary },
  aiNarrative:     { fontSize: 13, color: colors.textBody, lineHeight: 20, marginBottom: 12, fontStyle: 'italic' },
  aiAlertRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8, borderLeftWidth: 3, paddingLeft: 10, paddingVertical: 6, backgroundColor: 'rgba(244,67,54,0.05)', borderRadius: 8 },
  aiAlertText:     { fontSize: 12, color: colors.textBody, flex: 1, lineHeight: 18 },
  aiRecRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  aiRecText:       { fontSize: 12, color: colors.textBody, flex: 1, lineHeight: 18 },
  aiSummaryHint:   { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', paddingVertical: 10 },
  skeletonLine:    { height: 12, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 6 },
  logHealthBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 14, marginBottom: 16 },
  logHealthBtnText:{ fontSize: 14, fontWeight: '700', color: colors.onPrimary },
});
