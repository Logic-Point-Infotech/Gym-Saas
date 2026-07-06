// src/screens/TrainerScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';

const TrainerScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Icon name="menu" size={24} color={theme.primary} />
          <Text style={[styles.appTitle, { color: theme.heading }]}>MacroMate</Text>
          <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
            <Icon name="account-circle-outline" size={28} color={theme.textSecondary} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Trainer Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.profileMain}>
            <View style={styles.trainerImageWrapper}>
              <View style={[styles.trainerImage, { backgroundColor: theme.border }]}>
                <Icon name="account" size={60} color={theme.muted} />
              </View>
              <View style={[styles.ratingBadge, { backgroundColor: theme.primary }]}>
                <Icon name="star" size={10} color={theme.onPrimary} />
                <Text style={[styles.ratingText, { color: theme.onPrimary }]}>4.9</Text>
              </View>
            </View>
            <View style={styles.trainerInfo}>
              <Text style={[styles.trainerName, { color: theme.heading }]}>Uday Patil</Text>
              <Text style={[styles.specialty, { color: theme.primary }]}>Sports Nutrition Specialist</Text>
              <View style={styles.expRow}>
                <View style={styles.expItem}>
                  <Icon name="check-decagram" size={14} color={theme.primary} />
                  <Text style={[styles.expText, { color: theme.textSecondary }]}>Certified</Text>
                </View>
                <View style={styles.expItem}>
                  <Icon name="history" size={14} color={theme.textSecondary} />
                  <Text style={[styles.expText, { color: theme.textSecondary }]}>6 Years</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.profileActions}>
            <TouchableOpacity style={[styles.msgBtn, { backgroundColor: theme.primary }]}>
              <Icon name="send" size={18} color={theme.onPrimary} />
              <Text style={[styles.msgBtnText, { color: theme.onPrimary }]}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bookBtn, { borderColor: theme.border }]}>
              <Text style={[styles.bookBtnText, { color: theme.heading }]}>Book Session</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips Grid */}
        <View style={styles.tipsGrid}>
          <View style={[styles.tipCard, { borderLeftColor: theme.primary, backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Icon name="food-apple" size={20} color={theme.primary} />
            <Text style={[styles.tipTitle, { color: theme.heading, marginTop: 10 }]}>Protein Intake</Text>
            <Text style={[styles.tipDesc, { color: theme.textSecondary }]}>"Increase lean protein to 160g today."</Text>
          </View>
          <View style={[styles.tipCard, { borderLeftColor: theme.secondary, backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Icon name="walk" size={20} color={theme.secondary} />
            <Text style={[styles.tipTitle, { color: theme.heading, marginTop: 10 }]}>Step Target</Text>
            <Text style={[styles.tipDesc, { color: theme.textSecondary }]}>"Try to hit 12k steps today."</Text>
          </View>
        </View>

        {/* Chat Card */}
        <View style={[styles.chatCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.chatHeader, { backgroundColor: theme.border + '33' }]}>
            <Text style={[styles.chatHeaderText, { color: theme.textSecondary }]}>CHAT WITH UDAY</Text>
          </View>
          <View style={styles.messagesContainer}>
            <View style={[styles.msgBubble, { backgroundColor: theme.border + '66' }]}>
              <Text style={[styles.msgText, { color: theme.textPrimary }]}>Hey Rahul! How was the session?</Text>
            </View>
            <View style={[styles.msgBubble, styles.msgBubbleUser, { backgroundColor: theme.primary + '33' }]}>
              <Text style={[styles.msgText, { color: theme.heading }]}>It was great! Feeling the pump.</Text>
            </View>
          </View>
          <View style={[styles.chatInputContainer, { borderTopColor: theme.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.border + '33', color: theme.textPrimary }]}
              placeholder="Type..."
              placeholderTextColor={theme.muted}
            />
            <TouchableOpacity style={[styles.sendBtn, { backgroundColor: theme.primary }]}>
              <Icon name="send" size={18} color={theme.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

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
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SIZES.padding },
  profileCard: { padding: 20, borderRadius: SIZES.radius, marginBottom: SPACING.m, borderWidth: 1 },
  profileMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  trainerImageWrapper: { position: 'relative' },
  trainerImage: { width: 80, height: 80, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  ratingBadge: { position: 'absolute', bottom: -5, right: -5, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 10, fontWeight: 'bold', marginLeft: 2 },
  trainerInfo: { flex: 1, marginLeft: 15 },
  trainerName: { ...FONTS.title, fontWeight: 'bold' },
  specialty: { fontSize: 12, marginTop: 2 },
  expRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  expItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expText: { fontSize: 10 },
  profileActions: { flexDirection: 'row', gap: 10 },
  msgBtn: { flex: 1, height: 44, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  msgBtnText: { fontWeight: 'bold', marginLeft: 6 },
  bookBtn: { flex: 1, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  bookBtnText: { fontWeight: 'bold', fontSize: 12 },
  tipsGrid: { flexDirection: 'row', gap: 12, marginBottom: SPACING.m },
  tipCard: { flex: 1, padding: 15, borderRadius: SIZES.radius, borderLeftWidth: 4, borderWidth: 1 },
  tipTitle: { fontSize: 12, fontWeight: 'bold' },
  tipDesc: { fontSize: 11, marginTop: 4 },
  chatCard: { borderRadius: SIZES.radius, overflow: 'hidden', borderWidth: 1 },
  chatHeader: { padding: 10 },
  chatHeaderText: { fontSize: 10, fontWeight: 'bold' },
  messagesContainer: { padding: 15, gap: 10 },
  msgBubble: { padding: 12, borderRadius: 12, alignSelf: 'flex-start', maxWidth: '80%' },
  msgBubbleUser: { alignSelf: 'flex-end' },
  msgText: { fontSize: 13 },
  chatInputContainer: { padding: 10, flexDirection: 'row', gap: 10, borderTopWidth: 1 },
  input: { flex: 1, height: 40, borderRadius: 20, paddingHorizontal: 15 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});

export default TrainerScreen;
