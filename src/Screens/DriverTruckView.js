import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTruckStore } from '../stores/useTruckStore';
import { ArrowBack } from '../assets';
import { useUserStore } from '../stores/useUserStore';
import { moderateScale } from './utils/scalingUtils';

export const DriverTruckView = ({ driverId }) => {
  const navigation = useNavigation();
  const { trucks, fetchTrucksByDriverId } = useTruckStore();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (driverId) fetchTrucksByDriverId(driverId);
  }, [driverId]);

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const truck = trucks.find((t) => t.details.Driverid === driverId);

  if (!truck) {
    return (
      <View style={styles.centered}>
        <Text>No truck assigned</Text>
      </View>
    );
  }

  const {
    pollution,
    fitness,
    tyreChangedDate,
    insurance,
    permit,
    Driverid,
  } = truck.details;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Truck</Text>
        <TouchableOpacity>
          <Text style={styles.changeBtn}>Change</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.sectionTitle}>Truck details:</Text>

        <View style={styles.card}>
          <Image
  source={{
    uri: truck.details.vehicleImage || 'https://example.com/default-truck.jpg', // fallback if no image
  }}
  style={styles.image}
  resizeMode="contain"
/>


          <Text style={styles.truckNumber}>{truck.number}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Driver Name:</Text>
            <Text style={styles.value}>{user?.name || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Driver ID:</Text>
            <Text style={styles.value}>{Driverid || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Insurance:</Text>
            <Text style={styles.value}>{formatDate(insurance)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Permit:</Text>
            <Text style={styles.value}>{formatDate(permit)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Pollution Expiry:</Text>
            <Text style={styles.value}>{formatDate(pollution)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Fitness Date:</Text>
            <Text style={styles.value}>{formatDate(fitness)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Tyres Changed:</Text>
            <Text style={styles.value}>{formatDate(tyreChangedDate)}</Text>
          </View>

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
              <Text style={styles.damageText}>Damage</Text>
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
              <Text style={styles.refuelText}>⛽ Refuel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: moderateScale(16) },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(52),
    paddingBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: { width: moderateScale(0), height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(4),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: '#000',
  },
  changeBtn: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
    marginTop: moderateScale(4),
    color: '#000',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: moderateScale(0), height: moderateScale(1) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
    elevation: moderateScale(2),
  },
  image: { width: moderateScale(300), height: moderateScale(200), marginBottom: moderateScale(12) },
  truckNumber: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
    fontFamily: 'AbeeZee-Regular',
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: moderateScale(8),
  },
  label: {
    fontSize: moderateScale(14),
    color: '#000',
    fontFamily: 'AbeeZee-Regular',
  },
  value: {
    fontSize: moderateScale(14),
    color: '#000',
    fontFamily: 'AbeeZee-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
    width: '100%',
  },
  damageBtn: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginRight: moderateScale(8),
  },
  refuelBtn: {
    flex: 1,
    backgroundColor: '#1976D2',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginLeft: moderateScale(8),
  },
  damageText: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  refuelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
