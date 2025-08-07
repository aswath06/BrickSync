import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { ArrowBack, FrontTruck, TwoPersonIcon } from '../assets';
import { useTruckStore } from '../stores/useTruckStore';

const isValidDate = (date) => new Date(date) > new Date();

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getNearestDue = (details) => {
  const { insurance, pollution } = details || {};
  const dates = [
    { label: 'Insurance', date: new Date(insurance) },
    { label: 'Pollution', date: new Date(pollution) },
  ];
  const sorted = dates
    .filter(({ date }) => date instanceof Date && !isNaN(date))
    .sort((a, b) => a.date - b.date);
  return sorted[0] || {};
};

const TruckCard = ({ truckNumber, due, details, isTruckActive }) => {
  const statusColor = isTruckActive ? '#4caf50' : '#ff9800';
  const statusText = isTruckActive ? 'Active' : 'Inactive';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <FrontTruck width={24} height={24} />
        <Text style={styles.truckNumber}>{truckNumber}</Text>
        <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>RC Expiry:</Text>
        <Text>{formatDate(details.rcExpiry)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Insurance:</Text>
        <Text>{formatDate(details.insurance)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Pollution:</Text>
        <Text>{formatDate(details.pollution)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Permit:</Text>
        <Text>{details.permit || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Fitness:</Text>
        <Text>{formatDate(details.fitness)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Tyre Changed:</Text>
        <Text>{formatDate(details.tyreChangedDate)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Total KM:</Text>
        <Text>{details.TotalKm || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Driver:</Text>
        <Text>{details.driver || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Driver ID:</Text>
        <Text>{details.Driverid || '-'}</Text>
      </View>
    </View>
  );
};

export const AdminTruckView = ({ overrideTrucks }) => {
  const { trucks, fetchAllTrucks } = useTruckStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrucks = async () => {
      setIsLoading(true);
      await fetchAllTrucks();
      setIsLoading(false);
    };
    loadTrucks();
  }, []);

  const allTrucks = overrideTrucks || trucks;

  const sortedTrucks = allTrucks
    .map((truck) => {
      const { insurance, permit, pollution } = truck.details;
      const isInsuranceValid = isValidDate(insurance);
      const isPollutionValid = isValidDate(pollution);
      const isPermitValid = permit?.toLowerCase?.() === 'yes';
      const isTruckActive = isInsuranceValid && isPollutionValid && isPermitValid;
      return { ...truck, isTruckActive };
    })
    .sort((a, b) => {
      const getNextExpiry = (d) =>
        Math.min(
          new Date(d.insurance).getTime(),
          new Date(d.pollution).getTime()
        );
      return getNextExpiry(a.details) - getNextExpiry(b.details);
    });

  const activeTrucks = sortedTrucks.filter((t) => t.isTruckActive);
  const inactiveTrucks = sortedTrucks.filter((t) => !t.isTruckActive);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require('../assets/lottie/Roboloading.json')}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text style={{ marginTop: 10, color: '#444' }}>Loading trucks...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }} style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <ArrowBack color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Trucks</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <TwoPersonIcon width={24} height={24} />
            <Text style={styles.statusTitle}>Active Trucks</Text>
          </View>
          <Text style={styles.statusCount}>{activeTrucks.length}</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <TwoPersonIcon width={24} height={24} color="orange" />
            <Text style={styles.statusTitle}>Inactive</Text>
          </View>
          <Text style={styles.statusCount}>{inactiveTrucks.length}</Text>
        </View>
      </View>

      {[...activeTrucks, ...inactiveTrucks].map((truck, index) => {
        const dueInfo = getNearestDue(truck.details);
        return (
          <TruckCard
            key={index}
            truckNumber={truck.number}
            due={dueInfo}
            details={truck.details}
            isTruckActive={truck.isTruckActive}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 30 : 50,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 20,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    elevation: 2,
    height: 100,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  statusCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  truckNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    color: '#000',
  },
  statusChip: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    width: 110,
    color: '#000',
  },
});
