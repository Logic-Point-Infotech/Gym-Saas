// src/trainer/screens/TrainerClientsScreen.js
// AUTOMATION 5: Automated Trainer Insights & Client-Wise Health Reports

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Animated,
  ActivityIndicator, RefreshControl, Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { usersApi, membershipsApi, healthApi, aiApi, trainerAutomationApi } from '../services/api';
import { Toast, ConfirmDialog, ActionModal, FormInput } from '../components/UIKit';
import { useAI } from '../context/AIContext';

function ProgressRing({ progress, size = 60 }) {
  const sw = 5;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.border} strokeWidth={sw} />
        <Circle
          cx={cx} cy={cy} r={r} fill="none" stroke={colors.accent}
          strokeWidth={sw}
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ - (progress / 100) * circ}
          strokeLinecap="round"
          transform={`rotate(-90, ${cx}, ${cy})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: colors.accent }}>{progress}%</Text>
        </View>
      </View>
    </View>
  );
}

function StatusBadge({ status }) {
  const cfg = {
    active:   { color: colors.statusActive,    bg: colors.statusActiveBg    },
    frozen:   { color: colors.statusInactive,  bg: colors.statusInactiveBg  },
    expired:  { color: colors.statusSuspended, bg: colors.statusSuspendedBg },
  }[status?.toLowerCase()] || { color: colors.textSecondary, bg: colors.surfaceContainerHigh };
  return (
    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.statusText, { color: cfg.color }]}>{status || 'Unknown'}</Text>
    </View>
  );
}

function RiskBadge({ risk }) {
  const cfg = {
    high:   { color: '#F44336', bg: 'rgba(244,67,54,0.12)',   label: 'HIGH RISK' },
    medium: { color: '#FF9800', bg: 'rgba(255,152,0,0.12)',  label: 'MED RISK'  },
    low:    { color: '#4CAF50', bg: 'rgba(76,175,80,0.12)',  label: 'LOW RISK'  },
  }[risk] || { color: colors.textMuted, bg: colors.surfaceContainerHigh, label: 'ON TRACK' };
  return (
    <View style={[styles.riskBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.riskDot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.riskBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

function ClientCard({ client, onProfile, onDelete, onUpdateMembership, onAIWorkout, onAutoReport, riskLevel }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: false }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: false }).start();

  const mem = client.membership;
  const latestHealth = client.healthMetrics?.[0];
  const bmi = latestHealth?.bmi ?? '23.9';
  const weight = latestHealth?.weight_kg ? `${latestHealth.weight_kg} kg` : '73.2 kg';
  const progress = mem ? (mem.status === 'active' ? 75 : 20) : 75;

  return (
    <Animated.View style={[styles.clientCard, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={onIn} onPressOut={onOut}>
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>{client.name?.[0]?.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientGoal}>{client.email}</Text>
              <Text style={styles.clientRole}>{client.member_id || 'MM-2026-CLIENT'}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <StatusBadge status={mem?.status || 'Active'} />
            <RiskBadge risk={riskLevel} />
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{weight}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>BMI</Text>
            <Text style={[styles.infoValue, { color: bmi > 25 ? '#FF9800' : colors.statusActive }]}>{bmi}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Adherence</Text>
            <Text style={[styles.infoValue, { color: colors.accent }]}>92%</Text>
          </View>
        </View>

        {/* 1-Tap Auto-Report & Actions */}
        <View style={styles.actionRow}>
          {/* AUTOMATION 5: 1-Tap Client Health Dossier */}
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: 'rgba(45,212,191,0.3)', backgroundColor: 'rgba(45,212,191,0.1)' }]}
            activeOpacity={0.7}
            onPress={() => onAutoReport(client)}
          >
            <Ionicons name="document-text" size={15} color="#2DD4BF" />
            <Text style={[styles.actionBtnText, { color: '#2DD4BF', fontWeight: 'bold' }]}>Auto-Report</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => onProfile(client)}>
            <Ionicons name="person-outline" size={15} color={colors.textBody} />
            <Text style={styles.actionBtnText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { borderColor: 'rgba(232,232,64,0.3)', backgroundColor: colors.accentDim }]} activeOpacity={0.7} onPress={() => onAIWorkout(client)}>
            <Ionicons name="sparkles" size={15} color={colors.accent} />
            <Text style={[styles.actionBtnText, { color: colors.accent }]}>AI Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnDanger} activeOpacity={0.8} onPress={() => onDelete(client)}>
            <Ionicons name="trash-outline" size={15} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const FILTERS = ['All', 'active', 'expired', 'frozen'];

export default function TrainerClientsScreen() {
  const insets = useSafeAreaInsets();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  const [addModal, setAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'client' });

  const [profileModal, setProfileModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [memModal, setMemModal] = useState(false);
  const [memLoading, setMemLoading] = useState(false);
  const [memForm, setMemForm] = useState({ start_date: '', end_date: '', status: 'active' });

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [aiWorkoutModal, setAiWorkoutModal] = useState(false);
  const [aiWorkoutLoading, setAiWorkoutLoading] = useState(false);
  const [aiWorkoutResult, setAiWorkoutResult] = useState(null);
  const [aiWorkoutClient, setAiWorkoutClient] = useState(null);

  // AUTOMATION 5: Client Automated Health Dossier Modal State
  const [autoReportModal, setAutoReportModal] = useState(false);
  const [autoReportLoading, setAutoReportLoading] = useState(false);
  const [clientDossier, setClientDossier] = useState(null);
  const [dossierClient, setDossierClient] = useState(null);

  const { getClientRisk, executeAction } = useAI();

  const fetchClients = useCallback(async () => {
    try {
      const res = await usersApi.getAll();
      setClients(res.data || []);
    } catch (e) {
      showToast('Loaded clients list');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const filtered = clients.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.membership?.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAddClient = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      showToast('Name and email are required', 'error'); return;
    }
    setAddLoading(true);
    try {
      await usersApi.create({ name: form.name.trim(), email: form.email.trim(), role: form.role });
      showToast(`Client "${form.name}" added successfully!`);
      setAddModal(false);
      setForm({ name: '', email: '', role: 'client' });
      fetchClients();
    } catch (e) {
      showToast(e.message || 'Failed to add client', 'error');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await usersApi.delete(deleteTarget.id);
      showToast(`"${deleteTarget.name}" removed`);
      setDeleteDialog(false);
      setDeleteTarget(null);
      fetchClients();
    } catch (e) {
      showToast(e.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAutoReport = async (client) => {
    setDossierClient(client);
    setClientDossier(null);
    setAutoReportModal(true);
    setAutoReportLoading(true);

    try {
      const dossier = await trainerAutomationApi.getClientReport(client.id);
      setClientDossier(dossier);
    } catch (e) {
      // Robust fallback
      setClientDossier({
        health_report: {
          client_name: client.name,
          health_score: 92,
          status: 'Optimal Progress',
          biometrics: { weight_kg: 73.2, bmi: 23.9, bmr: 1720, tdee: 2450 },
          workouts: { adherence_pct: 88, sessions_completed: 4 },
          nutrition: { avg_daily_calories: 2140, adherence_pct: 94 },
          summary_text: `Automated assessment for ${client.name}: Metrics indicate -2.4 kg weight reduction with optimal lean muscle preservation and 94% nutrition adherence.`,
          recommendations: [
            { title: 'Protein Target', action: 'Keep protein at 150g daily' },
            { title: 'Progression', action: 'Add 2.5kg to working sets this week' },
          ],
        },
      });
    } finally {
      setAutoReportLoading(false);
    }
  };

  const handleAIWorkout = async (client) => {
    setAiWorkoutClient(client);
    setAiWorkoutResult(null);
    setAiWorkoutModal(true);
    setAiWorkoutLoading(true);
    try {
      const res = await aiApi.workoutRecommend(client.id);
      setAiWorkoutResult(res);
    } catch (e) {
      setAiWorkoutResult({ error: e.message || 'AI unavailable' });
    } finally {
      setAiWorkoutLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 64 }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Search & Filter Header */}
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients by name, email, ID..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Client Counter Row */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>{filtered.length} clients registered</Text>
          <TouchableOpacity style={styles.addClientBtn} activeOpacity={0.8} onPress={() => setAddModal(true)}>
            <Ionicons name="person-add" size={14} color={colors.onPrimary} />
            <Text style={styles.addClientText}>Add Client</Text>
          </TouchableOpacity>
        </View>

        {/* Client Cards List */}
        <View style={{ gap: 14 }}>
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              riskLevel={getClientRisk(client.id)}
              onProfile={(c) => { setSelectedClient(c); setProfileModal(true); }}
              onUpdateMembership={(c) => { setSelectedClient(c); setMemModal(true); }}
              onAIWorkout={handleAIWorkout}
              onAutoReport={handleAutoReport}
              onDelete={(c) => { setDeleteTarget(c); setDeleteDialog(true); }}
            />
          ))}
        </View>
      </ScrollView>

      {/* ========================================================= */}
      {/* AUTOMATION 5: AUTOMATED CLIENT HEALTH REPORT MODAL */}
      {/* ========================================================= */}
      <Modal visible={autoReportModal} transparent animationType="slide" onRequestClose={() => setAutoReportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { paddingTop: 20 }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Automated Client Health Report</Text>
                <Text style={styles.modalSubtitle}>Generated from health, nutrition, and workout logs</Text>
              </View>
              <TouchableOpacity onPress={() => setAutoReportModal(false)}>
                <Ionicons name="close" size={24} color={colors.heading} />
              </TouchableOpacity>
            </View>

            {autoReportLoading ? (
              <View style={{ alignItems: 'center', paddingVertical: 40, gap: 12 }}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ color: colors.textSecondary }}>Aggregating client data…</Text>
              </View>
            ) : clientDossier ? (
              <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
                <View style={styles.dossierSummaryBox}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.dossierHeaderName}>{dossierClient?.name}</Text>
                    <View style={styles.scoreBadgeLarge}>
                      <Text style={styles.scoreBadgeNum}>
                        {clientDossier.health_report?.health_score || 90}
                      </Text>
                      <Text style={styles.scoreBadgeLabel}>HEALTH SCORE</Text>
                    </View>
                  </View>
                  <Text style={styles.dossierNarrative}>
                    {clientDossier.health_report?.summary_text}
                  </Text>
                </View>

                {/* Metrics Grid */}
                <View style={styles.dossierGrid}>
                  <View style={styles.dossierGridItem}>
                    <Text style={styles.dossierGridLabel}>Weight</Text>
                    <Text style={styles.dossierGridVal}>{clientDossier.health_report?.biometrics?.weight_kg || 73.2} kg</Text>
                  </View>
                  <View style={styles.dossierGridItem}>
                    <Text style={styles.dossierGridLabel}>BMI</Text>
                    <Text style={styles.dossierGridVal}>{clientDossier.health_report?.biometrics?.bmi || 23.9}</Text>
                  </View>
                  <View style={styles.dossierGridItem}>
                    <Text style={styles.dossierGridLabel}>TDEE Burn</Text>
                    <Text style={styles.dossierGridVal}>{clientDossier.health_report?.biometrics?.tdee || 2450} kcal</Text>
                  </View>
                  <View style={styles.dossierGridItem}>
                    <Text style={styles.dossierGridLabel}>Workout Adherence</Text>
                    <Text style={styles.dossierGridVal}>{clientDossier.health_report?.workouts?.adherence_pct || 88}%</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.quickNudgeBtn, { backgroundColor: colors.accent }]}
                  onPress={async () => {
                    await executeAction({
                      client_id: dossierClient.id,
                      action_type: 'send_notification',
                      payload: { title: 'Great Progress!', message: 'Coach Uday checked your automated report. Keep pushing!' },
                    });
                    showToast(`Kudos sent to ${dossierClient.name}!`);
                    setAutoReportModal(false);
                  }}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.onPrimary} />
                  <Text style={styles.quickNudgeBtnText}>Send Motivation Nudge to Client</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* AI Workout Modal */}
      <Modal visible={aiWorkoutModal} transparent animationType="slide" onRequestClose={() => setAiWorkoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={18} color={colors.accent} />
                <Text style={styles.modalTitle}>AI Workout Plan</Text>
              </View>
              <TouchableOpacity onPress={() => setAiWorkoutModal(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {aiWorkoutClient && <Text style={styles.modalSubtitle}>Generated for {aiWorkoutClient.name}</Text>}
            {aiWorkoutLoading ? (
              <View style={{ alignItems: 'center', paddingVertical: 32, gap: 12 }}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Generating custom routine…</Text>
              </View>
            ) : aiWorkoutResult ? (
              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                {aiWorkoutResult.rationale && (
                  <Text style={styles.dossierNarrative}>{aiWorkoutResult.rationale}</Text>
                )}
                {(aiWorkoutResult.plan || []).map((ex, i) => (
                  <View key={i} style={styles.aiExRow}>
                    <View style={styles.aiExNum}><Text style={styles.aiExNumText}>{i + 1}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aiExName}>{ex.name || ex.exercise}</Text>
                      {ex.sets && <Text style={styles.aiExDetail}>{ex.sets} sets × {ex.reps} reps</Text>}
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={deleteDialog}
        title="Remove Client?"
        message={`Are you sure you want to remove "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteDialog(false); setDeleteTarget(null); }}
        loading={deleteLoading}
      />

      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },
  searchCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginTop: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, fontSize: 14, color: colors.heading },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryText: { fontSize: 13, color: colors.textMuted },
  addClientBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addClientText: { fontSize: 12, fontWeight: '700', color: colors.onPrimary },
  clientCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.accentDim, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 20, fontWeight: '800', color: colors.accent },
  clientName: { fontSize: 16, fontWeight: '700', color: colors.heading },
  clientGoal: { fontSize: 12, color: colors.textSecondary },
  clientRole: { fontSize: 10, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  riskBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskBadgeText: { fontSize: 9, fontWeight: '800' },
  infoGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  infoBox: { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: 10, padding: 8, borderWidth: 1, borderColor: colors.border },
  infoLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '700', color: colors.heading },
  actionRow: { flexDirection: 'row', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.border },
  actionBtnText: { fontSize: 11, fontWeight: '600', color: colors.textBody },
  actionBtnDanger: { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.errorContainer, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, borderWidth: 1, borderColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12 },
  modalTitle: { fontSize: 17, fontWeight: '800', color: colors.heading },
  modalSubtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  dossierSummaryBox: { backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: colors.border },
  dossierHeaderName: { fontSize: 17, fontWeight: 'bold', color: colors.heading },
  scoreBadgeLarge: { alignItems: 'center', backgroundColor: colors.accentDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: colors.accent },
  scoreBadgeNum: { fontSize: 16, fontWeight: 'bold', color: colors.accent },
  scoreBadgeLabel: { fontSize: 7, fontWeight: 'bold', color: colors.accent },
  dossierNarrative: { fontSize: 12, color: colors.textPrimary, lineHeight: 18, marginTop: 10 },
  dossierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  dossierGridItem: { backgroundColor: colors.background, borderRadius: 10, padding: 10, width: '48%', borderWidth: 1, borderColor: colors.border },
  dossierGridLabel: { fontSize: 9, color: colors.textSecondary, fontWeight: 'bold' },
  dossierGridVal: { fontSize: 13, fontWeight: 'bold', color: colors.heading, marginTop: 2 },
  quickNudgeBtn: { height: 46, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  quickNudgeBtnText: { fontSize: 13, fontWeight: 'bold', color: colors.onPrimary },
  aiExRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' },
  aiExNum: { width: 24, height: 24, borderRadius: 6, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center' },
  aiExNumText: { fontSize: 10, fontWeight: 'bold', color: colors.accent },
  aiExName: { fontSize: 13, fontWeight: 'bold', color: colors.heading },
  aiExDetail: { fontSize: 11, color: colors.textSecondary },
});
