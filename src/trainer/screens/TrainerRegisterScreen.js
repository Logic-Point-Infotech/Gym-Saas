// src/trainer/screens/TrainerRegisterScreen.js
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
import { registerUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';

const TrainerRegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await registerUser({
        name,
        email,
        password,
        role: 'trainer',
      });
      await login(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>

        <Text style={[styles.header, { color: colors.accent }]}>Join Zenith AI</Text>
        <Text style={[styles.subHeader, { color: colors.textSecondary }]}>
          Register your certified trainer account
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.heading }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.heading }]}
            placeholder="Coach Uday"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.heading }]}>Email Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.heading }]}
            placeholder="uday@macromate.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Register Trainer</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('TrainerLogin')} style={styles.footerLink}>
            <Text style={[styles.linkText, { color: colors.textSecondary }]}>
              Already registered? <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60, flexGrow: 1, justifyContent: 'center' },
  backBtn: { marginBottom: 20 },
  header: { fontSize: 32, fontWeight: 'bold' },
  subHeader: { fontSize: 15, marginBottom: 32 },
  form: { gap: 16 },
  label: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: -8 },
  input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
  errorText: { fontSize: 14, textAlign: 'center' },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14 },
});

export default TrainerRegisterScreen;
