// src/trainer/components/TopNavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function TopNavBar({ onSwitchRole }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navbar, { paddingTop: insets.top + 8 }]}>
      <View style={styles.inner}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={16} color={colors.onPrimary} />
          </View>
          <Text style={styles.logoText}>ZENITH TRAINER</Text>
        </View>

        <View style={styles.rightRow}>
          {onSwitchRole && (
            <TouchableOpacity style={styles.roleSwitchBtn} onPress={onSwitchRole}>
              <Ionicons name="swap-horizontal" size={14} color={colors.accent} />
              <Text style={styles.roleSwitchText}>Switch Role</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={18} color={colors.textBody} />
            <View style={styles.notifDot} />
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.accentDim,
    borderWidth: 1,
    borderColor: 'rgba(232, 232, 64, 0.3)',
  },
  roleSwitchText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.accent,
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
});
