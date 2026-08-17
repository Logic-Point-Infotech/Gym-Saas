import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, Switch, TextInput,
  ActivityIndicator, Modal, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { clientProfileData } from '../data/mockData';
import { usersApi, membershipsApi, healthApi, aiApi } from '../services/api';
import { Toast, ConfirmDialog } from '../components/UIKit';

const TRAINER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAm37DPOHI_VUx0H7l0si5s7NPC2jMsEIJdQTKYlo-pghDn8EDMLtrSADgEjiBXSJgBY5RJ9kWUPQvUewBlb27dYiwnZThnj5JNPFl3zWoGj9Xk6KJrWt_UOxEAkUlBg8uvApGSng3KGvNXTFXE9q0TVqBE5c0w53lh14jL_TcnhjZyFjNQmyx5Lz7SlTveTWaiBNkCvWs_PWGFrb2AeVR6Qjj80emAnsHjTAFMrIjPMnv6GAdOHWzJVyVTDTBWfjD3w-9-SalUJ9c';

function SettingRow({ icon, label, value, toggle, onToggle, danger, color, onPress }) {
  return (
    <TouchableOpacity style={styles.settingRow} activeOpacity={toggle ? 1 : 0.7} onPress={onPress}>
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

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ visible: true, message, type });

  // AI Chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: '👋 Hi Coach Alex! I\'m your AI trainer assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  const QUICK_PROMPTS = [
    'Show at-risk clients',
    'Summarise today\'s sessions',
    'Suggest a meal plan',
    'Best workout for fat loss',
  ];

  const sendChat = useCallback(async (messageText) => {
    const text = messageText || chatInput.trim();
    if (!text) return;
    const newMsg = { role: 'user', text };
    const history = chatMessages.filter(m => m.role !== 'typing');
    setChatMessages(prev => [...prev, newMsg, { role: 'typing', text: '...' }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await aiApi.chat(text, history.map(m => ({ role: m.role, text: m.text })));
      const reply = res?.data?.reply || 'I couldn\'t process that request.';
      setChatMessages(prev => [
        ...prev.filter(m => m.role !== 'typing'),
        { role: 'assistant', text: reply },
      ]);
    } catch (e) {
      setChatMessages(prev => [
        ...prev.filter(m => m.role !== 'typing'),
        { role: 'assistant', text: 'Backend offline. Please check your connection and try again.' },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatInput, chatMessages]);

  const { membership, activityTimeline } = clientProfileData;

  // ─── Quick action handlers ─────────────────────────────────────────
  const quickActions = [
    {
      icon: 'calendar-outline', label: 'Schedule', color: colors.accent,
      onPress: async () => {
        showToast('Loading schedule…', 'info');
        try {
          const res = await usersApi.getAll('trainer');
          showToast(`${res.count} trainers available for scheduling`);
        } catch { showToast('Failed to load schedule', 'error'); }
      },
    },
    {
      icon: 'document-text-outline', label: 'Reports', color: colors.accentSecondary,
      onPress: async () => {
        showToast('Generating reports…', 'info');
        try {
          const res = await healthApi.getAll();
          showToast(`Report ready: ${res.count} health records`);
        } catch { showToast('Failed to generate report', 'error'); }
      },
    },
    {
      icon: 'medal-outline', label: 'Achievements', color: colors.statusActive,
      onPress: async () => {
        showToast('Loading achievements…', 'info');
        try {
          const res = await membershipsApi.getAll('active');
          showToast(`${res.count} active memberships achieved!`);
        } catch { showToast('Failed to load achievements', 'error'); }
      },
    },
    {
      icon: 'share-social-outline', label: 'Share', color: '#9C88FF',
      onPress: () => showToast('Sharing profile link… (coming soon)'),
    },
  ];

  const handleUpdatePassword = async () => {
    if (!pw.current || !pw.next || !pw.confirm) {
      showToast('All password fields are required', 'error'); return;
    }
    if (pw.next !== pw.confirm) {
      showToast('New passwords do not match', 'error'); return;
    }
    if (pw.next.length < 6) {
      showToast('Password must be at least 6 characters', 'error'); return;
    }
    setPwLoading(true);
    try {
      // In production, call a real /api/auth/password endpoint
      await new Promise(r => setTimeout(r, 800)); // simulate API call
      showToast('Password updated successfully!');
      setPw({ current: '', next: '', confirm: '' });
    } catch (e) {
      showToast('Password update failed', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = () => {
    setLogoutDialog(false);
    showToast('Signed out successfully');
  };

  const handleSettingPress = (label) => {
    showToast(`Opening ${label}…`, 'info');
  };

  return (
    <View style={{ flex: 1 }}>
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

      {/* ── Quick Actions ──────────────────────────────────────────────────────── */}
      <View style={styles.quickActions}>
        {quickActions.map((a) => (
          <TouchableOpacity key={a.label} style={styles.quickAction} activeOpacity={0.8} onPress={a.onPress}>
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

      {/* ── Change Password ─────────────────────────────────────────────────── */}
      <SectionCard title="Change Password">
        {[
          { ph: 'Current Password', key: 'current' },
          { ph: 'New Password', key: 'next' },
          { ph: 'Confirm Password', key: 'confirm' },
        ].map(({ ph, key }) => (
          <View key={ph} style={styles.passwordInput}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
            <TextInput
              style={styles.passwordField}
              placeholder={ph}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={pw[key]}
              onChangeText={(v) => setPw(p => ({ ...p, [key]: v }))}
            />
            <Ionicons name="eye-outline" size={16} color={colors.textMuted} />
          </View>
        ))}
        <TouchableOpacity style={styles.changePwBtn} activeOpacity={0.8} onPress={handleUpdatePassword} disabled={pwLoading}>
          {pwLoading
            ? <ActivityIndicator size="small" color={colors.onPrimary} />
            : <Text style={styles.changePwText}>Update Password</Text>}
        </TouchableOpacity>
      </SectionCard>

      {/* ── Account ───────────────────────────────────────────────────────── */}
      <SectionCard title="Account">
        <SettingRow icon="shield-checkmark-outline" label="Privacy & Security" color={colors.accentSecondary} onPress={() => handleSettingPress('Privacy')} />
        <SettingRow icon="card-outline" label="Billing & Subscription" value="Pro Plan" color={colors.accent} onPress={() => handleSettingPress('Billing')} />
        <SettingRow icon="help-circle-outline" label="Help Center" color={colors.textSecondary} onPress={() => handleSettingPress('Help')} />
        <SettingRow icon="chatbubble-outline" label="Contact Support" color={colors.textSecondary} onPress={() => handleSettingPress('Support')} />
        <SettingRow icon="information-circle-outline" label="About Zenith AI" value="v2.4.1" color={colors.textMuted} onPress={() => showToast('Zenith AI v2.4.1 — Built with ❤️')} />
      </SectionCard>

      {/* ── Sign Out ───────────────────────────────────────────────────────── */}
      <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={() => setLogoutDialog(true)}>
        <Ionicons name="log-out-outline" size={19} color={colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Zenith AI · v2.4.1 · Build 260626</Text>
    </ScrollView>

    <ConfirmDialog
      visible={logoutDialog}
      title="Sign Out?"
      message="Are you sure you want to sign out of Zenith AI?"
      onConfirm={handleLogout}
      onCancel={() => setLogoutDialog(false)}
    />
    <Toast {...toast} onHide={() => setToast(t => ({ ...t, visible: false }))} />

    {/* ── Floating AI Chat Button ────────────────────────────────────────── */}
    <TouchableOpacity style={styles.chatFab} onPress={() => setChatOpen(true)} activeOpacity={0.9}>
      <LinearGradient colors={[colors.accent, '#B8D700']} style={styles.chatFabGradient}>
        <Ionicons name="chatbubble-ellipses" size={22} color={colors.onPrimary} />
      </LinearGradient>
    </TouchableOpacity>

    {/* ── AI Chatbot Modal ─────────────────────────────────────────────────── */}
    <Modal visible={chatOpen} transparent animationType="slide" onRequestClose={() => setChatOpen(false)}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.chatOverlay}>
          <View style={styles.chatSheet}>
            {/* Header */}
            <View style={styles.chatHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <LinearGradient colors={[colors.accent, '#B8D700']} style={styles.chatAvatarGradient}>
                  <Ionicons name="sparkles" size={18} color={colors.onPrimary} />
                </LinearGradient>
                <View>
                  <Text style={styles.chatTitle}>AI Trainer Assistant</Text>
                  <Text style={styles.chatSubtitle}>Powered by Gemini</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setChatOpen(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Quick prompts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptsRow}>
              {QUICK_PROMPTS.map((p) => (
                <TouchableOpacity key={p} style={styles.quickChip} onPress={() => sendChat(p)} disabled={chatLoading}>
                  <Text style={styles.quickChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Messages */}
            <ScrollView
              ref={chatScrollRef}
              style={styles.chatMessages}
              contentContainerStyle={{ paddingVertical: 10 }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
            >
              {chatMessages.map((msg, i) => (
                <View
                  key={i}
                  style={[
                    styles.chatBubbleWrap,
                    msg.role === 'user' && { alignItems: 'flex-end' },
                  ]}
                >
                  <View style={[
                    styles.chatBubble,
                    msg.role === 'user'
                      ? styles.chatBubbleUser
                      : msg.role === 'typing'
                        ? styles.chatBubbleTyping
                        : styles.chatBubbleAI,
                  ]}>
                    {msg.role === 'typing'
                      ? <ActivityIndicator size="small" color={colors.textMuted} />
                      : <Text style={[styles.chatBubbleText, msg.role === 'user' && { color: colors.onPrimary }]}>{msg.text}</Text>
                    }
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Input */}
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask anything about your clients…"
                placeholderTextColor={colors.textMuted}
                multiline
                editable={!chatLoading}
              />
              <TouchableOpacity
                style={[styles.chatSendBtn, (!chatInput.trim() || chatLoading) && { opacity: 0.5 }]}
                onPress={() => sendChat()}
                disabled={!chatInput.trim() || chatLoading}
              >
                {chatLoading
                  ? <ActivityIndicator size="small" color={colors.onPrimary} />
                  : <Ionicons name="send" size={16} color={colors.onPrimary} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
    </View>
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

  // AI Chatbot FAB
  chatFab:          { position: 'absolute', bottom: 110, right: 20, zIndex: 99 },
  chatFabGradient:  { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: colors.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 8 },

  // Chatbot Modal
  chatOverlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  chatSheet:        { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 20, maxHeight: '90%', borderWidth: 1, borderColor: colors.border },
  chatHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  chatAvatarGradient:{ width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  chatTitle:        { fontSize: 15, fontWeight: '800', color: colors.heading },
  chatSubtitle:     { fontSize: 11, color: colors.textMuted },
  quickPromptsRow:  { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  quickChip:        { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.accentDim, marginRight: 8, borderWidth: 1, borderColor: 'rgba(232,232,64,0.2)', alignSelf: 'center', minHeight: 32 },
  quickChipText:    { fontSize: 12, fontWeight: '600', color: colors.accent },
  chatMessages:     { flex: 1, paddingHorizontal: 14, maxHeight: 340 },
  chatBubbleWrap:   { marginBottom: 10, alignItems: 'flex-start' },
  chatBubble:       { maxWidth: '82%', borderRadius: 16, padding: 12 },
  chatBubbleAI:     { backgroundColor: colors.surfaceContainerLow, borderWidth: 1, borderColor: colors.border },
  chatBubbleUser:   { backgroundColor: colors.accent },
  chatBubbleTyping: { backgroundColor: colors.surfaceContainerHigh, paddingVertical: 14, paddingHorizontal: 18 },
  chatBubbleText:   { fontSize: 13, color: colors.textBody, lineHeight: 20 },
  chatInputRow:     { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end' },
  chatInput:        { flex: 1, backgroundColor: colors.surfaceContainerLow, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: colors.heading, borderWidth: 1, borderColor: colors.border, maxHeight: 100 },
  chatSendBtn:      { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
