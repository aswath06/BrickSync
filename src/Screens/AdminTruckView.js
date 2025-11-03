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

// ✅ Validate only if date exists
const isValidDate = (date) => {
  if (!date) return true; // Missing -> treated as valid
  const d = new Date(date);
  return d instanceof Date && !isNaN(d) && d > new Date();
};

// ✅ Format date or return "-"
const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  if (isNaN(date)) return '-';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ✅ Get nearest upcoming expiry
const getNearestDue = (details) => {
  const { rcExpiry, insurance, pollution, fitness } = details || {};
  const dates = [
    { label: 'RC', date: new Date(rcExpiry) },
    { label: 'Insurance', date: new Date(insurance) },
    { label: 'Pollution', date: new Date(pollution) },
    { label: 'Fitness', date: new Date(fitness) },
  ];

  const sorted = dates
    .filter(({ date }) => date instanceof Date && !isNaN(date))
    .sort((a, b) => a.date - b.date);

  return sorted[0] || {};
};

// ✅ Truck Card Component
const TruckCard = ({ truckNumber, due, details, isTruckActive, isEnglish }) => {
  const statusColor = isTruckActive ? '#4caf50' : '#e53935';
  const cardBackground = isTruckActive ? '#ffffff' : '#ffeaea';

  const statusText = isTruckActive
    ? isEnglish
      ? 'Active'
      : 'செயலில்'
    : isEnglish
    ? 'Invalid'
    : 'தவறானது';

  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <View style={styles.row}>
        <FrontTruck width={24} height={24} color="#1577EA" />
        <Text style={styles.truckNumber}>{truckNumber}</Text>
        <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      {/* Truck details */}
      {[
        { label: isEnglish ? 'RC Expiry:' : 'RC காலாவதி:', value: formatDate(details.rcExpiry) },
        { label: isEnglish ? 'Insurance:' : 'விமா:', value: formatDate(details.insurance) },
        { label: isEnglish ? 'Pollution:' : 'மாசுபாடு:', value: formatDate(details.pollution) },
        { label: isEnglish ? 'Permit:' : 'அனுமதி:', value: details.permit || '-' },
        { label: isEnglish ? 'Fitness:' : 'உடம்படுதல்:', value: formatDate(details.fitness) },
        { label: isEnglish ? 'Tyre Changed:' : 'டைர் மாற்றப்பட்டது:', value: formatDate(details.tyreChangedDate) },
        { label: isEnglish ? 'Total KM:' : 'மொத்த கிமீ:', value: details.totalKm || '-' },
      ].map((item, index) => (
        <View style={styles.detailRow} key={index}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.valueText}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

// ✅ Main Component
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

  // ✅ Filter and log expired trucks
  const sortedTrucks = allTrucks
    .map((truck) => {
      const { rcExpiry, insurance, pollution, fitness } = truck.details || {};

      const isRCValid = isValidDate(rcExpiry);
      const isInsuranceValid = isValidDate(insurance);
      const isPollutionValid = isValidDate(pollution);
      const isFitnessValid = isValidDate(fitness);

      const invalidReasons = [];
      if (!isRCValid && rcExpiry) invalidReasons.push('RC Expired');
      if (!isInsuranceValid && insurance) invalidReasons.push('Insurance Expired');
      if (!isPollutionValid && pollution) invalidReasons.push('Pollution Expired');
      if (!isFitnessValid && fitness) invalidReasons.push('Fitness Expired');

      const isTruckActive =
        isRCValid && isInsuranceValid && isPollutionValid && isFitnessValid;

      if (!isTruckActive && invalidReasons.length > 0) {
        console.warn(
          `🚨 Truck ${truck.number} marked Invalid due to: ${invalidReasons.join(', ')}`
        );
      }

      return { ...truck, isTruckActive };
    })
    .sort((a, b) => {
      const getNextExpiry = (d) => {
        const dates = [d.rcExpiry, d.insurance, d.pollution, d.fitness]
          .map((x) => new Date(x))
          .filter((x) => x instanceof Date && !isNaN(x))
          .sort((x, y) => x - y);
        return dates[0] ? dates[0].getTime() : Infinity;
      };
      return getNextExpiry(a.details) - getNextExpiry(b.details);
    });

  const activeTrucks = sortedTrucks.filter((t) => t.isTruckActive);
  const inactiveTrucks = sortedTrucks.filter((t) => !t.isTruckActive);

  // ✅ Loading animation
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowBack color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>
            {isEnglish ? 'All Trucks' : 'அனைத்து லாரிகள்'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Status Summary */}
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
              <TwoPersonIcon width={24} height={24} color="red" />
              <Text style={styles.statusTitle}>
                {isEnglish ? 'Invalid Trucks' : 'தவறான லாரிகள்'}
              </Text>
            </View>
            <Text style={[styles.statusCount, { color: 'red' }]}>
              {inactiveTrucks.length}
            </Text>
          </View>
        </View>

        {/* Active Trucks */}
        {activeTrucks.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>
              {isEnglish ? '✅ Active Trucks' : '✅ செயலில் உள்ள லாரிகள்'}
            </Text>
            {activeTrucks.map((truck, index) => (
              <TouchableOpacity
                key={`active-${index}`}
                onPress={() => navigation.navigate('TruckDetails', { truck })}
              >
                <TruckCard
                  truckNumber={truck.number}
                  due={getNearestDue(truck.details)}
                  details={truck.details}
                  isTruckActive={true}
                  isEnglish={isEnglish}
                />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Invalid Trucks */}
        {inactiveTrucks.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { color: 'red' }]}>
              {isEnglish
                ? '❌ Invalid / Expired Trucks'
                : '❌ தவறான / காலாவதியான லாரிகள்'}
            </Text>
            {inactiveTrucks.map((truck, index) => (
              <TouchableOpacity
                key={`inactive-${index}`}
                onPress={() => navigation.navigate('TruckDetails', { truck })}
              >
                <TruckCard
                  truckNumber={truck.number}
                  due={getNearestDue(truck.details)}
                  details={truck.details}
                  isTruckActive={false}
                  isEnglish={isEnglish}
                />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddTruckScreen')}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(24),
    backgroundColor: '#f9f9f9',
  },
  sectionHeader: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(8),
    marginTop: moderateScale(10),
    color: 'black',
  },
  valueText: { color: 'black' },
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
  },
  headerText: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: 'black',
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
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
  addText: {
    color: 'white',
    fontSize: moderateScale(28),
    fontWeight: 'bold',
  },
});
