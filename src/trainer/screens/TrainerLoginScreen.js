// src/trainer/screens/TrainerLoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import { loginUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';

const TrainerLoginScreen = ({ navigation }) => {
  const { login, selectRole } = useContext(AuthContext);
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const cleanId = emailOrId.trim();
    if (!cleanId || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await loginUser(cleanId, password);
      if (data.user?.role !== 'trainer') {
        setError('This account is not registered as a Trainer.');
        setLoading(false);
        return;
      }
      await login(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.roleSwitchBtn} onPress={() => selectRole(null)}>
            <Ionicons name="swap-horizontal" size={16} color={colors.accent} />
            <Text style={styles.roleSwitchText}>Change Role</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.header, { color: colors.accent }]}>Zenith Trainer</Text>
        <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
          Login to your AI Trainer Portal
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.heading }]}>Email or Trainer ID</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.heading }]}
            placeholder="trainer@macromate.com"
            placeholderTextColor={colors.textMuted}
            value={emailOrId}
            onChangeText={setEmailOrId}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { color: colors.heading }]}>Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.heading }]}
            placeholder="••••••••"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Login as Trainer</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('TrainerRegister')} style={styles.footerLink}>
            <Text style={[styles.linkText, { color: colors.textSecondary }]}>
              New Trainer? <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Register Here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  topRow: { alignItems: 'flex-start', marginBottom: 20 },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.accentDim,
    borderWidth: 1,
    borderColor: 'rgba(232, 232, 64, 0.3)',
  },
  roleSwitchText: { fontSize: 12, fontWeight: 'bold', color: colors.accent },
  header: { fontSize: 34, fontWeight: 'bold' },
  subHeader: { fontSize: 15, marginBottom: 40 },
  form: { gap: 20 },
  label: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  errorText: { fontSize: 14, textAlign: 'center' },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 15 },
});

export default TrainerLoginScreen;
