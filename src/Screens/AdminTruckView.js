import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { ArrowBack, DropdownIcon, FrontTruck, TwoPersonIcon } from '../assets';
import { useTruckStore } from '../stores/useTruckStore';

const isValidDate = (dateStr) => new Date(dateStr) > new Date();

const getNearestDue = (details) => {
  const fields = [
    { label: 'RC', date: details.rcExpiry },
    { label: 'Insurance', date: details.insurance },
    { label: 'Pollution', date: details.pollution },
  ];

  const expired = [];
  const dueSoon = [];

  fields.forEach(({ label, date }) => {
    const expiryDate = new Date(date);
    const now = new Date();
    const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24);
    if (diffDays <= 0) expired.push(label);
    else if (diffDays <= 5) dueSoon.push(label);
  });

  if (details.permit.toLowerCase() !== 'yes') expired.push('Permit');

  if (expired.length > 0) return { type: 'expired', labels: expired };
  if (dueSoon.length > 0) return { type: 'due', labels: dueSoon };
  return null;
};

const TruckCard = ({ truckNumber, due, expanded, onToggle, details, isTruckActive }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(expanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.9} style={styles.truckCard}>
      <View style={styles.row}>
        <View style={styles.truckIconBox}>
          <FrontTruck width={24} height={24} />
        </View>
        <Text style={styles.truckNumber}>{truckNumber}</Text>

        <View style={styles.statusWithArrow}>
          <Text style={[styles.statusBadge, isTruckActive ? styles.active : styles.inactive]}>
            {isTruckActive ? 'Active' : 'Inactive'}
          </Text>
          <TouchableOpacity onPress={onToggle} style={styles.iconPadding}>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <DropdownIcon width={16} height={16} color="#000" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dueRow}>
        {due ? (
          <Text
            style={[
              styles.dueText,
              due.type === 'due' && { color: 'orange', fontWeight: 'bold' },
              due.type === 'expired' && { color: 'red', fontWeight: 'bold' },
            ]}
          >
            {due.type === 'expired' ? 'Expired: ' : 'Upcoming Due: '}
            {due.labels.join(', ')}
          </Text>
        ) : (
          <Text style={styles.dueText}>Upcoming Due: None</Text>
        )}
      </View>

      <Animated.View style={[styles.extraDetails, { height: maxHeight, overflow: 'hidden' }]}>
        <Text style={[styles.detailText, !isValidDate(details.rcExpiry) && styles.invalidText]}>
          RC Expiry: {details.rcExpiry}
        </Text>
        <Text style={[styles.detailText, !isValidDate(details.insurance) && styles.invalidText]}>
          Insurance: {details.insurance}
        </Text>
        <Text style={[styles.detailText, details.permit.toLowerCase() !== 'yes' && styles.invalidText]}>
          Permit Valid: {details.permit}
        </Text>
        <Text style={[styles.detailText, !isValidDate(details.pollution) && styles.invalidText]}>
          Pollution Expiry: {details.pollution}
        </Text>
        <TouchableOpacity onPress={() => alert(`Driver: ${details.driver}`)}>
          <Text style={[styles.detailText, styles.linkText]}>Driver: {details.driver}</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const AdminTruckView = ({ overrideTrucks }) => {
  const [expandedTruckIndex, setExpandedTruckIndex] = useState(null);
  const { trucks } = useTruckStore();
  const allTrucks = overrideTrucks || trucks;

  const handleToggle = (index) => {
    setExpandedTruckIndex((prev) => (prev === index ? null : index));
  };

  const sortedTrucks = allTrucks
    .map((truck) => {
      const { rcExpiry, insurance, permit, pollution } = truck.details;
      const isRCValid = isValidDate(rcExpiry);
      const isInsuranceValid = isValidDate(insurance);
      const isPollutionValid = isValidDate(pollution);
      const isPermitValid = permit.toLowerCase() === 'yes';
      const isTruckActive = isRCValid && isInsuranceValid && isPollutionValid && isPermitValid;
      return { ...truck, isTruckActive };
    })
    .sort((a, b) => {
      const getNextExpiry = (d) =>
        Math.min(
          new Date(d.rcExpiry).getTime(),
          new Date(d.insurance).getTime(),
          new Date(d.pollution).getTime()
        );
      return getNextExpiry(a.details) - getNextExpiry(b.details);
    });

  const activeTrucks = sortedTrucks.filter((t) => t.isTruckActive);
  const inactiveTrucks = sortedTrucks.filter((t) => !t.isTruckActive);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }} style={styles.container}>
      <View style={styles.headerContainer}>
        <ArrowBack color="black" />
        <Text style={styles.headerText}>Your Trucks</Text>
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
            <TwoPersonIcon width={24} height={24} color="red" />
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
            expanded={expandedTruckIndex === index}
            onToggle={() => handleToggle(index)}
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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: 'black',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: 180,
    height: 103,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'black',
    marginLeft: 6,
  },
  statusCount: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: 'black',
  },
  truckCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truckIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  truckNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: 'black',
  },
  statusWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  statusBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  iconPadding: {
    paddingLeft: 6,
  },
  active: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
  },
  inactive: {
    backgroundColor: '#ffcdd2',
    color: '#c62828',
  },
  dueRow: {
    marginTop: 10,
  },
  dueText: {
    fontSize: 14,
    fontFamily: 'AbeeZee-Regular',
    color: 'black',
  },
  extraDetails: {
    marginTop: 10,
    paddingLeft: 4,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'AbeeZee-Regular',
    color: '#444',
    marginBottom: 4,
  },
  invalidText: {
    color: 'red',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
});
