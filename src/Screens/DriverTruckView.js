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
              uri: 'https://truckcdn.cardekho.com/in/tata/signa-3523-tk/tata-signa-3523-tk-98522.jpg?impolicy=resize&imwidth=420',
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
  scroll: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: '#000',
  },
  changeBtn: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 4,
    color: '#000',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: { width: 300, height: 200, marginBottom: 12 },
  truckNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'AbeeZee-Regular',
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'AbeeZee-Regular',
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'AbeeZee-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  damageBtn: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  refuelBtn: {
    flex: 1,
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
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
