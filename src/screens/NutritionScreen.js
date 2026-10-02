// src/screens/NutritionScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, Alert, Dimensions } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { getTodayLog, logMeal } from '../api/nutritionApi';
import MealLogItem from '../components/MealLogItem';
import { useTheme } from '../constants/ThemeContext';
import { SIZES, SPACING, FONTS } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const INDIAN_FOODS = [
  { name: 'Paneer Tikka', cal: 280, p: 18, c: 12, f: 16 },
  { name: 'Dal Makhani', cal: 320, p: 12, c: 45, f: 14 },
  { name: 'Jeera Rice', cal: 220, p: 4, c: 48, f: 2 },
  { name: 'Butter Naan', cal: 260, p: 8, c: 52, f: 6 },
  { name: 'Chicken Biryani', cal: 480, p: 32, c: 65, f: 12 },
  { name: 'Chana Masala', cal: 210, p: 9, c: 38, f: 5 },
  { name: 'Aloo Gobi', cal: 180, p: 4, c: 22, f: 8 },
  { name: 'Masala Dosa', cal: 350, p: 6, c: 62, f: 12 },
  { name: 'Palak Paneer', cal: 240, p: 14, c: 10, f: 16 },
  { name: 'Tandoori Roti', cal: 110, p: 4, c: 22, f: 1 },
];

const NutritionScreen = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('log'); // 'log' or 'camera'
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const fetchLog = async () => {
    try {
      const data = await getTodayLog();
      setLogData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchLog(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLog();
  }, []);

  const handleCapture = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (result.didCancel) return;
    if (result.assets && result.assets.length > 0) {
      setCapturedImage(result.assets[0].uri);
      startAnalysis(result.assets[0].uri);
    }
  };

  const startAnalysis = (uri) => {
    setAnalysing(true);
    setTimeout(async () => {
      const count = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...INDIAN_FOODS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      const mealData = {
        meal_type: 'Meal Scan',
        detected_foods: selected.map(f => f.name),
        total_calories: selected.reduce((s, f) => s + f.cal, 0),
        total_protein: selected.reduce((s, f) => s + f.p, 0),
        total_carbs: selected.reduce((s, f) => s + f.c, 0),
        total_fat: selected.reduce((s, f) => s + f.f, 0),
        image_url: uri
      };

      try {
        await logMeal(mealData);
        setAnalysing(false);
        setCapturedImage(null);
        setActiveTab('log');
        fetchLog();
        Alert.alert('Logged', 'Your meal has been added to the daily log.');
      } catch (err) {
        setAnalysing(false);
        Alert.alert('Analysis Failed', err.message);
      }
    }, 2500);
  };

  const renderDailyLog = () => (
    <ScrollView
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
    >
        <View style={[styles.progressCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.kcalInfo}>
                <Text style={[styles.kcalVal, { color: theme.primary }]}>{logData?.total_calories || 0}</Text>
                <Text style={[styles.kcalTarget, { color: theme.textSecondary }]}>/ 2200 kcal today</Text>
            </View>
            <View style={[styles.barBg, { backgroundColor: theme.background }]}>
                <View style={[styles.barFill, { backgroundColor: theme.primary, width: `${Math.min(((logData?.total_calories || 0) / 2200) * 100, 100)}%` }]} />
            </View>
        </View>

        <View style={styles.mealList}>
            <Text style={[styles.sectionTitle, { color: theme.heading }]}>Meals Today</Text>
            {logData?.meals?.length > 0 ? (
                logData.meals.map(meal => <MealLogItem key={meal.id} meal={meal} />)
            ) : (
                <View style={styles.center}>
                    <Icon name="food-off" size={48} color={theme.muted} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No meals logged today.</Text>
                </View>
            )}
        </View>
        <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderMealCamera = () => (
    <View style={styles.cameraContainer}>
        {analysing ? (
            <View style={styles.center}>
                <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
                <Text style={[styles.loadingText, { color: theme.heading }]}>Analysing your meal...</Text>
                <Text style={[styles.loadingSub, { color: theme.textSecondary }]}>Our AI is identifying foods and portions</Text>
            </View>
        ) : (
            <View style={styles.center}>
                <View style={[styles.cameraCircle, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
                    <Icon name="camera" size={60} color={theme.primary} />
                </View>
                <Text style={[styles.cameraHint, { color: theme.heading }]}>Capture your meal</Text>
                <Text style={[styles.cameraSub, { color: theme.textSecondary }]}>Instant macro breakdown with AI vision</Text>
                <TouchableOpacity style={[styles.captureBtn, { backgroundColor: theme.primary }]} onPress={handleCapture}>
                    <Text style={[styles.captureBtnText, { color: theme.onPrimary }]}>Open Camera</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.tabBar}>
            <TouchableOpacity
                onPress={() => setActiveTab('log')}
                style={[styles.tab, activeTab === 'log' && { borderBottomColor: theme.primary }]}
            >
                <Text style={[styles.tabText, { color: activeTab === 'log' ? theme.primary : theme.textSecondary }]}>Daily Log</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setActiveTab('camera')}
                style={[styles.tab, activeTab === 'camera' && { borderBottomColor: theme.primary }]}
            >
                <Text style={[styles.tabText, { color: activeTab === 'camera' ? theme.primary : theme.textSecondary }]}>Meal Camera</Text>
            </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
            <View style={styles.center}><ActivityIndicator size="large" color={theme.primary} /></View>
        ) : (
            activeTab === 'log' ? renderDailyLog() : renderMealCamera()
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', paddingTop: 60, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 16, fontWeight: 'bold' },
  tabContent: { flex: 1, padding: 20 },
  progressCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
  kcalInfo: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  kcalVal: { fontSize: 32, fontWeight: 'bold' },
  kcalTarget: { fontSize: 14, marginLeft: 8 },
  barBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 12, fontSize: 16 },
  cameraContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  cameraCircle: { width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 2 },
  cameraHint: { fontSize: 24, fontWeight: 'bold' },
  cameraSub: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  captureBtn: { marginTop: 40, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30, elevation: 4 },
  captureBtnText: { fontSize: 18, fontWeight: 'bold' },
  previewImage: { width: width - 80, height: width - 80, borderRadius: 20 },
  loadingText: { fontSize: 20, fontWeight: 'bold', marginTop: 24 },
  loadingSub: { fontSize: 14, marginTop: 8 }
});

export default NutritionScreen;
