// ─── Toast & ActionModal — Shared UI Feedback Components ─────────────────────
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  Modal, TextInput, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', visible, onHide }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 250, useNativeDriver: false }),
        Animated.delay(2200),
        Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: false }),
      ]).start(() => onHide && onHide());
    }
  }, [visible]);

  const bg = type === 'success' ? '#1a2e1a' : type === 'error' ? '#2e1a1a' : '#1a1a2e';
  const border = type === 'success' ? colors.statusActive : type === 'error' ? colors.error : colors.accent;
  const icon = type === 'success' ? 'checkmark-circle' : type === 'error' ? 'close-circle' : 'information-circle';
  const iconColor = type === 'success' ? colors.statusActive : type === 'error' ? colors.error : colors.accent;

  if (!visible) return null;
  return (
    <Animated.View style={[styles.toast, { backgroundColor: bg, borderColor: border, opacity: anim }]}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={[styles.toastText, { color: iconColor }]}>{message}</Text>
    </Animated.View>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ visible, title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <View style={styles.dialogIcon}>
            <Ionicons name="warning" size={24} color={colors.error} />
          </View>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>
          <View style={styles.dialogBtns}>
            <TouchableOpacity style={styles.dialogCancel} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.dialogCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dialogConfirm} onPress={onConfirm} activeOpacity={0.8} disabled={loading}>
              {loading ? <ActivityIndicator size="small" color={colors.onPrimary} /> : <Text style={styles.dialogConfirmText}>Confirm</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Action Modal (generic form sheet) ───────────────────────────────────────
export function ActionModal({ visible, title, onClose, onSubmit, loading, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.sheetOverlay}>
        <TouchableOpacity style={styles.sheetDismiss} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
            {children}
          </ScrollView>
          {onSubmit && (
            <TouchableOpacity style={styles.sheetSubmit} onPress={onSubmit} activeOpacity={0.8} disabled={loading}>
              {loading
                ? <ActivityIndicator size="small" color={colors.onPrimary} />
                : <Text style={styles.sheetSubmitText}>Submit</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Form Input ───────────────────────────────────────────────────────────────
export function FormInput({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────
export function LoadingOverlay({ visible, message }) {
  if (!visible) return null;
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>{message || 'Loading…'}</Text>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Toast
  toast: {
    position: 'absolute', bottom: 100, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 14, borderWidth: 1, zIndex: 9999,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 10,
    minWidth: 220,
  },
  toastText: { fontSize: 13, fontWeight: '600', flex: 1 },

  // Confirm Dialog
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  dialogBox: { backgroundColor: colors.surface, borderRadius: 22, padding: 24, width: '86%', borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  dialogIcon: { width: 54, height: 54, borderRadius: 16, backgroundColor: colors.errorContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  dialogTitle: { fontSize: 18, fontWeight: '800', color: colors.heading, marginBottom: 8, textAlign: 'center' },
  dialogMessage: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 22 },
  dialogBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  dialogCancel: { flex: 1, backgroundColor: colors.surfaceContainerHigh, borderRadius: 13, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  dialogCancelText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  dialogConfirm: { flex: 1, backgroundColor: colors.error, borderRadius: 13, paddingVertical: 13, alignItems: 'center' },
  dialogConfirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Action Sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  sheetDismiss: { flex: 1 },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingBottom: 32, borderWidth: 1, borderColor: colors.border },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: colors.heading },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  sheetSubmit: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 16 },
  sheetSubmitText: { fontSize: 15, fontWeight: '700', color: colors.onPrimary },

  // Form
  formGroup: { marginBottom: 14 },
  formLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput: { backgroundColor: colors.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: colors.heading, borderWidth: 1, borderColor: colors.border },

  // Loading
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  loadingBox: { backgroundColor: colors.surface, borderRadius: 18, padding: 28, alignItems: 'center', gap: 14, borderWidth: 1, borderColor: colors.border },
  loadingText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
});
