import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeToken } from '../services/authStorage'; // adjust path if needed
import { useUserStore } from '../stores/useUserStore'; // ✅ import your zustand store

const { height: screenHeight } = Dimensions.get('window');

export const Settings = () => {
  const navigation = useNavigation();
  const { user, clearUser } = useUserStore(); // ✅ get user from global store

  const profileImage =
    'https://cdn-icons-png.flaticon.com/512/4140/4140048.png';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await removeToken();
          clearUser(); // ✅ clear global user data
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { minHeight: screenHeight }]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
        <TouchableOpacity style={styles.cameraIcon}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            }}
            style={styles.cameraImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Name" value={user?.name || ''} />
        <TextInput style={styles.input} placeholder="Email Id (Optional)" value={user?.email || ''} />
        <TextInput style={styles.input} placeholder="Phone no.." value={user?.phone || ''} />
        <TextInput style={styles.input} placeholder="Date of birth" value={user?.dob || '02-03-2002'} />
        <TextInput style={styles.input} placeholder="Gender" value={user?.gender || 'Male'} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    width: '100%',
    height: 140,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileImageContainer: {
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 6,
  },
  cameraImage: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  formContainer: {
    width: '90%',
    marginTop: 32,
    gap: 20,
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
