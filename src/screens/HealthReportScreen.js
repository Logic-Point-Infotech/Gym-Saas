// src/screens/HealthReportScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { SIZES, SPACING, FONTS } from '../constants/theme';
import { BLOOD_REPORT_INSIGHTS, MOCK_USER } from '../utils/mockData';
import ReportInsightItem from '../components/ReportInsightItem';

const HealthReportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [weight, setWeight] = useState(MOCK_USER.weight.toString());
  const [height, setHeight] = useState(MOCK_USER.height.toString());
  const [bmi, setBmi] = useState('0');

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [reportInsights, setReportInsights] = useState([]);

  const scrollViewRef = useRef(null);

  const historyReports = [
    { id: '1', title: 'Annual Checkup 2024.pdf', date: '12 Oct 2024', size: '2.4 MB' },
    { id: '2', title: 'Blood Test_July.pdf', date: '15 Jul 2024', size: '1.1 MB' },
  ];

  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      setBmi((w / (h * h)).toFixed(1));
    } else {
      setBmi('0');
    }
  };

  const handleSaveBiometrics = async () => {
    try {
      await AsyncStorage.setItem('user_weight', weight);
      await AsyncStorage.setItem('user_height', height);
      Alert.alert('Success', 'Biometrics updated');
    } catch (e) { console.error(e); }
  };

  const handleSelectFile = () => {
    setSelectedFile({ name: 'new_health_analysis.pdf', size: 124000 });
    setUploadSuccess(false);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setReportInsights(BLOOD_REPORT_INSIGHTS);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 2000);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: async () => { await AsyncStorage.removeItem('userToken'); navigation.replace('Auth'); } }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Consistent Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.appTitle, { color: theme.heading }]}>Health Reports</Text>
          <View style={[styles.avatarSmall, { backgroundColor: theme.surface }]}>
            <Icon name="account" size={20} color={theme.textSecondary} />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FEATURE 1: Biometrics Management */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.heading }]}>Body Metrics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>WEIGHT</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>{weight} kg</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>BMI</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>{bmi}</Text>
            </View>
          </View>
          <View style={styles.inputRow}>
            <TextInput style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="Kg" placeholderTextColor={theme.muted} />
            <TextInput style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="Cm" placeholderTextColor={theme.muted} />
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSaveBiometrics}>
              <Icon name="check-bold" size={20} color={theme.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURE 2: AI Blood Report Analysis (Upload Box) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>AI Report Analysis</Text>
          <Icon name="robot" size={18} color={theme.primary} />
        </View>

        <TouchableOpacity
          style={[
            styles.uploadBox,
            { borderColor: theme.border },
            selectedFile && { borderColor: theme.primary, backgroundColor: theme.primary + '1A', borderStyle: 'solid' }
          ]}
          onPress={handleSelectFile}
        >
          {selectedFile ? (
            <View style={styles.fileInfo}>
              <Icon name="file-check" size={40} color={theme.primary} />
              <Text style={[styles.fileName, { color: theme.heading }]}>{selectedFile.name}</Text>
            </View>
          ) : (
            <View style={styles.placeholderInfo}>
              <Icon name="file-upload-outline" size={48} color={theme.muted} />
              <Text style={[styles.uploadText, { color: theme.textSecondary }]}>Tap to select report PDF</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: theme.primary }, !selectedFile && { opacity: 0.5 }]}
          onPress={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <Text style={[styles.uploadButtonText, { color: theme.onPrimary }]}>Start Analysis</Text>
          )}
        </TouchableOpacity>

        {/* AI Results Rendering */}
        {uploadSuccess && (
          <View style={[styles.resultsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.heading, marginBottom: 12 }]}>Report Insights</Text>
            <View style={styles.insightsList}>
              {reportInsights.map(item => <ReportInsightItem key={item.id} item={item} />)}
            </View>
          </View>
        )}

        {/* FEATURE 3: Historical PDF Reports (Exactly as per HTML snippet) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.heading, flex: 1 }]}>Health Reports</Text>
          <TouchableOpacity style={styles.addReportBtn} onPress={handleSelectFile}>
            <Icon name="plus-circle" size={18} color={theme.primary} />
            <Text style={[styles.addReportText, { color: theme.primary }]}>Upload Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportList}>
          {historyReports.map(item => (
            <View key={item.id} style={[styles.historyItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.reportMain}>
                <View style={[styles.pdfIconContainer, { backgroundColor: theme.error + '1A' }]}>
                  <Icon name="file-pdf-box" size={24} color={theme.error} />
                </View>
                <View>
                  <Text style={[styles.reportTitle, { color: theme.heading }]}>{item.title}</Text>
                  <Text style={[styles.reportMeta, { color: theme.textSecondary }]}>Shared on {item.date} • {item.size}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Icon name="download" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Action Buttons (From Snippet) */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={[styles.mainActionBtn, { backgroundColor: theme.primary }]}>
            <Icon name="cog" size={20} color={theme.onPrimary} />
            <Text style={[styles.mainActionBtnText, { color: theme.onPrimary }]}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.outlineActionBtn, { borderColor: theme.border }]} onPress={handleLogout}>
            <Icon name="logout" size={20} color={theme.textSecondary} />
            <Text style={[styles.outlineActionBtnText, { color: theme.textSecondary }]}>Logout</Text>
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
  card: { borderRadius: SIZES.radius, padding: 20, marginBottom: 24, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 10, fontWeight: 'bold', opacity: 0.7 },
  statValue: { ...FONTS.headlineMobile, marginTop: 4 },
  divider: { width: 1, height: 30 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 },
  input: { flex: 1, height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12 },
  saveBtn: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  uploadBox: { height: 120, borderWidth: 2, borderStyle: 'dashed', borderRadius: SIZES.radius, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  placeholderInfo: { alignItems: 'center' },
  uploadText: { fontSize: 11, marginTop: 8, fontWeight: '600' },
  fileInfo: { alignItems: 'center' },
  fileName: { fontWeight: 'bold', fontSize: 13, marginTop: 6 },
  uploadButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  uploadButtonText: { fontWeight: 'bold', fontSize: 15 },
  resultsCard: { borderRadius: SIZES.radius, padding: 20, borderWidth: 1, marginBottom: 32 },
  insightsList: { gap: 4 },
  reportList: { gap: 12 },
  historyItem: { padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  reportMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pdfIconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  reportTitle: { fontSize: 14, fontWeight: 'bold' },
  reportMeta: { fontSize: 10, marginTop: 2 },
  downloadBtn: { padding: 8 },
  addReportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addReportText: { fontSize: 12, fontWeight: 'bold' },
  actionGrid: { gap: 12, marginTop: 40 },
  mainActionBtn: { height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  mainActionBtnText: { fontWeight: 'bold', fontSize: 16 },
  outlineActionBtn: { height: 56, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  outlineActionBtnText: { fontWeight: 'bold', fontSize: 16 },
});

export default HealthReportScreen;
