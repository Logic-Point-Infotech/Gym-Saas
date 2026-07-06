// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';
import { MOCK_USER } from '../utils/mockData';
import ProgressChart from '../components/ProgressChart';

const ProfileScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'analytics'

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => { await AsyncStorage.removeItem('userToken'); navigation.replace('Auth'); } }
    ]);
  };

  const ReportItem = ({ title, date, size }) => (
    <TouchableOpacity
      style={[styles.reportItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => navigation.navigate('HealthReport', { reportTitle: title })}
    >
      <View style={styles.reportMain}>
        <View style={[styles.pdfIcon, { backgroundColor: theme.error + '1A' }]}>
          <Icon name="file-pdf-box" size={24} color={theme.error} />
        </View>
        <View style={styles.reportInfo}>
          <Text style={[styles.reportTitle, { color: theme.heading }]}>{title}</Text>
          <Text style={[styles.reportMeta, { color: theme.textSecondary }]}>Shared on {date} • {size}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={22} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Icon name="menu" size={24} color={theme.primary} />
          <Text style={[styles.appTitle, { color: theme.heading }]}>MacroMate</Text>
          <TouchableOpacity onPress={toggleTheme} style={[styles.avatarSmall, { backgroundColor: theme.surface }]}>
            <Icon name={theme.mode === 'light' ? "weather-night" : "white-balance-sunny"} size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Toggle Switch */}
        <View style={[styles.tabToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'profile' && { backgroundColor: theme.primary }]}
                onPress={() => setActiveTab('profile')}
            >
                <Text style={[styles.tabBtnText, { color: activeTab === 'profile' ? theme.onPrimary : theme.textSecondary }]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'analytics' && { backgroundColor: theme.primary }]}
                onPress={() => setActiveTab('analytics')}
            >
                <Text style={[styles.tabBtnText, { color: activeTab === 'analytics' ? theme.onPrimary : theme.textSecondary }]}>Analytics</Text>
            </TouchableOpacity>
        </View>

        {activeTab === 'profile' ? (
          <>
            {/* Profile Hero */}
            <View style={styles.hero}>
              <View style={[styles.profileImageContainer, { borderColor: theme.primary, backgroundColor: theme.surface }]}>
                <Icon name="account" size={80} color={theme.textSecondary} />
                <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.primary, borderColor: theme.background }]}>
                  <Icon name="pencil" size={14} color={theme.onPrimary} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.userName, { color: theme.heading }]}>{MOCK_USER.name}</Text>
              <View style={[styles.goalBadge, { backgroundColor: theme.primary + '1A' }]}>
                <Icon name="dumbbell" size={14} color={theme.primary} />
                <Text style={[styles.goalText, { color: theme.primary }]}>{MOCK_USER.goal}</Text>
              </View>
            </View>

            {/* Stats Bento */}
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>AGE</Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>{MOCK_USER.age}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>HEIGHT</Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>{MOCK_USER.height}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>WEIGHT</Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>{MOCK_USER.weight}</Text>
              </View>
            </View>

            {/* Membership Card */}
            <View style={[styles.membershipCard, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
              <Icon name="shield-check" size={100} color={theme.primary + '1A'} style={styles.membershipBgIcon} />
              <View style={styles.membershipHeader}>
                <Text style={[styles.membershipType, { color: theme.primary }]}>PLATINUM MEMBER</Text>
                <Icon name="contactless-payment" size={24} color={theme.primary} />
              </View>
              <View style={{ marginTop: 24 }}>
                <Text style={[styles.membershipLabel, { color: theme.textSecondary }]}>MEMBER NAME</Text>
                <Text style={[styles.membershipName, { color: theme.heading }]}>{MOCK_USER.name.toUpperCase()}</Text>
              </View>
              <View style={styles.membershipFooter}>
                <View>
                  <Text style={[styles.membershipLabel, { color: theme.textSecondary }]}>STATUS</Text>
                  <Text style={[styles.membershipValue, { color: theme.heading }]}>ACTIVE UNTIL DEC 2026</Text>
                </View>
                <View style={[styles.activeStatus, { borderColor: theme.primary }]}>
                  <Text style={[styles.statusText, { color: theme.primary }]}>PRO</Text>
                </View>
              </View>
            </View>

            {/* Health Reports Section */}
            <View style={styles.reportsSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.heading }]}>Health Reports</Text>
                <TouchableOpacity
                  style={[styles.addReportBtn, { backgroundColor: theme.primary + '1A' }]}
                  onPress={() => navigation.navigate('HealthReport')}
                >
                  <Icon name="plus-circle" size={18} color={theme.primary} />
                  <Text style={[styles.addReportText, { color: theme.primary }]}>New Report</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reportList}>
                <ReportItem title="Annual Checkup 2024.pdf" date="12 Oct 2024" size="2.4 MB" />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.analyticsSection}>
            <Text style={[styles.sectionTitle, { color: theme.heading }]}>Weight Progress</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Historical data from your logged weigh-ins.</Text>
            <ProgressChart />

            <View style={[styles.summaryStats, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryVal, { color: theme.primary }]}>-7.0 kg</Text>
                    <Text style={[styles.summaryLbl, { color: theme.textSecondary }]}>TOTAL LOST</Text>
                </View>
                <View style={[styles.vDivider, { backgroundColor: theme.border }]} />
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryVal, { color: theme.success }]}>-0.4 kg</Text>
                    <Text style={[styles.summaryLbl, { color: theme.textSecondary }]}>THIS WEEK</Text>
                </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }]}>
            <Icon name="cog" size={20} color={theme.heading} />
            <Text style={[styles.settingsBtnText, { color: theme.heading }]}>Account Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.logoutBtn, { borderColor: theme.error }]} onPress={handleLogout}>
            <Icon name="logout" size={20} color={theme.error} />
            <Text style={[styles.logoutBtnText, { color: theme.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appTitle: { ...FONTS.title, fontWeight: 'bold', flex: 1, marginLeft: 15 },
  avatarSmall: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SIZES.padding },
  tabToggle: { flexDirection: 'row', padding: 4, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnText: { fontSize: 13, fontWeight: 'bold' },
  hero: { alignItems: 'center', marginVertical: 10 },
  profileImageContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  editBtn: { position: 'absolute', bottom: 0, right: 0, padding: 6, borderRadius: 15, borderWidth: 2 },
  userName: { ...FONTS.headlineMobile, marginTop: 12 },
  goalBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  goalText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32, marginTop: 20 },
  statBox: { flex: 1, padding: 16, borderRadius: SIZES.radius, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 10, fontWeight: 'bold' },
  statValue: { ...FONTS.title, fontWeight: 'bold', marginTop: 4 },
  membershipCard: { padding: 24, borderRadius: 20, position: 'relative', overflow: 'hidden', borderWidth: 1 },
  membershipBgIcon: { position: 'absolute', top: -10, right: -10 },
  membershipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  membershipType: { fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  membershipLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  membershipName: { fontWeight: 'bold', marginTop: 4, fontSize: 18 },
  membershipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 },
  membershipValue: { fontWeight: 'bold', fontSize: 13, marginTop: 4 },
  activeStatus: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  reportsSection: { marginTop: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { ...FONTS.title, fontWeight: 'bold' },
  addReportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addReportText: { fontSize: 12, fontWeight: 'bold' },
  reportList: { gap: 12 },
  reportItem: { padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  reportMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pdfIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  reportTitle: { fontSize: 14, fontWeight: 'bold' },
  reportMeta: { fontSize: 10, marginTop: 2 },
  analyticsSection: { marginTop: 10 },
  subtitle: { ...FONTS.bodySmall, marginBottom: 20 },
  summaryStats: { flexDirection: 'row', marginTop: 20, padding: 20, borderRadius: 16, borderWidth: 1 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: 20, fontWeight: 'bold' },
  summaryLbl: { fontSize: 9, fontWeight: 'bold', marginTop: 4 },
  vDivider: { width: 1, height: '80%', alignSelf: 'center' },
  actionGrid: { gap: 12, marginTop: 32 },
  settingsBtn: { height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  settingsBtnText: { fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { height: 56, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  logoutBtnText: { fontWeight: 'bold', fontSize: 16 },
});

export default ProfileScreen;
