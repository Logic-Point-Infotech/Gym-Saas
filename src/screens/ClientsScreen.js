import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, TextInput, Animated,
  ActivityIndicator, RefreshControl, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { usersApi, membershipsApi, healthApi, aiApi } from '../services/api';
import { Toast, ConfirmDialog, ActionModal, FormInput } from '../components/UIKit';
import { useAI } from '../context/AIContext';

// ─── Small progress ring ──────────────────────────────────────────────────────
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

// ─── Status badge ─────────────────────────────────────────────────────────────
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

// ─── AI Risk Badge ────────────────────────────────────────────────────────────
function RiskBadge({ risk }) {
  const cfg = {
    high:   { color: '#F44336', bg: 'rgba(244,67,54,0.12)',   label: 'HIGH RISK' },
    medium: { color: '#FF9800', bg: 'rgba(255,152,0,0.12)',  label: 'MED RISK'  },
    low:    { color: '#4CAF50', bg: 'rgba(76,175,80,0.12)',  label: 'LOW RISK'  },
  }[risk] || { color: colors.textMuted, bg: colors.surfaceContainerHigh, label: 'UNKNOWN' };
  return (
    <View style={[styles.riskBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.riskDot, { backgroundColor: cfg.color }]} />
      <Text style={[styles.riskBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Client Card ─────────────────────────────────────────────────────────────
function ClientCard({ client, onProfile, onDelete, onUpdateMembership, onAIWorkout, riskLevel }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: false }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: false }).start();

  const mem = client.membership;
  const latestHealth = client.healthMetrics?.[0];
  const bmi = latestHealth?.bmi ?? '—';
  const weight = latestHealth?.weight_kg ? `${latestHealth.weight_kg} kg` : '—';
  const progress = mem ? (mem.status === 'active' ? 75 : 20) : 0;

  return (
    <Animated.View style={[styles.clientCard, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={onIn} onPressOut={onOut}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>{client.name?.[0]?.toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientGoal}>{client.email}</Text>
              <Text style={styles.clientRole}>{client.role?.toUpperCase()}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <StatusBadge status={mem?.status || 'No Plan'} />
            <RiskBadge risk={riskLevel} />
          </View>
        </View>

        {/* Membership row */}
        {mem ? (
          <View style={styles.membershipRow}>
            <Ionicons name="card-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.membershipText}>
              Expires: {new Date(mem.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Text>
            <View style={styles.progressRingSmall}>
              <ProgressRing progress={progress} size={48} />
            </View>
          </View>
        ) : (
          <View style={styles.membershipRow}>
            <Ionicons name="card-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.membershipText, { color: colors.textMuted }]}>No membership assigned</Text>
          </View>
        )}

        {/* Health stats */}
        {latestHealth && (
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{weight}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>BMI</Text>
              <Text style={[styles.infoValue, { color: bmi > 25 ? '#FF9800' : colors.statusActive }]}>{bmi}</Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => onProfile(client)}>
            <Ionicons name="person-outline" size={15} color={colors.textBody} />
            <Text style={styles.actionBtnText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => onUpdateMembership(client)}>
            <Ionicons name="card-outline" size={15} color={colors.textBody} />
            <Text style={styles.actionBtnText}>Membership</Text>
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

export default function ClientsScreen() {
  const insets = useSafeAreaInsets();
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  // Add Client modal
  const [addModal, setAddModal]   = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', role: 'client' });

  // Profile modal
  const [profileModal, setProfileModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Membership modal
  const [memModal, setMemModal]   = useState(false);
  const [memLoading, setMemLoading] = useState(false);
  const [memForm, setMemForm]     = useState({ start_date: '', end_date: '', status: 'active' });

  // Delete confirm
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget]   = useState(null);

  // AI Workout
  const [aiWorkoutModal, setAiWorkoutModal] = useState(false);
  const [aiWorkoutLoading, setAiWorkoutLoading] = useState(false);
  const [aiWorkoutResult, setAiWorkoutResult] = useState(null);
  const [aiWorkoutClient, setAiWorkoutClient] = useState(null);

  const { getClientRisk } = useAI();

  // ─── Fetch clients ──────────────────────────────────────────────────────────
  const fetchClients = useCallback(async () => {
    try {
      const res = await usersApi.getAll();
      setClients(res.data || []);
    } catch (e) {
      showToast('Failed to load clients: ' + e.message, 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchClients(); };

  // ─── Filter clients ─────────────────────────────────────────────────────────
  const filtered = clients.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.membership?.status === filter;
    return matchSearch && matchFilter;
  });

  // ─── Add Client ─────────────────────────────────────────────────────────────
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

  // ─── Delete Client ──────────────────────────────────────────────────────────
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

  // ─── Update Membership ──────────────────────────────────────────────────────
  const handleMembershipSubmit = async () => {
    if (!memForm.start_date || !memForm.end_date) {
      showToast('Start and end dates are required', 'error'); return;
    }
    setMemLoading(true);
    try {
      const existing = selectedClient?.membership;
      if (existing) {
        await membershipsApi.update(existing.id, {
          start_date: memForm.start_date,
          end_date:   memForm.end_date,
          status:     memForm.status,
        });
        showToast('Membership updated!');
      } else {
        await membershipsApi.create({
          client_id:  selectedClient.id,
          start_date: memForm.start_date,
          end_date:   memForm.end_date,
          status:     memForm.status,
        });
        showToast('Membership created!');
      }
      setMemModal(false);
      fetchClients();
    } catch (e) {
      showToast(e.message || 'Membership update failed', 'error');
    } finally {
      setMemLoading(false);
    }
  };

  // ─── AI Workout Recommend ───────────────────────────────────────────────────
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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top + 64 }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Search + filters */}
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <Ionicons name="search-outline" size={17} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search clients by name or email…"
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {FILTERS.map((f) => {
              const isActive = filter === f;
              const count = f === 'All'
                ? clients.length
                : clients.filter(c => c.membership?.status === f).length;
              return (
                <TouchableOpacity
                  key={f} onPress={() => setFilter(f)}
                  style={[styles.chip, isActive && styles.chipActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                  <View style={[styles.chipCount, isActive && styles.chipCountActive]}>
                    <Text style={[styles.chipCountText, isActive && styles.chipCountTextActive]}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Showing <Text style={{ color: colors.accent, fontWeight: '700' }}>{filtered.length}</Text> clients
          </Text>
          <TouchableOpacity
            style={styles.addClientBtn}
            activeOpacity={0.8}
            onPress={() => setAddModal(true)}
          >
            <Ionicons name="person-add-outline" size={14} color={colors.onPrimary} />
            <Text style={styles.addClientText}>Add Client</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        {loading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading clients…</Text>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {filtered.map((c) => (
              <ClientCard
                key={c.id} client={c}
                riskLevel={getClientRisk(c.id)}
                onProfile={(cl) => { setSelectedClient(cl); setProfileModal(true); }}
                onDelete={(cl) => { setDeleteTarget(cl); setDeleteDialog(true); }}
                onAIWorkout={handleAIWorkout}
                onUpdateMembership={(cl) => {
                  setSelectedClient(cl);
                  const mem = cl.membership;
                  setMemForm({
                    start_date: mem?.start_date ? mem.start_date.split('T')[0] : '',
                    end_date:   mem?.end_date   ? mem.end_date.split('T')[0]   : '',
                    status:     mem?.status     || 'active',
                  });
                  setMemModal(true);
                }}
              />
            ))}
            {filtered.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={44} color={colors.textMuted} />
                <Text style={styles.emptyText}>No clients found</Text>
                <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setAddModal(true)}>
                  <Text style={styles.emptyAddText}>Add First Client</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── Add Client Modal ─────────────────────────────────────────────── */}
      <ActionModal
        visible={addModal}
        title="Add New Client"
        onClose={() => setAddModal(false)}
        onSubmit={handleAddClient}
        loading={addLoading}
      >
        <FormInput label="Full Name" value={form.name} onChangeText={(v) => setForm(p => ({ ...p, name: v }))} placeholder="e.g. Sarah Chen" />
        <FormInput label="Email Address" value={form.email} onChangeText={(v) => setForm(p => ({ ...p, email: v }))} placeholder="e.g. sarah@email.com" keyboardType="email-address" />
        <Text style={styles.roleLabel}>Role</Text>
        <View style={styles.roleRow}>
          {['client', 'trainer', 'admin'].map(r => (
            <TouchableOpacity
              key={r} onPress={() => setForm(p => ({ ...p, role: r }))}
              style={[styles.roleChip, form.role === r && styles.roleChipActive]}
            >
              <Text style={[styles.roleChipText, form.role === r && styles.roleChipTextActive]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionModal>

      {/* ── Profile Modal ────────────────────────────────────────────────── */}
      <ActionModal
        visible={profileModal}
        title="Client Profile"
        onClose={() => setProfileModal(false)}
      >
        {selectedClient && (
          <View style={{ paddingBottom: 16 }}>
            <View style={styles.profileHero}>
              <View style={[styles.avatarPlaceholder, { width: 64, height: 64, borderRadius: 20 }]}>
                <Text style={[styles.avatarLetter, { fontSize: 26 }]}>{selectedClient.name?.[0]?.toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{selectedClient.name}</Text>
                <Text style={styles.profileEmail}>{selectedClient.email}</Text>
                <View style={styles.rolePill}>
                  <Text style={styles.rolePillText}>{selectedClient.role?.toUpperCase()}</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileGrid}>
              <View style={styles.profileBox}>
                <Text style={styles.profileBoxLabel}>Member Since</Text>
                <Text style={styles.profileBoxValue}>
                  {new Date(selectedClient.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
              </View>
              <View style={styles.profileBox}>
                <Text style={styles.profileBoxLabel}>Membership</Text>
                <Text style={[styles.profileBoxValue, { color: selectedClient.membership?.status === 'active' ? colors.statusActive : colors.error }]}>
                  {selectedClient.membership?.status?.toUpperCase() || 'None'}
                </Text>
              </View>
              <View style={styles.profileBox}>
                <Text style={styles.profileBoxLabel}>Health Records</Text>
                <Text style={styles.profileBoxValue}>{selectedClient.healthMetrics?.length ?? 0}</Text>
              </View>
              <View style={styles.profileBox}>
                <Text style={styles.profileBoxLabel}>Nutrition Logs</Text>
                <Text style={styles.profileBoxValue}>{selectedClient.nutritionLogs?.length ?? 0}</Text>
              </View>
            </View>
          </View>
        )}
      </ActionModal>

      {/* ── Membership Modal ─────────────────────────────────────────────── */}
      <ActionModal
        visible={memModal}
        title={selectedClient?.membership ? 'Update Membership' : 'Add Membership'}
        onClose={() => setMemModal(false)}
        onSubmit={handleMembershipSubmit}
        loading={memLoading}
      >
        <FormInput
          label="Start Date (YYYY-MM-DD)"
          value={memForm.start_date}
          onChangeText={(v) => setMemForm(p => ({ ...p, start_date: v }))}
          placeholder="2026-01-01"
        />
        <FormInput
          label="End Date (YYYY-MM-DD)"
          value={memForm.end_date}
          onChangeText={(v) => setMemForm(p => ({ ...p, end_date: v }))}
          placeholder="2026-12-31"
        />
        <Text style={styles.roleLabel}>Status</Text>
        <View style={styles.roleRow}>
          {['active', 'frozen', 'expired'].map(s => (
            <TouchableOpacity
              key={s} onPress={() => setMemForm(p => ({ ...p, status: s }))}
              style={[styles.roleChip, memForm.status === s && styles.roleChipActive]}
            >
              <Text style={[styles.roleChipText, memForm.status === s && styles.roleChipTextActive]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ActionModal>

      {/* ── Delete Confirm ───────────────────────────────────────────────── */}
      <ConfirmDialog
        visible={deleteDialog}
        title="Remove Client?"
        message={`Are you sure you want to remove "${deleteTarget?.name}"? This will delete all their data.`}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteDialog(false); setDeleteTarget(null); }}
        loading={deleteLoading}
      />

      {/* ── AI Workout Modal ─────────────────────────────────────────────── */}
      <Modal visible={aiWorkoutModal} transparent animationType="slide" onRequestClose={() => setAiWorkoutModal(false)}>
        <View style={styles.aiModalOverlay}>
          <View style={styles.aiModalSheet}>
            <View style={styles.aiModalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={18} color={colors.accent} />
                <Text style={styles.aiModalTitle}>AI Workout Plan</Text>
              </View>
              <TouchableOpacity onPress={() => setAiWorkoutModal(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {aiWorkoutClient && <Text style={styles.aiModalSub}>Generated for {aiWorkoutClient.name}</Text>}
            {aiWorkoutLoading ? (
              <View style={{ alignItems: 'center', paddingVertical: 32, gap: 12 }}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>Gemini is generating a plan…</Text>
              </View>
            ) : aiWorkoutResult?.error ? (
              <Text style={{ color: colors.error, padding: 16, fontSize: 13 }}>{aiWorkoutResult.error}</Text>
            ) : aiWorkoutResult ? (
              <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                {aiWorkoutResult.rationale && (
                  <Text style={styles.aiRationale}>{aiWorkoutResult.rationale}</Text>
                )}
                {(aiWorkoutResult.plan || []).map((ex, i) => (
                  <View key={i} style={styles.aiExRow}>
                    <View style={styles.aiExNum}><Text style={styles.aiExNumText}>{i + 1}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aiExName}>{ex.name || ex.exercise}</Text>
                      {ex.sets && <Text style={styles.aiExDetail}>{ex.sets} sets × {ex.reps} reps{ex.rest ? ` · ${ex.rest} rest` : ''}</Text>}
                      {ex.notes && <Text style={styles.aiExNote}>{ex.notes}</Text>}
                    </View>
                  </View>
                ))}
                {aiWorkoutResult.difficulty && (
                  <View style={styles.difficultyPill}>
                    <Ionicons name="barbell-outline" size={13} color={colors.accent} />
                    <Text style={styles.difficultyText}>Difficulty: {aiWorkoutResult.difficulty}</Text>
                  </View>
                )}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },

  searchCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginTop: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  searchRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, borderWidth: 1, borderColor: colors.border },
  searchInput:{ flex: 1, fontSize: 14, color: colors.heading, fontWeight: '400' },

  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: colors.surfaceContainerHigh, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  chipActive:       { backgroundColor: colors.accentDim, borderColor: colors.accent },
  chipText:         { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive:   { color: colors.accent },
  chipCount:        { minWidth: 20, height: 20, borderRadius: 7, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  chipCountActive:  { backgroundColor: 'rgba(232,232,64,0.2)' },
  chipCountText:    { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  chipCountTextActive: { color: colors.accent },

  summaryRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryText:   { fontSize: 13, color: colors.textMuted },
  addClientBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addClientText: { fontSize: 12, fontWeight: '700', color: colors.onPrimary },

  loadingCenter: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  loadingText:   { color: colors.textMuted, fontSize: 14 },

  clientCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },

  avatarPlaceholder: { width: 58, height: 58, borderRadius: 17, backgroundColor: colors.accentDim, borderWidth: 2, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarLetter:      { fontSize: 22, fontWeight: '800', color: colors.accent },

  clientName: { fontSize: 17, fontWeight: '700', color: colors.heading, marginBottom: 2 },
  clientGoal: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  clientRole: { fontSize: 10, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.5, marginTop: 2 },

  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontSize: 11, fontWeight: '700', textTransform: 'capitalize', letterSpacing: 0.4 },

  infoGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  infoBox:  { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.border },
  infoLabel:{ fontSize: 10, color: colors.textMuted, fontWeight: '500', marginBottom: 4 },
  infoValue:{ fontSize: 14, fontWeight: '700', color: colors.heading },

  membershipRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 10 },
  membershipText:  { flex: 1, fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  progressRingSmall: {},

  actionRow:       { flexDirection: 'row', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.border },
  actionBtnText:   { fontSize: 12, fontWeight: '600', color: colors.textBody },
  actionBtnDanger: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.errorContainer, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(244,67,54,0.2)' },

  emptyState:   { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText:    { color: colors.textMuted, fontSize: 15, fontWeight: '500' },
  emptyAddBtn:  { backgroundColor: colors.accent, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 12 },
  emptyAddText: { color: colors.onPrimary, fontWeight: '700', fontSize: 13 },

  // Modal styles
  profileHero:       { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  profileName:       { fontSize: 18, fontWeight: '800', color: colors.heading },
  profileEmail:      { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  rolePill:          { backgroundColor: colors.accentDim, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, alignSelf: 'flex-start', marginTop: 6, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  rolePillText:      { fontSize: 10, fontWeight: '700', color: colors.accent },
  profileGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  profileBox:        { backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 14, width: '47%', borderWidth: 1, borderColor: colors.border },
  profileBoxLabel:   { fontSize: 10, color: colors.textMuted, fontWeight: '500', marginBottom: 4 },
  profileBoxValue:   { fontSize: 15, fontWeight: '700', color: colors.heading },

  roleLabel:         { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  roleRow:           { flexDirection: 'row', gap: 8, marginBottom: 14 },
  roleChip:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.border },
  roleChipActive:    { backgroundColor: colors.accentDim, borderColor: colors.accent },
  roleChipText:      { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  roleChipTextActive:{ color: colors.accent },

  // AI Risk
  riskBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100 },
  riskDot:       { width: 6, height: 6, borderRadius: 3 },
  riskBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  // AI Workout Modal
  aiModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  aiModalSheet:   { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 40, borderWidth: 1, borderColor: colors.border },
  aiModalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  aiModalTitle:   { fontSize: 16, fontWeight: '800', color: colors.heading },
  aiModalSub:     { fontSize: 12, color: colors.textMuted, marginBottom: 16 },
  aiRationale:    { fontSize: 13, color: colors.textBody, lineHeight: 20, marginBottom: 14, fontStyle: 'italic', padding: 12, backgroundColor: colors.surfaceContainerLow, borderRadius: 12 },
  aiExRow:        { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  aiExNum:        { width: 26, height: 26, borderRadius: 8, backgroundColor: colors.accentDim, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aiExNumText:    { fontSize: 11, fontWeight: '800', color: colors.accent },
  aiExName:       { fontSize: 14, fontWeight: '700', color: colors.heading },
  aiExDetail:     { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  aiExNote:       { fontSize: 11, color: colors.textMuted, marginTop: 2, fontStyle: 'italic' },
  difficultyPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accentDim, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, alignSelf: 'flex-start', marginTop: 12 },
  difficultyText: { fontSize: 13, fontWeight: '700', color: colors.accent },
});
