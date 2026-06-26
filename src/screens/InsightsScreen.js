import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { insightsData } from '../data/mockData';

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

  return (
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
              <Text style={styles.aiBannerSub}>5 new optimisation insights available</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.aiBannerBtn} activeOpacity={0.8}>
            <Text style={styles.aiBannerBtnText}>View All</Text>
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
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
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
            <Text style={styles.alertCountText}>{alerts.length}</Text>
          </View>
        </View>
        {alerts.map((a, i) => (
          <View key={i} style={[
            styles.alertCard,
            { borderLeftColor: a.severity === 'high' ? colors.error : '#FF9800' },
          ]}>
            <View style={styles.alertHeader}>
              <Ionicons
                name={a.severity === 'high' ? 'warning' : 'information-circle'}
                size={16}
                color={a.severity === 'high' ? colors.error : '#FF9800'}
              />
              <Text style={styles.alertClient}>{a.client}</Text>
              <View style={[
                styles.alertSevBadge,
                { backgroundColor: a.severity === 'high' ? colors.errorContainer : 'rgba(255,152,0,0.12)' },
              ]}>
                <Text style={[styles.alertSevText, { color: a.severity === 'high' ? colors.error : '#FF9800' }]}>
                  {a.severity.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.alertType}>{a.type}</Text>
            <Text style={styles.alertMsg}>{a.message}</Text>
            <TouchableOpacity style={styles.resolveBtn} activeOpacity={0.8}>
              <Text style={styles.resolveBtnText}>Resolve</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    </ScrollView>
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
});
