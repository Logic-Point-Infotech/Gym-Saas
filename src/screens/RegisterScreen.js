// src/screens/RegisterScreen.js
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
import { registerUser } from '../api/authApi';
import theme, { SIZES, FONTS } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('muscle_gain');
  const [diet, setDiet] = useState('non_veg');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !age || !height || !weight) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await registerUser({
        name, email, password,
        age: parseInt(age),
        gender,
        height_cm: parseFloat(height),
        weight_kg: parseFloat(weight),
        fitness_goal: goal,
        dietary_preference: diet
      });
      // Navigate to success screen instead of direct login
      navigation.navigate('RegistrationSuccess', {
        member_id: data.user.member_id,
        name: data.user.name,
        token: data.token,
        user: data.user
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PickerOption = ({ label, value, activeValue, onPress }) => (
    <TouchableOpacity
      onPress={() => onPress(value)}
      style={[
        styles.pickerBtn,
        { borderColor: theme.border, backgroundColor: activeValue === value ? theme.primary : theme.surface }
      ]}
    >
      <Text style={{ color: activeValue === value ? theme.onPrimary : theme.textPrimary, fontSize: 12, fontWeight: 'bold' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.header, { color: theme.primary }]}>Join MacroMate</Text>
        <Text style={[styles.subHeader, { color: theme.textSecondary }]}>Start your transformation</Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.heading }]}>Full Name</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={name} onChangeText={setName} />

          <Text style={[styles.label, { color: theme.heading }]}>Email</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={email} onChangeText={setEmail} autoCapitalize="none" />

          <Text style={[styles.label, { color: theme.heading }]}>Password</Text>
          <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={password} onChangeText={setPassword} secureTextEntry />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.heading }]}>Age</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={age} onChangeText={setAge} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={[styles.label, { color: theme.heading }]}>Gender</Text>
                <View style={styles.pickerRow}>
                    <PickerOption label="M" value="male" activeValue={gender} onPress={setGender} />
                    <PickerOption label="F" value="female" activeValue={gender} onPress={setGender} />
                </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.heading }]}>Height (cm)</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={height} onChangeText={setHeight} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.label, { color: theme.heading }]}>Weight (kg)</Text>
              <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={weight} onChangeText={setWeight} keyboardType="numeric" />
            </View>
          </View>

          <Text style={[styles.label, { color: theme.heading }]}>Goal</Text>
          <View style={styles.pickerRow}>
            <PickerOption label="Fat Loss" value="fat_loss" activeValue={goal} onPress={setGoal} />
            <PickerOption label="Muscle Gain" value="muscle_gain" activeValue={goal} onPress={setGoal} />
            <PickerOption label="Maintain" value="maintenance" activeValue={goal} onPress={setGoal} />
          </View>

          {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color={theme.onPrimary} /> : <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Sign Up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footerLink}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              Already have an account? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.padding, paddingTop: 60 },
  header: { fontSize: 32, fontWeight: 'bold' },
  subHeader: { fontSize: 15, marginBottom: 32 },
  form: { gap: 16 },
  label: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: -10 },
  input: { height: 50, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 15 },
  row: { flexDirection: 'row' },
  pickerRow: { flexDirection: 'row', gap: 8 },
  pickerBtn: { flex: 1, height: 40, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 14, textAlign: 'center' },
  button: { height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14 },
});

export default RegisterScreen;
