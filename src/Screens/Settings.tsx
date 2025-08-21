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
import { moderateScale } from './utils/scalingUtils';

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
    paddingBottom: moderateScale(40),
  },
  header: {
    width: '100%',
    height: moderateScale(140),
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: moderateScale(40),
  },
  headerText: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: '#fff',
  },
  contentWrapper: {
    width: '90%',
    marginTop: moderateScale(-30),
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
  },
  profileImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    borderWidth: moderateScale(3),
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: moderateScale(10),
    backgroundColor: '#007AFF',
    borderRadius: moderateScale(20),
    padding: moderateScale(6),
  },
  cameraImage: {
    width: moderateScale(18),
    height: moderateScale(18),
    tintColor: '#fff',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(6),
  },
  infoRow: {
    marginBottom: moderateScale(16),
  },
  infoLabel: {
    fontSize: moderateScale(14),
    color: '#555',
    marginBottom: moderateScale(4),
  },
  infoValue: {
    fontSize: moderateScale(16),
    color: '#111',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: moderateScale(24),
    backgroundColor: '#FF3B30',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(20),
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});
