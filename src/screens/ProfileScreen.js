// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { getProfile, updateProfile } from '../api/profileApi';
import theme, { SIZES, SPACING, FONTS } from '../constants/theme';
import { STORAGE_KEYS } from '../utils/helpers';

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Edit Form State
  const [editData, setEditData] = useState({
    weight_kg: '',
    height_cm: '',
    activity_level: ''
  });

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
      setEditData({
        weight_kg: data.weight_kg ? data.weight_kg.toString() : '',
        height_cm: data.height_cm ? data.height_cm.toString() : '',
        activity_level: data.activity_level || ''
      });
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        }
      }
    ]);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile(editData);
      setModalVisible(false);
      fetchProfile();
      Alert.alert('Success', 'Profile updated!');
    } catch (err) {
      Alert.alert('Failed', err.message);
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <View style={[styles.center, { backgroundColor: theme.background }]}><ActivityIndicator size="large" color={theme.primary} /></View>;
  }

  const statusColor = user?.membership_status === 'active' ? theme.success : theme.error;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.memberIdRow}>
           <Icon name="fingerprint" size={16} color={theme.textSecondary} />
           <Text style={[styles.memberIdLabel, { color: theme.textSecondary }]}> MEMBER ID </Text>
           <Text style={[styles.memberIdVal, { color: '#E8E840' }]}>{user?.member_id}</Text>
        </View>

        <View style={[styles.avatarBox, { borderColor: theme.primary }]}>
          <Icon name="account" size={60} color={theme.primary} />
        </View>
        <Text style={[styles.name, { color: theme.heading }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>{user?.email}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{user?.membership_status?.toUpperCase() || 'NO PLAN'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.grid}>
          <View style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>BMI</Text>
            <Text style={[styles.gridVal, { color: theme.heading }]}>{user?.bmi}</Text>
          </View>
          <View style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>WEIGHT</Text>
            <Text style={[styles.gridVal, { color: theme.heading }]}>{user?.weight_kg}kg</Text>
          </View>
          <View style={[styles.gridItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>HEIGHT</Text>
            <Text style={[styles.gridVal, { color: theme.heading }]}>{user?.height_cm}cm</Text>
          </View>
        </View>

        <View style={[styles.infoList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.infoRow}>
                <Icon name="bullseye-arrow" size={20} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>Goal: {user?.fitness_goal?.replace('_', ' ')}</Text>
            </View>
            <View style={styles.infoRow}>
                <Icon name="leaf" size={20} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>Diet: {user?.dietary_preference?.replace('_', ' ')}</Text>
            </View>
            <View style={styles.infoRow}>
                <Icon name="fire" size={20} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textPrimary }]}>Target: {user?.daily_calorie_target} kcal/day</Text>
            </View>
        </View>

        <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.primary }]} onPress={() => setModalVisible(true)}>
            <Text style={[styles.editBtnText, { color: theme.onPrimary }]}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('MemberHistory')}>
            <Icon name="history" size={20} color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Member History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('HealthReport')}>
            <Icon name="heart-pulse" size={20} color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Health Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => navigation.navigate('BloodReport')}>
            <Icon name="file-document-outline" size={20} color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Blood Report AI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutBtn, { borderColor: theme.error }]} onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: theme.error }]}>Logout Account</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                <Text style={[styles.modalTitle, { color: theme.heading }]}>Update Metrics</Text>

                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Weight (kg)</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
                    value={editData.weight_kg}
                    onChangeText={(v) => setEditData({...editData, weight_kg: v})}
                    keyboardType="numeric"
                />

                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Height (cm)</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.border, color: theme.textPrimary }]}
                    value={editData.height_cm}
                    onChangeText={(v) => setEditData({...editData, height_cm: v})}
                    keyboardType="numeric"
                />

                <View style={styles.modalActions}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                        <Text style={{ color: theme.textSecondary }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleUpdate} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
                        <Text style={{ color: theme.onPrimary, fontWeight: 'bold' }}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 40, paddingTop: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  memberIdRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  memberIdLabel: { fontSize: 10, fontWeight: 'bold' },
  memberIdVal: { fontSize: 14, fontWeight: 'bold' },
  avatarBox: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 14, marginTop: 4 },
  badge: { marginTop: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  content: { padding: 20 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  gridItem: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  gridLabel: { fontSize: 10, fontWeight: 'bold' },
  gridVal: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  infoList: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { fontSize: 14, fontWeight: '500' },
  editBtn: { marginTop: 24, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  editBtnText: { fontSize: 16, fontWeight: 'bold' },
  actionBtn: { marginTop: 12, height: 56, borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { fontSize: 16, fontWeight: 'bold' },
  logoutBtn: { marginTop: 24, height: 56, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: 'bold' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { padding: 24, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 20 },
  cancelBtn: { padding: 12 },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }
});

export default ProfileScreen;
