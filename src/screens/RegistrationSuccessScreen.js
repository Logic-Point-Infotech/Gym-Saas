// src/screens/RegistrationSuccessScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import theme, { SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const RegistrationSuccessScreen = ({ route }) => {
  const { member_id, name, token, user } = route.params;
  const { login } = useContext(AuthContext);

  const copyToClipboard = () => {
    Clipboard.setString(member_id);
    alert('ID Copied to clipboard!');
  };

  const handleContinue = async () => {
    await login(token, user);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MaterialCommunityIcons name="check-circle" color="#E8E840" size={80} />

      <Text style={[styles.header, { color: '#F0F0F0' }]}>Registration Successful</Text>
      <Text style={[styles.subHeader, { color: '#909090' }]}>{name}</Text>

      <View style={[styles.card, { backgroundColor: '#1A1A1A', borderColor: '#303030' }]}>
        <Text style={[styles.cardLabel, { color: '#909090' }]}>Your Unique Member ID</Text>
        <Text style={[styles.memberId, { color: '#E8E840' }]}>{member_id}</Text>
      </View>

      <Text style={[styles.infoText, { color: '#C0C0C0' }]}>
        Save this ID. You will need it along with your password to login.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.copyButton, { borderColor: theme.border }]} onPress={copyToClipboard}>
          <Text style={[styles.copyButtonText, { color: theme.textPrimary }]}>Copy ID</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.continueButton, { backgroundColor: '#E8E840' }]} onPress={handleContinue}>
          <Text style={[styles.continueButtonText, { color: '#0A0A12' }]}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  header: { fontSize: 24, fontWeight: 'bold', marginTop: 24 },
  subHeader: { fontSize: 18, marginTop: 8 },
  card: { width: '100%', padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginVertical: 32 },
  cardLabel: { fontSize: 14, textTransform: 'uppercase', marginBottom: 8 },
  memberId: { fontSize: 28, fontWeight: 'bold', letterSpacing: 2 },
  infoText: { textAlign: 'center', fontSize: 14, marginBottom: 40, lineHeight: 20 },
  buttonRow: { flexDirection: 'row', gap: 16, width: '100%' },
  copyButton: { flex: 1, height: 56, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  copyButtonText: { fontSize: 16, fontWeight: 'bold' },
  continueButton: { flex: 1, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  continueButtonText: { fontSize: 16, fontWeight: 'bold' },
});

export default RegistrationSuccessScreen;
