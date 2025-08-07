import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeToken } from '../services/authStorage';
import { useUserStore } from '../stores/useUserStore';

const { height: screenHeight } = Dimensions.get('window');

export const Settings = () => {
  const navigation = useNavigation();
  const { user, clearUser } = useUserStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
          clearUser();
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
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
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

        <View style={styles.infoCard}>
          <InfoRow label="Name" value={user?.name || 'Not available'} />
          <InfoRow label="Email" value={user?.email || 'Not provided'} />
          <InfoRow label="Phone" value={user?.phone || 'Not available'} />
          <InfoRow label="Date of Birth" value={user?.dob || '02-03-2002'} />
          <InfoRow label="Gender" value={user?.gender || 'Male'} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6fc',
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentWrapper: {
    width: '90%',
    marginTop: -30,
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
