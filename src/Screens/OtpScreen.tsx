import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, TextInput,
  ScrollView, Dimensions, Platform, KeyboardAvoidingView, Alert,
} from 'react-native';
import { ArrowBack, EditIcon } from '../assets';

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
    const navParams = isVerified
      ? {
          verified: true,
          contact,
          type,
        }
      : {
          contact,
          type,
        };

    navigation.navigate(target, navParams);
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '8812') {
      goBackToSource(true);
    } else {
      Alert.alert('Invalid OTP', 'The entered OTP is incorrect.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => goBackToSource(false)} style={styles.backIcon}>
            <ArrowBack width={24} height={24} fill="black" />
          </TouchableOpacity>
          <Text style={styles.title}>OTP</Text>
        </View>

        <Image source={require('../assets/images/otp_illustration.png')} style={styles.image} />
        <Text style={styles.header}>Verification code</Text>
        <Text style={styles.subheader}>We have sent an OTP code to your {type}</Text>

        <TouchableOpacity style={styles.phoneContainer} onPress={() => goBackToSource(false)}>
          <Text style={styles.phone}>{displayText}</Text>
          <View style={styles.editCircle}>
            <EditIcon width={16} height={16} fill="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
              textAlign="center"
            />
          ))}
        </View>

        <View style={styles.submitWrapper}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexGrow: 1,
  },
  headerContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backIcon: {
    position: 'absolute',
    left: 0,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: 'gray',
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 48,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 40,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 24,
    marginBottom: 60,
  },
  phone: {
    fontSize: 15,
    color: '#fff',
    marginRight: 8,
  },
  editCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 40,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f6f6f6',
    elevation: 2,
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  submitWrapper: {
    position: 'absolute',
    bottom: 34,
    width: '100%',
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#0a7cf3',
    width: 389,
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
