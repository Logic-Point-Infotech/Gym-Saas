// src/screens/BloodReportScreen.js
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
import { FONTS, SIZES, SPACING } from '../constants/theme';
import { BLOOD_REPORT_INSIGHTS, MOCK_USER } from '../utils/mockData';
import ReportInsightItem from '../components/ReportInsightItem';

const BloodReportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [weight, setWeight] = useState(MOCK_USER.weight.toString());
  const [height, setHeight] = useState(MOCK_USER.height.toString());
  const [bmi, setBmi] = useState('0');
  const [lastUpdated, setLastUpdated] = useState('June 10, 2024');

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [reportInsights, setReportInsights] = useState([]);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const result = (w / (h * h)).toFixed(1);
      setBmi(result);
    } else {
      setBmi('0');
    }
  };

  const handleSaveBiometrics = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (w < 30 || w > 250 || h < 100 || h > 250) {
      Alert.alert('Invalid Data', 'Please check your weight and height values.');
      return;
    }

    try {
      await AsyncStorage.setItem('user_weight', weight);
      await AsyncStorage.setItem('user_height', height);
      setLastUpdated(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      Alert.alert('Success', 'Biometrics updated successfully');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectFile = () => {
    const mockFile = {
      name: 'blood_report_june_2024.pdf',
      size: 124000,
    };
    setSelectedFile(mockFile);
    setUploadSuccess(false);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setReportInsights(BLOOD_REPORT_INSIGHTS);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Consistent Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.appTitle, { color: theme.heading }]}>Health & Biometrics</Text>
          <View style={[styles.avatarSmall, { backgroundColor: theme.surface }]}>
            <Icon name="account" size={20} color={theme.textSecondary} />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Track body metrics and analyze laboratory results
        </Text>

        {/* Current Stats */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.heading }]}>Current Stats</Text>
            <Icon name="pulse" size={20} color={theme.primary} />
          </View>
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
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last updated: {lastUpdated}</Text>
        </View>

        {/* Update Biometrics Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>Update Biometrics</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Weight (kg)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Height (cm)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>
          </View>
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSaveBiometrics}>
            <Text style={[styles.saveButtonText, { color: theme.onPrimary }]}>Save Biometrics</Text>
          </TouchableOpacity>
        </View>

        {/* Blood Report Upload Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.heading }]}>Blood Report Analysis</Text>
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
                <Text style={[styles.fileSize, { color: theme.textSecondary }]}>{(selectedFile.size / 1024).toFixed(1)} KB</Text>
              </View>
            ) : (
              <View style={styles.placeholderInfo}>
                <Icon name="file-pdf-box" size={48} color={theme.muted} />
                <Text style={[styles.uploadText, { color: theme.textSecondary }]}>Tap to select report PDF</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: theme.primary },
              !selectedFile && { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }
            ]}
            onPress={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color={theme.onPrimary} />
            ) : (
              <Text style={[styles.uploadButtonText, { color: selectedFile ? theme.onPrimary : theme.textSecondary }]}>Upload & Analyze</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {uploadSuccess && (
          <View style={[styles.resultsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.heading }]}>Report Insights</Text>
              <Icon name="clipboard-text-search-outline" size={20} color={theme.primary} />
            </View>
            <Text style={[styles.resultsSubtitle, { color: theme.textSecondary }]}>Extracted markers from your report</Text>
            <View style={styles.insightsList}>
              {reportInsights.map(item => (
                <ReportInsightItem key={item.id} item={item} />
              ))}
            </View>
            <View style={[styles.disclaimer, { backgroundColor: theme.primary + '1A' }]}>
              <Text style={[styles.disclaimerText, { color: theme.textSecondary }]}>
                Note: AI-generated analysis. Consult a doctor for medical advice.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appTitle: { ...FONTS.title, fontWeight: 'bold', flex: 1, marginLeft: 15 },
  avatarSmall: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  scrollContent: { padding: SIZES.padding },
  subtitle: { ...FONTS.bodySmall, marginBottom: 24, marginTop: -8 },
  card: { borderRadius: SIZES.radius, padding: 20, marginBottom: 32, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { ...FONTS.title },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 16 },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 10, fontWeight: 'bold' },
  statValue: { ...FONTS.headlineMobile, marginTop: 4 },
  divider: { width: 1, height: 30 },
  lastUpdated: { ...FONTS.caption, textAlign: 'center', fontStyle: 'italic' },
  section: { marginBottom: 32 },
  sectionTitle: { ...FONTS.title, marginBottom: 16 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputContainer: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, ...FONTS.bodySmall },
  saveButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { fontWeight: 'bold', fontSize: 14 },
  uploadBox: { height: 140, borderWidth: 2, borderStyle: 'dashed', borderRadius: SIZES.radius, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  placeholderInfo: { alignItems: 'center' },
  uploadText: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  fileInfo: { alignItems: 'center' },
  fileName: { fontWeight: 'bold', fontSize: 14, marginTop: 6 },
  fileSize: { fontSize: 10 },
  uploadButton: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  uploadButtonText: { fontWeight: 'bold', fontSize: 16 },
  resultsCard: { borderRadius: SIZES.radius, padding: 20, borderWidth: 1 },
  resultsSubtitle: { fontSize: 11, marginTop: -12, marginBottom: 16 },
  insightsList: { marginBottom: 16 },
  disclaimer: { padding: 12, borderRadius: 10 },
  disclaimerText: { fontSize: 10, textAlign: 'center', lineHeight: 16 }
});

export default BloodReportScreen;
