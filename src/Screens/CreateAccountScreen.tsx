// CreateAccountScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAccountStore } from '../stores/useAccountStore';
import {
  baseUrl,
  SendOtpWhatsappEndpoint,
  VerifyOtpEndpoint,
  RegisterEndpoint,
} from '../../config';
import { moderateScale } from './utils/scalingUtils';

export const CreateAccountScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);


  const setAccount = useAccountStore((state) => state.setAccount);

  useEffect(() => {
    const params = route?.params || {};
    if (params.verified && params.type === 'phone') {
      setVerifiedPhone(true);
      setPhone(params.contact || '');
      setAccount({ verifiedPhone: true, phone: params.contact });
    }

    const account = useAccountStore.getState().account;
    setName(account.name || '');
    setEmail(account.email || '');
    setPassword(account.password || '');
    setConfirmPassword(account.confirmPassword || '');
  }, [route?.params]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email === '';

  const isStrongPassword = (pwd) => pwd.length >= 8;

  const isFormValid =
    name.trim() !== '' &&
    phone.length === 10 &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    isStrongPassword(password) &&
    verifiedPhone &&
    isValidEmail(email);

  const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

  // const handleVerifyPhone = async () => {
  //   if (phone.length !== 10) {
  //     Alert.alert('Error', 'Enter a valid 10-digit phone number');
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`${baseUrl}${SendOtpWhatsappEndpoint}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ phone }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       Alert.alert('Failed', data.message || 'Failed to send OTP');
  //       return;
  //     }

  //     setAccount({
  //       name,
  //       email,
  //       phone,
  //       password,
  //       confirmPassword,
  //       verifiedPhone: false,
  //     });

  //     navigation.navigate('Otp', {
  //       contact: phone,
  //       type: 'phone',
  //       source: 'create',
  //       name,
  //       email,
  //       password,
  //       confirmPassword,
  //     });
  //   } catch (err) {
  //     console.error('OTP send error:', err);
  //     Alert.alert('Error', 'Network error while sending OTP');
  //   }
  // };
  const handleVerifyPhone = async () => {
  if (phone.length !== 10) {
    Alert.alert('Error', 'Enter a valid 10-digit phone number');
    return;
  }

  setVerifyingPhone(true); // ✅ Start loading

  try {
    const res = await fetch(`${baseUrl}${SendOtpWhatsappEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert('Failed', data.message || 'Failed to send OTP');
      return;
    }

    setAccount({
      name,
      email,
      phone,
      password,
      confirmPassword,
      verifiedPhone: false,
    });

    navigation.navigate('Otp', {
      contact: phone,
      type: 'phone',
      source: 'create',
      name,
      email,
      password,
      confirmPassword,
    });
  } catch (err) {
    console.error('OTP send error:', err);
    Alert.alert('Error', 'Network error while sending OTP');
  } finally {
    setVerifyingPhone(false); // ✅ Stop loading
  }
};


  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    const userid = generateUserId();

    setAccount({
      name,
      email,
      phone,
      password,
      confirmPassword,
      verifiedPhone,
    });

    const payload = {
      name,
      email,
      phone,
      password,
      userid,
      userrole: 3,
    };

    console.log('🔍 Sending registration payload:', payload);

    try {
      const response = await fetch(`${baseUrl}${RegisterEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('📩 Registration response:', response.status, data);

      if (!response.ok) {
        Alert.alert('Registration Failed', data.message || 'Something went wrong');
        return;
      }

      Alert.alert('Success', 'Account registered successfully!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('❌ Registration error:', error);
      Alert.alert('Error', 'Could not register at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Hello, Welcome back to your account.</Text>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="#888" 
            value={name}
            onChangeText={(val) => {
              setName(val);
              setAccount({ name: val });
            }}
            style={styles.input}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Email Id (Optional)</Text>
          <TextInput
            placeholder="Enter your Email"
            placeholderTextColor="#888" 
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              setAccount({ email: val });
              setEmailError(isValidEmail(val) ? '' : 'Invalid email format');
            }}
            style={styles.input}
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Phone no.</Text>
          <View style={styles.inlineInput}>
            <TextInput
              placeholder="Enter your Phone Number"
              placeholderTextColor="#888" 
              value={phone}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                if (cleaned !== phone) {
                  setVerifiedPhone(false);
                }
                setPhone(cleaned);
                setAccount({ phone: cleaned, verifiedPhone: false });
              }}
              style={styles.inlineTextInput}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {phone.length === 10 && (
              // <TouchableOpacity onPress={handleVerifyPhone} disabled={verifiedPhone}>
              //   <Text style={[styles.verifyText, verifiedPhone && styles.verified]}>
              //     {verifiedPhone ? 'Verified' : 'Verify'}
              //   </Text>
              // </TouchableOpacity>
              <TouchableOpacity onPress={handleVerifyPhone} disabled={verifiedPhone || verifyingPhone}>
  {verifyingPhone ? (
    <ActivityIndicator size="small" color="#007bff" />
  ) : (
    <Text style={[styles.verifyText, verifiedPhone && styles.verified]}>
      {verifiedPhone ? 'Verified' : 'Verify'}
    </Text>
  )}
</TouchableOpacity>


            )}
          </View>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Minimum 8 characters"
            placeholderTextColor="#888" 
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setAccount({ password: val });
              setPasswordMatchError(val === confirmPassword ? '' : 'Passwords do not match');
            }}
            secureTextEntry
            style={styles.input}
          />
          {password.length > 0 && password.length < 8 && (
            <Text style={styles.warningText}>Password must be at least 8 characters.</Text>
          )}
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor="#888" 
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              setAccount({ confirmPassword: val });
              setPasswordMatchError(val === password ? '' : 'Passwords do not match');
            }}
            secureTextEntry
            style={styles.input}
          />
          {passwordMatchError ? <Text style={styles.errorText}>{passwordMatchError}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.requestBtn, { opacity: isFormValid && !loading ? 1 : 0.5 }]}
          disabled={!isFormValid || loading}
          onPress={handleRegister}
        >
          {loading ? (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
    <Text style={styles.requestBtnText}>Registering...</Text>
  </View>
) : (
  <Text style={styles.requestBtnText}>Register</Text>
)}

        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.createLink} onPress={() => navigation.navigate('LoginScreen')}>
            Login
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(24),
    paddingBottom: moderateScale(60),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    marginBottom: moderateScale(6),
    marginTop: moderateScale(50),
    color:'black'
  },
  subtitle: {
    color: 'gray',
    marginBottom: moderateScale(24),
  },
  inputBox: {
    marginBottom: moderateScale(18),
  },
  label: {
    marginBottom: moderateScale(12),
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(48),
    borderColor: '#ddd',
    borderWidth: moderateScale(1),
  },
  inlineInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: moderateScale(30),
    borderColor: '#ddd',
    borderWidth: moderateScale(1),
    height: moderateScale(48),
    paddingHorizontal: moderateScale(16),
  },
  inlineTextInput: {
    flex: 1,
    marginRight: moderateScale(10),
    height: '100%',
  },
  verifyText: {
    color: '#007bff',
    fontWeight: '600',
  },
  verified: {
    color: 'green',
  },
  requestBtn: {
    backgroundColor: '#007bff',
    height: moderateScale(50),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(16),
  },
  requestBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  warningText: {
    color: '#d6a100',
    fontSize: moderateScale(13),
    marginTop: moderateScale(6),
    paddingLeft: moderateScale(10),
  },
  footerText: {
    textAlign: 'center',
    marginTop: moderateScale(20),
    color: 'gray',
  },
  createLink: {
    color: '#f77',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: moderateScale(13),
    marginTop: moderateScale(6),
    paddingLeft: moderateScale(10),
  },
});
