// src/screens/BloodReportScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import { FONTS } from '../constants/theme';

const BloodReportScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.heading }]}>
        This screen has been integrated into Health Reports.
      </Text>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('HealthReport')}
      >
        <Text style={{ color: theme.onPrimary, fontWeight: 'bold' }}>Go to Health Reports</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  text: { textAlign: 'center', fontSize: 18, marginBottom: 20 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }
});

export default BloodReportScreen;
