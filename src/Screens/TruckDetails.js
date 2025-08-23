import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { ArrowBack } from '../assets';
import { moderateScale } from './utils/scalingUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../../config';
import { useToggleStore } from '../stores/useToggleStore';

// Config endpoint
const GetUsersByRoleEndpoint = (role) => `/api/users/by-role/${role}`;

// AsyncStorage helper
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (err) {
    console.error('Error getting token:', err);
    return null;
  }
};

// Date formatter
const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const TruckDetails = ({ route, navigation }) => {
  const { truck } = route.params;
  const [showDrivers, setShowDrivers] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const isEnglish = useToggleStore((state) => state.isEnglish);

  // Transform truck details into display-friendly array
  const detailsArray = Object.entries(truck.details).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: key.toLowerCase().includes('date') ? formatDate(value) : value || '-',
  }));

  // Fetch drivers by role
  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token not found');

      const response = await axios.get(
        `${baseUrl}${GetUsersByRoleEndpoint(2)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add "No Driver / Null" option at the top
      const allDrivers = [{ userid: 999999, name: isEnglish ? 'No Driver / Null' : 'ஓர் ஓட்டுநர் இல்லை' }, ...response.data];
      setDrivers(allDrivers);
    } catch (err) {
      console.error('❌ Failed to fetch drivers:', err.response?.data || err.message);
    } finally {
      setLoadingDrivers(false);
    }
  };

  // Show drivers modal
  const handleShowDrivers = () => {
    setShowDrivers(true);
    fetchDrivers();
  };

  // Assign driver via PUT request
  const assignDriver = async (driverId) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Token not found');

      await axios.put(
        `${baseUrl}/api/vehicles/${truck.id}`,
        { driverId }, // PUT body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(isEnglish ? 'Driver assigned successfully!' : 'ஓட்டுநர் வெற்றிகரமாக நியமிக்கப்பட்டார்!');
      setShowDrivers(false); // close modal
    } catch (err) {
      console.error('❌ Failed to assign driver:', err.response?.data || err.message);
      alert(isEnglish ? 'Failed to assign driver' : 'ஓட்டுநரை நியமிக்க தோல்வியடைந்தது');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isEnglish ? 'Truck Details' : 'லாரி விவரங்கள்'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Truck Number */}
      <View style={styles.truckNumberContainer}>
        <Text style={styles.truckNumber}>{truck.number}</Text>
      </View>

      {/* Details Table */}
      <View style={styles.tableContainer}>
        {detailsArray.map((item, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              { backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' },
            ]}
          >
            <Text style={styles.tableLabel}>{item.label}</Text>
            <Text style={styles.tableValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.damageBtn}
          onPress={() =>
            navigation.navigate('DamageHistory', {
              truckId: truck.id,
              vehicleNumber: truck.number,
            })
          }
        >
          <Text style={styles.damageText}>🛠 {isEnglish ? 'Damage' : 'நஷ்டம்'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refuelBtn}
          onPress={() =>
            navigation.navigate('RefuelHistory', {
              truckId: truck.id,
              vehicleNumber: truck.number,
            })
          }
        >
          <Text style={styles.refuelText}>⛽ {isEnglish ? 'Refuel' : 'எரிபொருள்'}</Text>
        </TouchableOpacity>
      </View>

      {/* Show Drivers Button */}
      <TouchableOpacity
        style={[styles.refuelBtn, { marginHorizontal: moderateScale(16), marginTop: moderateScale(16) }]}
        onPress={handleShowDrivers}
      >
        <Text style={styles.refuelText}>👤 {isEnglish ? 'Show All Drivers' : 'எல்லா ஓட்டுநர்களையும் காண்பி'}</Text>
      </TouchableOpacity>

      {/* Drivers Modal */}
      <Modal visible={showDrivers} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{isEnglish ? 'All Drivers' : 'எல்லா ஓட்டுநர்கள்'}</Text>
            {loadingDrivers ? (
              <ActivityIndicator size="large" color="#1976D2" style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={drivers}
                keyExtractor={(item) => item.userid.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => assignDriver(item.userid)}>
                    <View style={styles.driverRow}>
                      <Text style={styles.driverName}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              onPress={() => setShowDrivers(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>{isEnglish ? 'Close' : 'மூடு'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(50),
    paddingBottom: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: { flex: 1, textAlign: 'center', fontSize: moderateScale(18), fontWeight: 'bold' },
  truckNumberContainer: {
    backgroundColor: '#4caf50',
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(14),
    marginBottom: moderateScale(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  truckNumber: {
    textAlign: 'center',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#fff',
  },
  tableContainer: {
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
  },
  tableLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: moderateScale(14),
    flex: 1,
  },
  tableValue: {
    color: '#555',
    fontSize: moderateScale(14),
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: moderateScale(24),
    marginHorizontal: moderateScale(16),
  },
  damageBtn: {
    flex: 1,
    marginRight: moderateScale(8),
    paddingVertical: moderateScale(14),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  damageText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  refuelBtn: {
    flex: 1,
    marginLeft: moderateScale(8),
    paddingVertical: moderateScale(14),
    backgroundColor: '#1976D2',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  refuelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  driverRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  driverName: { fontSize: 16 },
  closeBtn: { marginTop: 16, padding: 10, backgroundColor: '#1976D2', borderRadius: 8, alignItems: 'center' },
  closeText: { color: '#fff', fontWeight: 'bold' },
});

export default TruckDetails;
