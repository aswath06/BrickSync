import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useAccountStore } from '../stores/useAccountStore';

export const CreateAccountScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

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

  const handleVerifyPhone = () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Enter a valid 10-digit phone number');
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
  };

  const handleRegister = () => {
    setAccount({
      name,
      email,
      phone,
      password,
      confirmPassword,
      verifiedPhone,
    });

    console.log('Registered Account:', {
      name,
      email,
      phone,
      password,
      confirmPassword,
      verifiedPhone,
    });

    Alert.alert('Success', 'Account registered successfully!');
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
              <TouchableOpacity onPress={handleVerifyPhone} disabled={verifiedPhone}>
                <Text style={[styles.verifyText, verifiedPhone && styles.verified]}>
                  {verifiedPhone ? 'Verified' : 'Verify'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        
        <View style={styles.inputBox}>
  <Text style={styles.label}>Password</Text>
  <TextInput
    placeholder="Minimum 8 characters"
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
          style={[styles.requestBtn, { opacity: isFormValid ? 1 : 0.5 }]}
          disabled={!isFormValid}
          onPress={handleRegister}
        >
          <Text style={styles.requestBtnText}>Register</Text>
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
    padding: 24,
    paddingBottom: 60, // extra space below last button
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 50,
  },
  subtitle: {
    color: 'gray',
    marginBottom: 24,
  },
  inputBox: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  inlineInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
  },
  inlineTextInput: {
    flex: 1,
    marginRight: 10,
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
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  requestBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  warningText: {
  color: '#d6a100',
  fontSize: 13,
  marginTop: 6,
  paddingLeft: 10,
},

  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  createLink: {
    color: '#f77',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 6,
    paddingLeft: 10,
  },
});
