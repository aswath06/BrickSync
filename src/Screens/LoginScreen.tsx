import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { storeToken } from '../services/authStorage';
import { styles } from './LoginScreen.styles';
import {
  baseUrl,
  SendOtpEndpoint,
  SendOtpWhatsappEndpoint,
} from '../../config';
import { useUserStore } from '../stores/useUserStore';

export const LoginScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // ✅ Phone is verified by default
  const [verifying, setVerifying] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handlePhoneChange = (value: string) => {
    const filtered = value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(filtered);
    if (!route?.params?.verified) setIsVerified(true); // Phone stays verified
  };

  const handleVerify = async () => {
    if (activeTab === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Enter a valid email address.');
        return;
      }
    }

    const contact = activeTab === 'phone' ? phone : email;
    const field = activeTab === 'phone' ? 'phone' : 'email';
    const endpoint = activeTab === 'phone' ? SendOtpWhatsappEndpoint : SendOtpEndpoint;

    try {
      setVerifying(true);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: contact }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send OTP');
        return;
      }

      setError('');
      if (activeTab === 'email') {
        navigation.navigate('Otp', { contact, type: activeTab, source: 'login' });
      }
    } catch (error) {
      console.error('OTP send error:', error);
      setError('Network error while sending OTP');
    } finally {
      setVerifying(false);
    }
  };

  const getUserAndToken = async () => {
    const contact = activeTab === 'phone' ? phone : email;
    const queryParam = activeTab === 'phone' ? `phone=${contact}` : `email=${contact}`;
    const endpoint = `${baseUrl}/api/users/by-${activeTab}?${queryParam}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.exists) {
        setError('User not found');
        return null;
      }

      const { token, user } = data;
      await storeToken(token);
      console.log('✅ JWT Token:', token);
      console.log('✅ Full User:', user); // ← Full user object
      return { token, user };
    } catch (err) {
      console.error('User fetch error:', err);
      setError('Failed to fetch user details');
      return null;
    }
  };

  useEffect(() => {
    if (route?.params?.verified) {
      setIsVerified(true);
      const { type, contact } = route.params;
      setActiveTab(type);
      if (type === 'phone') setPhone(contact || '');
      else if (type === 'email') setEmail(contact || '');
    } else {
      const { type, contact } = route.params || {};
      if (type === 'phone') {
        setPhone(contact || '');
        setIsVerified(true); // ✅ Phone verified by default
      } else if (type === 'email') {
        setEmail(contact || '');
        setIsVerified(false);
      }
    }
  }, [route?.params]);

  useEffect(() => {
    if (activeTab === 'phone') {
      setIsValid(phone.length === 10);
      setIsVerified(true); // Phone stays verified
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
            setIsVerified(false); // Email must verify
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
            setIsVerified(true); // Phone verified by default
          }}
        >
          <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
            Phone no..
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'phone' && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={styles.label}>Phone no..</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor="#888" 
              style={styles.input}
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={handlePhoneChange}
            />
            <Text style={styles.verifyTextInline}>Verified</Text> 
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      {activeTab === 'email' && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#888" 
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsVerified(false); // Email needs verification
              }}
            />
            {isVerified ? (
              <Text style={styles.verifyTextInline}>Verified</Text>
            ) : (
              isValid && (
                <TouchableOpacity onPress={handleVerify} disabled={verifying}>
                  {verifying ? (
                    <ActivityIndicator size="small" color="#007bff" />
                  ) : (
                    <Text style={styles.verifyTextInline}>Verify</Text>
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.otpButton,
          (!isValid || !isVerified || loggingIn) && styles.otpButtonDisabled,
        ]}
        onPress={async () => {
          setLoggingIn(true);
          try {
            const result = await getUserAndToken();
            if (result) {
              setUser(result.user);
              console.log('Login Successful');
              navigation.navigate('DashboardScreen');
            }
          } finally {
            setLoggingIn(false);
          }
        }}
        disabled={!isValid || !isVerified || loggingIn}
      >
        {loggingIn ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.otpButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Sign in with Google</Text>
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
        <Text
          style={styles.createAccount}
          onPress={() => navigation.navigate('CreateAccountScreen')}
        >
          Create an account
        </Text>
      </Text>
    </View>
  );
};
