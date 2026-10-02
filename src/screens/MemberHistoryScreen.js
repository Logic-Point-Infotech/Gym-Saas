// src/screens/MemberHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMemberHistory } from '../api/profileApi';
import theme, { SIZES } from '../constants/theme';

const MemberHistoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('Memberships');

  const fetchData = async () => {
    try {
      setLoading(true);
      const history = await getMemberHistory();
      setData(history);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  const tabs = ['Memberships', 'Trainers', 'Health', 'Nutrition', 'Documents'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Memberships':
        return (
          <FlatList
            data={data.memberships}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
                <Text style={styles.summaryText}>{data.memberships.length} Total Memberships</Text>
            )}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.planName, { color: theme.heading }]}>{item.plan_name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#4CAF5022' : '#FF980022', borderColor: item.status === 'active' ? '#4CAF50' : '#FF9800' }]}>
                        <Text style={{ color: item.status === 'active' ? '#4CAF50' : '#FF9800', fontSize: 10, fontWeight: 'bold' }}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={[styles.gymName, { color: theme.textSecondary }]}>{item.gym_name}</Text>
                <View style={styles.dateRow}>
                    <Text style={{ color: theme.textPrimary }}>{new Date(item.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                    <Icon name="arrow-right" size={16} color={theme.textSecondary} />
                    <Text style={{ color: theme.textPrimary }}>{item.status === 'active' ? 'Present' : new Date(item.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                </View>
                <Text style={[styles.price, { color: theme.primary }]}>₹{item.amount_paid}</Text>
              </View>
            )}
          />
        );
      case 'Trainers':
        return (
          <FlatList
            data={data.trainer_history}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => <Text style={styles.emptyText}>No trainer history found</Text>}
            renderItem={({ item }) => (
              <View style={[styles.rowItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Icon name="account-tie" size={24} color={theme.primary} />
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={[styles.trainerName, { color: theme.heading }]}>{item.trainer_name}</Text>
                    <Text style={{ color: theme.textSecondary }}>
                        {new Date(item.from_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })} - {item.to_date === 'Present' ? 'Present' : new Date(item.to_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </Text>
                </View>
              </View>
            )}
          />
        );
      case 'Health':
        return (
            <FlatList
              data={data.health_metrics}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={[styles.card, { backgroundColor: index === 0 ? '#2A2A2A' : theme.surface, borderColor: theme.border }]}>
                  <Text style={[styles.dateText, { color: theme.textSecondary }]}>{new Date(item.recorded_at).toLocaleDateString()}</Text>
                  <View style={styles.metricsGrid}>
                      <View style={styles.metric}>
                          <Text style={styles.metricLabel}>Weight</Text>
                          <Text style={[styles.metricVal, { color: theme.heading }]}>{item.weight_kg} kg</Text>
                      </View>
                      <View style={styles.metric}>
                          <Text style={styles.metricLabel}>BMI</Text>
                          <Text style={[styles.metricVal, { color: theme.heading }]}>{item.bmi}</Text>
                      </View>
                      <View style={styles.metric}>
                          <Text style={styles.metricLabel}>Body Fat</Text>
                          <Text style={[styles.metricVal, { color: theme.heading }]}>{item.body_fat_percentage || '-'}%</Text>
                      </View>
                  </View>
                  {item.notes && <Text style={[styles.notes, { color: theme.textSecondary }]}>{item.notes}</Text>}
                </View>
              )}
            />
        );
      case 'Nutrition':
        const avg = data.nutrition_summary.length > 0 ? {
            cal: Math.round(data.nutrition_summary.reduce((a, b) => a + b.total_calories, 0) / data.nutrition_summary.length),
            pro: Math.round(data.nutrition_summary.reduce((a, b) => a + b.total_protein, 0) / data.nutrition_summary.length),
            carb: Math.round(data.nutrition_summary.reduce((a, b) => a + b.total_carbs, 0) / data.nutrition_summary.length),
            fat: Math.round(data.nutrition_summary.reduce((a, b) => a + b.total_fat, 0) / data.nutrition_summary.length),
        } : null;

        return (
            <FlatList
              data={data.nutrition_summary}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={() => avg && (
                  <View style={[styles.avgCard, { backgroundColor: theme.primary + '11', borderColor: theme.primary }]}>
                      <Text style={[styles.avgTitle, { color: theme.primary }]}>30-Day Average</Text>
                      <View style={styles.metricsGrid}>
                          <View style={styles.metric}><Text style={styles.metricLabel}>Calories</Text><Text style={styles.metricVal}>{avg.cal}</Text></View>
                          <View style={styles.metric}><Text style={styles.metricLabel}>Protein</Text><Text style={styles.metricVal}>{avg.pro}g</Text></View>
                          <View style={styles.metric}><Text style={styles.metricLabel}>Carbs</Text><Text style={styles.metricVal}>{avg.carb}g</Text></View>
                          <View style={styles.metric}><Text style={styles.metricLabel}>Fat</Text><Text style={styles.metricVal}>{avg.fat}g</Text></View>
                      </View>
                  </View>
              )}
              renderItem={({ item }) => (
                <View style={[styles.nutritionRow, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{new Date(item.log_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</Text>
                    <View style={styles.nutriMain}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="fire" size={14} color="#FF9800" />
                            <Text style={{ color: theme.heading, fontWeight: 'bold', marginLeft: 4 }}>{item.total_calories}</Text>
                        </View>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>P: {item.total_protein}g | C: {item.total_carbs}g | F: {item.total_fat}g</Text>
                    </View>
                </View>
              )}
            />
        );
      case 'Documents':
        return (
            <FlatList
              data={data.blood_documents}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => <Text style={styles.emptyText}>No documents found</Text>}
              renderItem={({ item }) => (
                <View style={[styles.rowItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Icon name="file-pdf-box" size={32} color={theme.error} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={[styles.docName, { color: theme.heading }]}>Blood Report</Text>
                        <Text style={{ color: theme.textSecondary }}>{new Date(item.recorded_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                    </View>
                    <TouchableOpacity style={[styles.viewBtn, { backgroundColor: theme.primary }]} onPress={() => Linking.openURL(item.blood_report_url)}>
                        <Text style={{ color: theme.onPrimary, fontWeight: 'bold' }}>View</Text>
                    </TouchableOpacity>
                </View>
              )}
            />
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && { borderBottomColor: theme.primary }]}>
                    <Text style={[styles.tabText, { color: activeTab === tab ? theme.primary : theme.textSecondary }]}>{tab}</Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
      </View>

      <View style={styles.content}>
          {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabBar: { height: 50, borderBottomWidth: 1, borderBottomColor: '#333' },
  tab: { paddingHorizontal: 20, justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 14, fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  summaryText: { fontSize: 14, color: '#909090', marginBottom: 16 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { fontSize: 18, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1 },
  gymName: { fontSize: 14, marginTop: 4 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  price: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
  rowItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  trainerName: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#909090' },
  dateText: { fontSize: 12, marginBottom: 8 },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  metric: { alignItems: 'center' },
  metricLabel: { fontSize: 10, color: '#909090' },
  metricVal: { fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  notes: { fontSize: 12, marginTop: 12, fontStyle: 'italic' },
  avgCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  avgTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  nutritionRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, alignItems: 'center' },
  dateLabel: { width: 60, fontSize: 12, fontWeight: 'bold' },
  nutriMain: { flex: 1, gap: 4 },
  docName: { fontSize: 16, fontWeight: 'bold' },
  viewBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }
});

export default MemberHistoryScreen;
