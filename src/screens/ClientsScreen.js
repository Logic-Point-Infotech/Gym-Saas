import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, TextInput, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Svg, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { clientsData } from '../data/mockData';

// ─── Small progress ring ──────────────────────────────────────────────────────
function ProgressRing({ progress, size = 60 }) {
  const sw = 5;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.border} strokeWidth={sw} />
        <Circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.accent}
          strokeWidth={sw} strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ - (progress/100)*circ}
          strokeLinecap="round" rotation="-90" origin={`${size/2}, ${size/2}`} />
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
  const config = {
    Active:    { color: colors.statusActive,    bg: colors.statusActiveBg    },
    Inactive:  { color: colors.statusInactive,  bg: colors.statusInactiveBg  },
    Suspended: { color: colors.statusSuspended, bg: colors.statusSuspendedBg },
  }[status] || { color: colors.textSecondary, bg: colors.surfaceContainerHigh };

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: config.color }]} />
      <Text style={[styles.statusText, { color: config.color }]}>{status}</Text>
    </View>
  );
}

// ─── Client Card ─────────────────────────────────────────────────────────────
function ClientCard({ client }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.clientCard, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={onIn} onPressOut={onOut}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image source={{ uri: client.avatar }} style={styles.clientAvatar} />
            <View>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={styles.clientGoal}>{client.goal}</Text>
              {client.alert && (
                <View style={styles.alertPill}>
                  <Ionicons name="warning" size={10} color={colors.statusAlert} />
                  <Text style={styles.alertPillText}>Needs Attention</Text>
                </View>
              )}
            </View>
          </View>
          <StatusBadge status={client.status} />
        </View>

        {/* Body info grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{client.age} yrs</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{client.weight}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{client.height}</Text>
          </View>
          <View style={[styles.infoBox, { alignItems: 'center', justifyContent: 'center' }]}>
            <ProgressRing progress={client.progress} />
          </View>
        </View>

        {/* BMI row */}
        <View style={styles.bmiRow}>
          <View style={styles.bmiPill}>
            <Text style={styles.bmiLabel}>BMI </Text>
            <Text style={[styles.bmiValue, { color: client.bmiColor }]}>
              {client.bmi} · {client.bmiLabel}
            </Text>
          </View>
        </View>

        {/* Membership row */}
        <View style={styles.membershipRow}>
          <Ionicons name="card-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.membershipText}>
            {client.membershipType} · Expires {client.membershipExpiry}
          </Text>
          <View style={[
            styles.memStatusBadge,
            { backgroundColor: client.membershipStatus === 'Active' ? colors.statusActiveBg : colors.statusSuspendedBg },
          ]}>
            <Text style={[
              styles.memStatusText,
              { color: client.membershipStatus === 'Active' ? colors.statusActive : colors.statusSuspended },
            ]}>
              {client.membershipStatus}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Ionicons name="person-outline" size={15} color={colors.textBody} />
            <Text style={styles.actionBtnText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Ionicons name="nutrition-outline" size={15} color={colors.textBody} />
            <Text style={styles.actionBtnText}>Diet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnPrimary} activeOpacity={0.8}>
            <Ionicons name="barbell-outline" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const FILTERS = ['All', 'Active', 'Inactive', 'Suspended'];

export default function ClientsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = clientsData.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.goal.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 64 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Search + filters */}
      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={17} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients by name or goal…"
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
            const countForFilter = f === 'All'
              ? clientsData.length
              : clientsData.filter(c => c.status === f).length;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {f}
                </Text>
                <View style={[styles.chipCount, isActive && styles.chipCountActive]}>
                  <Text style={[styles.chipCountText, isActive && styles.chipCountTextActive]}>
                    {countForFilter}
                  </Text>
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
        <TouchableOpacity style={styles.sortBtn} activeOpacity={0.7}>
          <Ionicons name="swap-vertical-outline" size={15} color={colors.textSecondary} />
          <Text style={styles.sortText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={{ gap: 14 }}>
        {filtered.map((c) => <ClientCard key={c.id} client={c} />)}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={44} color={colors.textMuted} />
            <Text style={styles.emptyText}>No clients found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },

  // Search
  searchCard: { backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginTop: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  searchRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, borderWidth: 1, borderColor: colors.border },
  searchInput:{ flex: 1, fontSize: 14, color: colors.heading, fontWeight: '400' },

  // Filter chips
  chip:             { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: colors.surfaceContainerHigh, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  chipActive:       { backgroundColor: colors.accentDim, borderColor: colors.accent },
  chipText:         { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive:   { color: colors.accent },
  chipCount:        { minWidth: 20, height: 20, borderRadius: 7, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  chipCountActive:  { backgroundColor: 'rgba(232,232,64,0.2)' },
  chipCountText:    { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
  chipCountTextActive: { color: colors.accent },

  // Summary
  summaryRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryText: { fontSize: 13, color: colors.textMuted },
  sortBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, borderWidth: 1, borderColor: colors.border },
  sortText:    { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },

  // Client card
  clientCard: { backgroundColor: colors.surface, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  clientAvatar:{ width: 58, height: 58, borderRadius: 17, backgroundColor: colors.border, borderWidth: 2, borderColor: colors.border },
  clientName: { fontSize: 17, fontWeight: '700', color: colors.heading, marginBottom: 2 },
  clientGoal: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  alertPill:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.statusAlertBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100, marginTop: 5 },
  alertPillText: { fontSize: 10, color: colors.statusAlert, fontWeight: '700' },

  // Status badge
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusText:  { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },

  // Info grid
  infoGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  infoBox:  { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, padding: 10, justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  infoLabel:{ fontSize: 10, color: colors.textMuted, fontWeight: '500', marginBottom: 4 },
  infoValue:{ fontSize: 14, fontWeight: '700', color: colors.heading },

  // BMI
  bmiRow:  { marginBottom: 10 },
  bmiPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainerLow, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 100, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border },
  bmiLabel:{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  bmiValue:{ fontSize: 12, fontWeight: '700' },

  // Membership
  membershipRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 10 },
  membershipText:  { flex: 1, fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  memStatusBadge:  { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100 },
  memStatusText:   { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },

  // Actions
  actionRow:       { flexDirection: 'row', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.border },
  actionBtnText:   { fontSize: 13, fontWeight: '600', color: colors.textBody },
  actionBtnPrimary:{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText:  { color: colors.textMuted, fontSize: 15, fontWeight: '500' },
});
