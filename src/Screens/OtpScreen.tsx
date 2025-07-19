import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput,
  ScrollView, Dimensions, Platform, KeyboardAvoidingView, Alert,
} from 'react-native';
import { ArrowBack, EditIcon } from '../assets';
import { verifyUrl, VerifyOtpEndpoint } from '../../config';

const { width } = Dimensions.get('window');

export const OtpScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const { contact, type, source } = route.params || {};
  const displayText = type === 'phone' ? `+91 ${contact}` : contact;

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const goBackToSource = (isVerified = false) => {
    const target = source === 'create' ? 'CreateAccountScreen' : 'LoginScreen';
    navigation.navigate(target, {
      contact,
      type,
      ...(isVerified && { verified: true }),
    });
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4‑digit OTP.');
      return;
    }

    try {
      const response = await fetch(`${verifyUrl}${VerifyOtpEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'phone' ? 'phone' : 'email']: contact,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Invalid OTP', data.message || 'The entered OTP is incorrect.');
        return;
      }
      goBackToSource(true);
    } catch (err) {
      console.error('OTP verification error:', err);
      Alert.alert('Error', 'Verification failed due to network error');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => goBackToSource(false)} style={styles.backIcon}>
            <ArrowBack width={24} height={24} fill="black" />
          </TouchableOpacity>
          <Text style={styles.title}>OTP</Text>
        </View>

        {/* illustration */}
        <Image
          source={require('../assets/images/otp_illustration.png')}
          style={styles.image}
        />

        {/* texts */}
        <Text style={styles.header}>Verification code</Text>
        <Text style={styles.subheader}>We have sent an OTP code to your {type}</Text>

        {/* phone / mail chip */}
        <TouchableOpacity style={styles.phoneContainer} onPress={() => goBackToSource(false)}>
          <Text style={styles.phone}>{displayText}</Text>
          <View style={styles.editCircle}>
            <EditIcon width={16} height={16} fill="white" />
          </View>
        </TouchableOpacity>

        {/* OTP inputs */}
        <View style={styles.otpContainer}>
          {otp.map((d, i) => (
            <TextInput
              key={i}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={d}
              ref={(r) => (inputRefs.current[i] = r)}
              onChangeText={(t) => handleChange(t, i)}
              textAlign="center"
            />
          ))}
        </View>

        {/* submit button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 34,      // <-- extra bottom padding for scroll
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backIcon: { position: 'absolute', left: 0 },
  title: { textAlign: 'center', fontSize: 20, fontWeight: '500', color: 'gray' },
  image: { width: 220, height: 220, resizeMode: 'contain', marginVertical: 48 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'center' },
  subheader: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 40 },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
    marginBottom: 60,
  },
  phone: { fontSize: 15, color: '#fff', marginRight: 8 },
  editCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#f44', justifyContent: 'center', alignItems: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 40 },
  otpInput: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#f6f6f6', elevation: 2,
    fontSize: 20, fontWeight: '500', color: '#000',
  },
  submitBtn: {
    backgroundColor: '#0a7cf3',
    width: '85%',              // responsive width
    maxWidth: 389,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
