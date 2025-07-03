import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { styles } from './LoginScreen.styles';

export const LoginScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handlePhoneChange = (value: string) => {
    const filtered = value.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(filtered);
    setIsVerified(false);
  };

  const handleVerify = () => {
    if (activeTab === 'phone' && phone.length !== 10) {
      setError('Phone number must be 10 digits.');
      return;
    }

    if (activeTab === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Enter a valid email address.');
        return;
      }
    }

    setError('');
    const contact = activeTab === 'phone' ? phone : email;
    navigation.navigate('Otp', { contact, type: activeTab });
  };

useEffect(() => {
  if (route?.params?.verified) {
    setIsVerified(true);

    if (route.params?.type === 'phone') {
      setActiveTab('phone');
      setPhone(route.params.contact || '');
    } else if (route.params?.type === 'email') {
      setActiveTab('email');
      setEmail(route.params.contact || '');
    }
  } else {
    // fallback: just populate contact without verifying
    if (route?.params?.type === 'phone') {
      setPhone(route.params?.contact || '');
    } else if (route?.params?.type === 'email') {
      setEmail(route.params?.contact || '');
    }
  }
}, [route?.params]);


  // ✅ THIS useEffect ENSURES `isValid` UPDATES CORRECTLY
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
            setIsVerified(false);
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
            setIsVerified(false);
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
              style={styles.input}
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={handlePhoneChange}
            />
            {isVerified ? (
              <Text style={styles.verifyTextInline}>Verified</Text>
            ) : (
              isValid && (
                <TouchableOpacity onPress={handleVerify}>
                  <Text style={styles.verifyTextInline}>Verify</Text>
                </TouchableOpacity>
              )
            )}
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
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setIsVerified(false);
              }}
            />
            {isVerified ? (
              <Text style={styles.verifyTextInline}>Verified</Text>
            ) : (
              isValid && (
                <TouchableOpacity onPress={handleVerify}>
                  <Text style={styles.verifyTextInline}>Verify</Text>
                </TouchableOpacity>
              )
            )}
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}

      <TouchableOpacity
        style={[styles.otpButton, (!isValid || !isVerified) && styles.otpButtonDisabled]}
        onPress={() => console.log('Login Successful')}
        disabled={!isValid || !isVerified}
      >
        <Text style={styles.otpButtonText}>Login</Text>
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
