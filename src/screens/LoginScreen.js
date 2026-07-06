// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let isValid = true;
    let errs = {};
    if (!email) { errs.email = 'Email is required'; isValid = false; }
    if (!password) { errs.password = 'Password is required'; isValid = false; }
    setErrors(errs);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await AsyncStorage.setItem('userToken', 'mock-jwt-token');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={[styles.header, { color: theme.primary }]}>MacroMate</Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>Log in to your fitness journey</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.heading }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: errors.email ? theme.error : theme.border
              }
            ]}
            placeholder="example@mail.com"
            placeholderTextColor={theme.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.heading }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: errors.password ? theme.error : theme.border
              }
            ]}
            placeholder="••••••••"
            placeholderTextColor={theme.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            Don't have an account? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: SIZES.padding, justifyContent: 'center' },
  header: { ...FONTS.h1, fontSize: 36, marginBottom: 4 },
  subHeader: { ...FONTS.bodyLarge, marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { ...FONTS.labelCaps, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius,
    padding: 14,
    ...FONTS.bodyLarge
  },
  errorText: { ...FONTS.caption, marginTop: 4 },
  button: {
    borderRadius: SIZES.radius,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { ...FONTS.title, fontWeight: 'bold' },
  footerLink: { marginTop: 24, alignItems: 'center' },
  linkText: { ...FONTS.bodyLarge }
});

export default LoginScreen;
