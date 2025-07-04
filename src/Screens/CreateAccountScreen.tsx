import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export const CreateAccountScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleVerify = (type: 'phone' | 'email') => {
    console.log(`Verifying ${type}...`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Hello, Welcome back to your account.</Text>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="Aswath M"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Email Id (Optional)</Text>
        <View style={styles.inlineInput}>
          <TextInput
            placeholder="maswath55@gmail.com"
            value={email}
            onChangeText={setEmail}
            style={styles.inlineTextInput}
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={() => handleVerify('email')}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Phone no.</Text>
        <View style={styles.inlineInput}>
          <TextInput
            placeholder="4738234762"
            value={phone}
            onChangeText={setPhone}
            style={styles.inlineTextInput}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <TouchableOpacity onPress={() => handleVerify('phone')}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.requestBtn}>
        <Text style={styles.requestBtnText}>Request OTP</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text
          style={styles.createLink}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    marginBottom: 24,
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
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  createLink: {
    color: '#f77',
    fontWeight: '600',
  },
});
