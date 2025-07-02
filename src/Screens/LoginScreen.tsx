import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

export const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handlePhoneChange = (value: string) => {
    const filtered = value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(filtered);
  };

  const handleRequestOtp = () => {
    if (activeTab === 'phone') {
      if (phone.length !== 10) {
        setError('Phone number must be 10 digits.');
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Enter a valid email address.');
        return;
      }
    }

    setError('');
    console.log('Requesting OTP...');
  };

  useEffect(() => {
    if (activeTab === 'phone') {
      setIsValid(phone.length === 10);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(email));
    }
  }, [phone, email, activeTab]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Account</Text>
      <Text style={styles.subtitle}>Hello, Welcome back to your account.</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'email' && styles.activeTab]}
          onPress={() => {
            setActiveTab('email');
            setError('');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
            Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
          onPress={() => {
            setActiveTab('phone');
            setError('');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
            Phone no..
          </Text>
        </TouchableOpacity>
      </View>

      {/* Phone Input */}
      {activeTab === 'phone' && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={styles.label}>Phone no..</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter Your phone number"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={handlePhoneChange}
            />
            {isValid && <Text style={styles.verifyTextInline}>Verify</Text>}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {/* Email Input */}
      {activeTab === 'email' && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {isValid && <Text style={styles.verifyTextInline}>Verify</Text>}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      <TouchableOpacity style={styles.otpButton} onPress={handleRequestOtp}>
        <Text style={styles.otpButtonText}>Request OTP</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Sign in with google</Text>
        <View style={styles.divider} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>
          <Text style={{ color: '#4285F4' }}>G</Text>
          <Text style={{ color: '#EA4335' }}>o</Text>
          <Text style={{ color: '#FBBC05' }}>o</Text>
          <Text style={{ color: '#4285F4' }}>g</Text>
          <Text style={{ color: '#34A853' }}>l</Text>
          <Text style={{ color: '#EA4335' }}>e</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Not registered yet?{' '}
        <Text style={styles.createAccount}>Create an account</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f0fe',
    borderRadius: 30,
    padding: 4,
    marginTop: 48,
    height: 56,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    height: '100%',
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
    marginTop: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  verifyTextInline: {
    color: '#0a7cf3',
    fontWeight: '600',
    marginLeft: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 12,
  },
  otpButton: {
    marginTop: 43,
    backgroundColor: '#0a7cf3',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  otpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 61,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: 'black',
    fontSize: 12,
  },
  googleButton: {
    backgroundColor: '#e8f0fe',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 46,
  },
  googleText: {
    fontWeight: '600',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    color: '#444',
  },
  createAccount: {
    color: '#f77',
    fontWeight: '600',
  },
});
