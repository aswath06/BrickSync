import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type DashboardInfoCardProps = {
  height?: number;
  icon: any; // Supports require() or { uri: '' }
  title: string;
  value: string | number;
};

export const DashboardInfoCard: React.FC<DashboardInfoCardProps> = ({
  height = 120,
  icon,
  title,
  value,
}) => {
  return (
    <View style={[styles.card, { height }]}>
      <View style={styles.row}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 16,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
     textAlign: 'center',        
    alignSelf: 'center',   
  },
});
