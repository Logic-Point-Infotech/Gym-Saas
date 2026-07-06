// src/screens/RegisterScreen.js
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
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../constants/ThemeContext';
import { FONTS, SIZES, SPACING } from '../constants/theme';

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let isValid = true;
    let errs = {};
    if (!name) { errs.name = 'Name is required'; isValid = false; }
    if (!email) { errs.email = 'Email is required'; isValid = false; }
    if (!password) { errs.password = 'Password is required'; isValid = false; }
    else if (password.length < 6) { errs.password = 'Min 6 characters'; isValid = false; }
    setErrors(errs);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await AsyncStorage.setItem('userToken', 'mock-jwt-token');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Registration Failed');
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
        <Text style={[styles.header, { color: theme.primary }]}>Create Account</Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>Join MacroMate today</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Full Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: errors.name ? theme.error : theme.border
              }
            ]}
            placeholder="John Doe"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={[styles.errorText, { color: theme.error }]}>{errors.name}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Email</Text>
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
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
                borderColor: errors.password ? theme.error : theme.border
              }
            ]}
            placeholder="Min 6 characters"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.buttonText, { color: '#fff' }]}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            Already have an account? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.padding, paddingTop: 80 },
  header: { ...FONTS.h1, fontSize: 32, marginBottom: 4 },
  subHeader: { ...FONTS.body, marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  label: { ...FONTS.caption, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: SIZES.radius, padding: 14, ...FONTS.body },
  errorText: { ...FONTS.caption, marginTop: 4 },
  button: { borderRadius: SIZES.radius, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { ...FONTS.h3 },
  footerLink: { marginTop: 24, alignItems: 'center' },
  linkText: { ...FONTS.body }
});

export default RegisterScreen;
