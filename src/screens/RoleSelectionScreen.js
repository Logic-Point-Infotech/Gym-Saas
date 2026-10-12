// src/screens/RoleSelectionScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme, { SIZES, FONTS } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const RoleSelectionScreen = () => {
  const { selectRole } = useContext(AuthContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary }]}>MacroMate</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Select your portal to proceed
          </Text>
        </View>

        <View style={styles.cardContainer}>
          {/* Client Role Option */}
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.85}
            onPress={() => selectRole('client')}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.primary + '1A', borderColor: theme.primary + '33' }]}>
              <MaterialCommunityIcons name="account" size={36} color={theme.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.roleTitle, { color: theme.heading }]}>Client Portal</Text>
              <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>
                Track daily macros, meal camera AI scans, workout logs, blood reports & progress.
              </Text>
            </View>
            <View style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
              <Text style={[styles.actionBtnText, { color: theme.onPrimary }]}>Enter as Client</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={theme.onPrimary} />
            </View>
          </TouchableOpacity>

          {/* Trainer Role Option */}
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.85}
            onPress={() => selectRole('trainer')}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.secondary + '1A', borderColor: theme.secondary + '33' }]}>
              <MaterialCommunityIcons name="account-tie" size={36} color={theme.secondary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.roleTitle, { color: theme.heading }]}>Trainer Portal</Text>
              <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>
                Manage member plans, risk scoring, Gemini AI daily briefings, and client allocations.
              </Text>
            </View>
            <View style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.secondary, borderWidth: 1 }]}>
              <Text style={[styles.actionBtnText, { color: theme.heading }]}>Enter as Trainer</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={theme.heading} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.padding, paddingTop: 80, flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 8 },
  cardContainer: { gap: 20 },
  roleCard: { padding: 24, borderRadius: 24, borderWidth: 1 },
  iconBox: { width: 64, height: 64, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardInfo: { marginBottom: 20 },
  roleTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  roleDesc: { fontSize: 14, lineHeight: 20 },
  actionBtn: { height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionBtnText: { fontSize: 15, fontWeight: 'bold' },
});

export default RoleSelectionScreen;
