import React, { useEffect, useRef, useState } from 'react';
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
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeToken } from '../services/authStorage';
import { useUserStore } from '../stores/useUserStore';
import axios from 'axios';
import { moderateScale } from './utils/scalingUtils';
import { baseUrl } from '../../config';
import { useToggleStore } from '../stores/useToggleStore';

const { height: screenHeight } = Dimensions.get('window');

export const Settings = () => {
  const navigation = useNavigation();
  const { user, clearUser, setUser } = useUserStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  // Global language toggle
  const isEnglish = useToggleStore((state) => state.isEnglish);
  const setLanguage = useToggleStore((state) => state.setLanguage);

  // Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const profileImage = 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png';

  const handleLogout = () => {
    Alert.alert(
      isEnglish ? 'Logout' : 'வெளியேறு',
      isEnglish ? 'Are you sure you want to logout?' : 'நீங்கள் வெளியில் செல்ல விரும்புகிறீர்களா?',
      [
        { text: isEnglish ? 'Cancel' : 'ரத்து செய்யவும்', style: 'cancel' },
        {
          text: isEnglish ? 'Logout' : 'வெளியேறு',
          style: 'destructive',
          onPress: async () => {
            await removeToken();
            clearUser();
            navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
          },
        },
      ]
    );
  };

  const handleEditPress = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dateOfBirth || '',
      gender: user?.gender || '',
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dob,
        gender: formData.gender,
      };

      const response = await axios.put(`${baseUrl}/api/users/${user.id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setUser(response.data);
        Alert.alert(
          isEnglish ? 'Success' : 'வெற்றி',
          isEnglish ? 'Profile updated successfully' : 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது'
        );
        setEditModalVisible(false);
      } else {
        Alert.alert(
          isEnglish ? 'Error' : 'பிழை',
          isEnglish ? 'Failed to update profile' : 'சுயவிவரத்தை புதுப்பிக்க முடியவில்லை'
        );
      }
    } catch (error) {
      Alert.alert(
        isEnglish ? 'Error' : 'பிழை',
        error.response?.data?.message || (isEnglish ? 'Something went wrong' : 'ஏதோ தவறு நடந்தது')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { minHeight: screenHeight }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{isEnglish ? 'My Profile' : 'என் சுயவிவரம்'}</Text>
      </View>

      <Animated.View
        style={[
          styles.contentWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity style={styles.cameraIcon}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
              style={styles.cameraImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label={isEnglish ? 'Name' : 'பெயர்'} value={user?.name || (isEnglish ? 'Not available' : 'கிடைக்கவில்லை')} />
          <InfoRow label={isEnglish ? 'Email' : 'மின்னஞ்சல்'} value={user?.email || (isEnglish ? 'Not provided' : 'கொடுக்கப்படவில்லை')} />
          <InfoRow label={isEnglish ? 'Phone' : 'தொலைபேசி'} value={user?.phone || (isEnglish ? 'Not available' : 'கிடைக்கவில்லை')} />
          <InfoRow label={isEnglish ? 'Date of Birth' : 'பிறந்த தேதி'} value={user?.dob || 'NA'} />
          <InfoRow label={isEnglish ? 'Gender' : 'பாலினம்'} value={user?.gender || (isEnglish ? 'Male' : 'ஆண்')} />

          {/* Language Toggle Switch */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScale(12) }}>
            <Text style={{ fontSize: moderateScale(16), fontWeight: '600', color: '#000' }}>
              {isEnglish ? 'English' : 'தமிழ்'}
            </Text>
            <Switch
              value={isEnglish}
              onValueChange={(value) => setLanguage(value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnglish ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
          <Text style={styles.editText}>{isEnglish ? 'Edit Profile' : 'சுயவிவரத்தை திருத்து'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{isEnglish ? 'Logout' : 'வெளியேறு'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEnglish ? 'Edit Profile' : 'சுயவிவரத்தை திருத்து'}</Text>

            <TextInput
              style={[styles.input, { color: '#000' }]}
              placeholder={isEnglish ? 'Name' : 'பெயர்'}
              placeholderTextColor="#888"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
              style={[styles.input, { color: '#000' }]}
              placeholder={isEnglish ? 'Email' : 'மின்னஞ்சல்'}
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            <TextInput
              style={[styles.input, { color: '#000' }]}
              placeholder={isEnglish ? 'Phone' : 'தொலைபேசி'}
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
            <TextInput
              style={[styles.input, { color: '#000' }]}
              placeholder={isEnglish ? 'Date of Birth' : 'பிறந்த தேதி'}
              placeholderTextColor="#888"
              value={formData.dob}
              onChangeText={(text) => handleChange('dob', text)}
            />
            <TextInput
              style={[styles.input, { color: '#000' }]}
              placeholder={isEnglish ? 'Gender' : 'பாலினம்'}
              placeholderTextColor="#888"
              value={formData.gender}
              onChangeText={(text) => handleChange('gender', text)}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScale(16) }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit} disabled={loading}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{loading ? (isEnglish ? 'Saving...' : 'சேமிக்கிறது...') : (isEnglish ? 'Save' : 'சேமி')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)} disabled={loading}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{isEnglish ? 'Cancel' : 'ரத்து செய்யவும்'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  container: { backgroundColor: '#f4f6fc', alignItems: 'center', paddingBottom: moderateScale(40) },
  header: { width: '100%', height: moderateScale(140), backgroundColor: '#007AFF', borderBottomLeftRadius: moderateScale(32), borderBottomRightRadius: moderateScale(32), justifyContent: 'center', alignItems: 'center', paddingTop: moderateScale(40) },
  headerText: { fontSize: moderateScale(26), fontWeight: 'bold', color: '#fff' },
  contentWrapper: { width: '90%', marginTop: moderateScale(-30), alignItems: 'center' },
  profileImageContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: moderateScale(20) },
  profileImage: { width: moderateScale(100), height: moderateScale(100), borderRadius: moderateScale(50), borderWidth: moderateScale(3), borderColor: '#fff' },
  cameraIcon: { position: 'absolute', bottom: 0, right: moderateScale(10), backgroundColor: '#007AFF', borderRadius: moderateScale(20), padding: moderateScale(6) },
  cameraImage: { width: moderateScale(18), height: moderateScale(18), tintColor: '#fff' },
  infoCard: { width: '100%', backgroundColor: '#fff', borderRadius: moderateScale(16), padding: moderateScale(20), elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: moderateScale(6) },
  infoRow: { marginBottom: moderateScale(16) },
  infoLabel: { fontSize: moderateScale(14), color: '#555', marginBottom: moderateScale(4) },
  infoValue: { fontSize: moderateScale(16), color: '#111', fontWeight: '600' },
  logoutButton: { marginTop: moderateScale(24), backgroundColor: '#FF3B30', paddingVertical: moderateScale(14), borderRadius: moderateScale(20), width: '100%', alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold' },
  editButton: { marginTop: moderateScale(12), backgroundColor: '#1577EA', paddingVertical: moderateScale(12), borderRadius: moderateScale(20), width: '100%', alignItems: 'center' },
  editText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: moderateScale(12), padding: moderateScale(20) },
  modalTitle: { fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: moderateScale(16), color:'black' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: moderateScale(8), padding: moderateScale(10), marginBottom: moderateScale(12), color: '#000' },
  saveButton: { backgroundColor: '#4CAF50', padding: moderateScale(12), borderRadius: moderateScale(8), flex: 1, marginRight: moderateScale(8), alignItems: 'center' },
  cancelButton: { backgroundColor: '#F44336', padding: moderateScale(12), borderRadius: moderateScale(8), flex: 1, marginLeft: moderateScale(8), alignItems: 'center' },
});
