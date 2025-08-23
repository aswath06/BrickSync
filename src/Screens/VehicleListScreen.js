import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { moderateScale } from './utils/scalingUtils';

export const VehicleListScreen = ({ route }) => {
  const { customerId, customerName } = route.params;
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    // 🔄 Replace URL with your actual endpoint
    axios
      .get(`http://localhost:3000/api/vehicles/user/${customerId}`)
      .then(res => setVehicles(res.data))
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.vehicleNumber}>{item.vehicleNumber}</Text>
      <Text style={styles.text}>Total KM: {item.totalKm}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vehicles of {customerName}</Text>
      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.text}>No vehicles found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    paddingTop: moderateScale(42),
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: moderateScale(16),
    color: '#000',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(12),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(4),
    elevation: 2,
  },
  vehicleNumber: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
  },
  text: {
    fontSize: moderateScale(14),
    color: '#444',
    marginTop: moderateScale(4),
  },
});

