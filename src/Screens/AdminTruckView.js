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
import { useNavigation } from '@react-navigation/native';
import { ArrowBack, FrontTruck, TwoPersonIcon } from '../assets';
import { useTruckStore } from '../stores/useTruckStore';
import { moderateScale } from './utils/scalingUtils';
import { useToggleStore } from '../stores/useToggleStore';

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

const TruckCard = ({ truckNumber, due, details, isTruckActive, isEnglish }) => {
  const statusColor = isTruckActive ? '#4caf50' : '#ff9800';
  const statusText = isTruckActive
    ? isEnglish ? 'Active' : 'செயலில்'
    : isEnglish ? 'Inactive' : 'செயலில் இல்லை';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <FrontTruck width={24} height={24}  color='#1577EA'/>
        <Text style={styles.truckNumber}>{truckNumber}</Text>
        <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'RC Expiry:' : 'RC காலாவதி:'}</Text>
        <Text style={styles.valueText}>{formatDate(details.rcExpiry)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'Insurance:' : 'விமா:'}</Text>
        <Text style={styles.valueText}>{formatDate(details.insurance)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'Pollution:' : 'மாசுபாடு:'}</Text>
        <Text style={styles.valueText}>{formatDate(details.pollution)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'Permit:' : 'அனுமதி:'}</Text>
        <Text style={styles.valueText}>{details.permit || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'Fitness:' : 'உடம்படுதல்:'}</Text>
        <Text style={styles.valueText}>{formatDate(details.fitness)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'Tyre Changed:' : 'டைர் மாற்றப்பட்டது:'}</Text>
        <Text style={styles.valueText}>{formatDate(details.tyreChangedDate)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>{isEnglish ? 'Total KM:' : 'மொத்த கிமீ:'}</Text>
        <Text style={styles.valueText}>{details.TotalKm || '-'}</Text>
      </View>
    </View>
  );
};

export const AdminTruckView = ({ overrideTrucks }) => {
  const { trucks, fetchAllTrucks } = useTruckStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const isEnglish = useToggleStore((state) => state.isEnglish);

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
          source={require('../assets/lottie/loading.json')}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text style={{ marginTop: 10, color: '#444' }}>
          {isEnglish ? 'Loading trucks...' : 'லாரிகள் ஏற்றுகிறது...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowBack color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {isEnglish ? 'All Trucks' : 'அனைத்து லாரிகள்'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <TwoPersonIcon width={24} height={24} />
              <Text style={styles.statusTitle}>
                {isEnglish ? 'Active Trucks' : 'செயலில் உள்ள லாரிகள்'}
              </Text>
            </View>
            <Text style={styles.statusCount}>{activeTrucks.length}</Text>
          </View>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <TwoPersonIcon width={24} height={24} color="orange" />
              <Text style={styles.statusTitle}>
                {isEnglish ? 'Inactive' : 'செயலில் இல்லை'}
              </Text>
            </View>
            <Text style={styles.statusCount}>{inactiveTrucks.length}</Text>
          </View>
        </View>

        {[...activeTrucks, ...inactiveTrucks].map((truck, index) => {
          const dueInfo = getNearestDue(truck.details);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('TruckDetails', { truck })}
            >
              <TruckCard
                truckNumber={truck.number}
                due={dueInfo}
                details={truck.details}
                isTruckActive={truck.isTruckActive}
                isEnglish={isEnglish}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddTruckScreen')}
      >
        <Text style={{ color: 'white', fontSize: moderateScale(28), fontWeight: 'bold' }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(24),
    backgroundColor: '#f9f9f9',
  },
  valueText: {
    color: 'black',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? moderateScale(30) : moderateScale(50),
    paddingBottom: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
  },
  headerText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color:'black'
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: moderateScale(16),
    gap: moderateScale(20),
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginHorizontal: moderateScale(4),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: moderateScale(1), height: moderateScale(2) },
    elevation: moderateScale(2),
    height: moderateScale(100),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  statusTitle: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#000',
  },
  statusCount: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginBottom: moderateScale(12),
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: moderateScale(1) },
    elevation: moderateScale(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
  truckNumber: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginLeft: moderateScale(10),
    flex: 1,
    color: '#000',
  },
  statusChip: {
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(10),
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: moderateScale(6),
  },
  label: {
    fontWeight: 'bold',
    width: moderateScale(110),
    color: '#000',
  },
  floatingButton: {
    position: 'absolute',
    bottom: moderateScale(30),
    right: moderateScale(30),
    backgroundColor: '#4caf50',
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
