import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, Switch, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { clientProfileData } from '../data/mockData';

const TRAINER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAm37DPOHI_VUx0H7l0si5s7NPC2jMsEIJdQTKYlo-pghDn8EDMLtrSADgEjiBXSJgBY5RJ9kWUPQvUewBlb27dYiwnZThnj5JNPFl3zWoGj9Xk6KJrWt_UOxEAkUlBg8uvApGSng3KGvNXTFXE9q0TVqBE5c0w53lh14jL_TcnhjZyFjNQmyx5Lz7SlTveTWaiBNkCvWs_PWGFrb2AeVR6Qjj80emAnsHjTAFMrIjPMnv6GAdOHWzJVyVTDTBWfjD3w-9-SalUJ9c';

function SettingRow({ icon, label, value, toggle, onToggle, danger, color }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={toggle ? 1 : 0.7}>
      <View style={[styles.settingIcon, { backgroundColor: color ? `${color}15` : colors.surfaceContainerHigh }]}>
        <Ionicons name={icon} size={17} color={color || colors.textSecondary} />
      </View>
      <Text style={[styles.settingLabel, danger && { color: colors.error }]}>{label}</Text>
      <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
        {toggle ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={value ? colors.onPrimary : colors.textSecondary}
          />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {value ? <Text style={[styles.settingValue, danger && { color: colors.error }]}>{value}</Text> : null}
            {!danger && <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function SectionCard({ title, children }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [aiInsights,    setAiInsights]    = useState(true);
  const [darkMode,      setDarkMode]      = useState(true);
  const [emailAlerts,   setEmailAlerts]   = useState(false);

  const { membership, activityTimeline } = clientProfileData;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 64 }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Profile Hero ─────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1E1E10', '#111108', '#0A0A12']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroGlow} />
        <View style={styles.heroTop}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: TRAINER_AVATAR }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={13} color={colors.onPrimary} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroName}>Coach Alex Rivera</Text>
            <Text style={styles.heroRole}>Certified Personal Trainer</Text>
            <View style={styles.heroBadge}>
              <Ionicons name="star" size={11} color={colors.accent} />
              <Text style={styles.heroBadgeText}>Pro Trainer · 7 Years</Text>
            </View>
          </View>
        </View>

        {/* Hero stats */}
        <View style={styles.heroStats}>
          {[
            { label: 'Clients',  value: '24'  },
            { label: 'Sessions', value: '312' },
            { label: 'Rating',   value: '4.9★'},
          ].map((s, i) => (
            <View key={s.label} style={[styles.heroStat, i < 2 && styles.heroStatBorder]}>
              <Text style={styles.heroStatValue}>{s.value}</Text>
              <Text style={styles.heroStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <View style={styles.quickActions}>
        {[
          { icon: 'calendar-outline', label: 'Schedule', color: colors.accent },
          { icon: 'document-text-outline', label: 'Reports', color: colors.accentSecondary },
          { icon: 'medal-outline', label: 'Achievements', color: colors.statusActive },
          { icon: 'share-social-outline', label: 'Share', color: '#9C88FF' },
        ].map((a) => (
          <TouchableOpacity key={a.label} style={styles.quickAction} activeOpacity={0.8}>
            <View style={[styles.quickActionIcon, { backgroundColor: `${a.color}15` }]}>
              <Ionicons name={a.icon} size={19} color={a.color} />
            </View>
            <Text style={styles.quickActionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Membership Details ─────────────────────────────────────────────── */}
      <SectionCard title="Membership Details">
        <View style={styles.membershipGrid}>
          {[
            { label: 'Type',   value: membership.type,    icon: 'card' },
            { label: 'Start',  value: membership.startDate, icon: 'calendar' },
            { label: 'Expiry', value: membership.endDate,   icon: 'time' },
            { label: 'Status', value: membership.status,    icon: 'checkmark-circle', valueColor: colors.statusActive },
          ].map((m) => (
            <View key={m.label} style={styles.memBox}>
              <Ionicons name={m.icon} size={15} color={colors.textMuted} style={{ marginBottom: 4 }} />
              <Text style={styles.memLabel}>{m.label}</Text>
              <Text style={[styles.memValue, m.valueColor && { color: m.valueColor }]}>{m.value}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* ── Trainer Info (editable-style) ─────────────────────────────────── */}
      <SectionCard title="Personal Information">
        {[
          { label: 'Full Name',     value: 'Alex Rivera',              icon: 'person-outline',    color: colors.accent },
          { label: 'Email',         value: 'alex@zenith.ai',           icon: 'mail-outline',      color: colors.accentSecondary },
          { label: 'Phone',         value: '+91 98765 43210',          icon: 'call-outline',      color: colors.statusActive },
          { label: 'Address',       value: 'Mumbai, Maharashtra',       icon: 'location-outline',  color: '#FF9800' },
        ].map((f) => (
          <SettingRow key={f.label} icon={f.icon} label={f.label} value={f.value} color={f.color} />
        ))}
      </SectionCard>

      {/* ── Activity Timeline ─────────────────────────────────────────────── */}
      <SectionCard title="Activity Timeline">
        {activityTimeline.map((ev, i) => (
          <View key={ev.id} style={styles.timelineRow}>
            {/* Connector line */}
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineIcon, { backgroundColor: `${ev.color}18`, borderColor: `${ev.color}40` }]}>
                <Ionicons name={ev.icon} size={14} color={ev.color} />
              </View>
              {i < activityTimeline.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineEvent}>{ev.event}</Text>
              <Text style={styles.timelineDate}>{ev.date}</Text>
            </View>
          </View>
        ))}
      </SectionCard>

      {/* ── Preferences ───────────────────────────────────────────────────── */}
      <SectionCard title="Preferences">
        <SettingRow icon="notifications-outline" label="Push Notifications" toggle value={notifications} onToggle={setNotifications} color={colors.accent} />
        <SettingRow icon="sparkles-outline"      label="AI Insights"        toggle value={aiInsights}    onToggle={setAiInsights}    color={colors.accentSecondary} />
        <SettingRow icon="moon-outline"           label="Dark Mode"          toggle value={darkMode}      onToggle={setDarkMode}      color={colors.textSecondary} />
        <SettingRow icon="mail-outline"           label="Email Alerts"       toggle value={emailAlerts}   onToggle={setEmailAlerts}   color="#FF9800" />
        <SettingRow icon="color-palette-outline"  label="Theme"              value="Dark"               color="#9C88FF" />
        <SettingRow icon="language-outline"       label="Language"           value="English"            color={colors.textSecondary} />
      </SectionCard>

      {/* ── Change Password ───────────────────────────────────────────────── */}
      <SectionCard title="Change Password">
        {['Current Password', 'New Password', 'Confirm Password'].map((ph, i) => (
          <View key={ph} style={styles.passwordInput}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
            <TextInput
              style={styles.passwordField}
              placeholder={ph}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
            <Ionicons name="eye-outline" size={16} color={colors.textMuted} />
          </View>
        ))}
        <TouchableOpacity style={styles.changePwBtn} activeOpacity={0.8}>
          <Text style={styles.changePwText}>Update Password</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* ── Account ───────────────────────────────────────────────────────── */}
      <SectionCard title="Account">
        <SettingRow icon="shield-checkmark-outline" label="Privacy & Security"      color={colors.accentSecondary} />
        <SettingRow icon="card-outline"             label="Billing & Subscription" value="Pro Plan" color={colors.accent} />
        <SettingRow icon="help-circle-outline"      label="Help Center"            color={colors.textSecondary} />
        <SettingRow icon="chatbubble-outline"       label="Contact Support"        color={colors.textSecondary} />
        <SettingRow icon="information-circle-outline" label="About Zenith AI" value="v2.4.1" color={colors.textMuted} />
      </SectionCard>

      {/* ── Sign Out ──────────────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={19} color={colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Zenith AI · v2.4.1 · Build 260626</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 14 },

  // Hero
  hero:         { borderRadius: 22, padding: 22, marginTop: 14, marginBottom: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(232,232,64,0.12)' },
  heroGlow:     { position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(232,232,64,0.05)' },
  heroTop:      { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 22 },
  avatarWrap:   { position: 'relative' },
  avatar:       { width: 76, height: 76, borderRadius: 22, borderWidth: 2.5, borderColor: colors.accent },
  cameraBtn:    { position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, borderRadius: 9, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  heroName:     { fontSize: 20, fontWeight: '800', color: colors.heading, letterSpacing: -0.3 },
  heroRole:     { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  heroBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.accentDim, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100, marginTop: 8, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)' },
  heroBadgeText:{ fontSize: 11, color: colors.accent, fontWeight: '600' },

  heroStats:      { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  heroStat:       { flex: 1, alignItems: 'center', paddingVertical: 12 },
  heroStatBorder: { borderRightWidth: 1, borderRightColor: colors.border },
  heroStatValue:  { fontSize: 20, fontWeight: '800', color: colors.heading },
  heroStatLabel:  { fontSize: 11, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },

  // Quick actions
  quickActions:    { flexDirection: 'row', gap: 10, marginBottom: 18 },
  quickAction:     { flex: 1, alignItems: 'center', gap: 7, backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.border },
  quickActionIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel:{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  // Section card
  sectionCard:      { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  sectionCardTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, paddingHorizontal: 2 },

  // Setting row
  settingRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingIcon:  { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '500', color: colors.textBody, flex: 1 },
  settingValue: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },

  // Membership grid
  membershipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  memBox:  { backgroundColor: colors.surfaceContainerLow, borderRadius: 14, padding: 14, width: '47%', borderWidth: 1, borderColor: colors.border },
  memLabel:{ fontSize: 11, color: colors.textMuted, fontWeight: '500', marginBottom: 4 },
  memValue:{ fontSize: 14, fontWeight: '700', color: colors.heading },

  // Timeline
  timelineRow:    { flexDirection: 'row', gap: 14, paddingBottom: 4 },
  timelineLeft:   { alignItems: 'center', width: 32 },
  timelineIcon:   { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  timelineLine:   { width: 1.5, flex: 1, backgroundColor: colors.border, marginVertical: 4, minHeight: 20 },
  timelineContent:{ flex: 1, paddingBottom: 16 },
  timelineEvent:  { fontSize: 13, fontWeight: '600', color: colors.textBody },
  timelineDate:   { fontSize: 11, color: colors.textMuted, marginTop: 3 },

  // Password fields
  passwordInput: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  passwordField: { flex: 1, fontSize: 14, color: colors.heading, fontWeight: '400' },
  changePwBtn:   { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  changePwText:  { color: colors.onPrimary, fontWeight: '700', fontSize: 14 },

  // Logout
  logoutBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.errorContainer, borderRadius: 16, paddingVertical: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(244,67,54,0.2)' },
  logoutText:  { fontSize: 16, fontWeight: '700', color: colors.error },

  versionText: { textAlign: 'center', fontSize: 11, color: colors.textMuted, marginBottom: 8 },
});
