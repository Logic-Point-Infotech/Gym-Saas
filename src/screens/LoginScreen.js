// src/screens/LoginScreen.js
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
import { loginUser } from '../api/authApi';
import theme, { SIZES, FONTS } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!memberId || !password) {
      setError('Please fill in all fields');
      return;
    }

    const memberIdRegex = /^MM-\d{4}-\d{5}$/;
    if (!memberIdRegex.test(memberId)) {
      setError('Invalid Member ID format (MM-YYYY-XXXXX)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await loginUser(memberId, password);
      await login(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: theme.primary }]}>MacroMate</Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>Login to your fitness hub</Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.heading }]}>Member ID</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
            placeholder="MM-2026-00001"
            placeholderTextColor={theme.muted}
            value={memberId}
            onChangeText={setMemberId}
            autoCapitalize="characters"
          />

          <Text style={[styles.label, { color: theme.heading }]}>Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
            placeholder="••••••••"
            placeholderTextColor={theme.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={theme.onPrimary} /> : <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              Don't have an account? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.padding, flexGrow: 1, justifyContent: 'center' },
  header: { fontSize: 36, fontWeight: 'bold' },
  subHeader: { fontSize: 16, marginBottom: 40 },
  form: { gap: 20 },
  label: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  input: { height: 56, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
  errorText: { fontSize: 14, textAlign: 'center' },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: 24, alignItems: 'center' },
  linkText: { fontSize: 15 },
});

export default LoginScreen;
