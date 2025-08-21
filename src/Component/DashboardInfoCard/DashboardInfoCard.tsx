import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale } from '../../Screens/utils/scalingUtils';

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
    width: moderateScale(170),
    borderRadius: moderateScale(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: moderateScale(16),
    margin: moderateScale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  icon: {
    width: moderateScale(26),
    height: moderateScale(26),
    marginRight: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#000',
  },
  value: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
