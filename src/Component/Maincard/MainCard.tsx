import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type MainCardProps = {
  name: string;
  company: string;
  balance: number;
  advance: number;
  driverId: string;
  width?: number | string;
  height?: number | string;
};

export const MainCard: React.FC<MainCardProps> = ({ 
  name, 
  company, 
  balance, 
  advance, 
  driverId,
  width = 380,
  height = 170,
}) => {
  return (
    <View style={[styles.card, { width, height }]}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <TouchableOpacity>
          <Text style={styles.more}>⋯</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.company}>{company}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.value}>{balance}</Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>Advance</Text>
          <Text style={styles.value}>{advance}</Text>
        </View>

        <View style={styles.detail}>
          <Text style={styles.label}>Driver Id</Text>
          <Text style={styles.value}>{driverId}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0a7cf3',
    borderRadius: 20,
    padding: 16,
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
  },
  more: {
    fontSize: 26,
    color: '#9fcaff',
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#fff',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
