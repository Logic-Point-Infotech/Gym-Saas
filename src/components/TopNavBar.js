import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const TRAINER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAm37DPOHI_VUx0H7l0si5s7NPC2jMsEIJdQTKYlo-pghDn8EDMLtrSADgEjiBXSJgBY5RJ9kWUPQvUewBlb27dYiwnZThnj5JNPFl3zWoGj9Xk6KJrWt_UOxEAkUlBg8uvApGSng3KGvNXTFXE9q0TVqBE5c0w53lh14jL_TcnhjZyFjNQmyx5Lz7SlTveTWaiBNkCvWs_PWGFrb2AeVR6Qjj80emAnsHjTAFMrIjPMnv6GAdOHWzJVyVTDTBWfjD3w-9-SalUJ9c';

export default function TopNavBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navbar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={16} color={colors.onPrimary} />
          </View>
          <Text style={styles.logoText}>ZENITH AI</Text>
        </View>

        {/* Right actions */}
        <View style={styles.rightRow}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={18} color={colors.textBody} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={18} color={colors.textBody} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={{ uri: TRAINER_AVATAR }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
});
