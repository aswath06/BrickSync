import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { moderateScale } from '../../Screens/utils/scalingUtils';

type Material = {
  name: string;
  quantity: number;
  price: string;
};

type Job = {
  orderid: any;
  id: string;
  slNo: string;
  customer: string;
  ord: string;
  status: string;
  vehicleNumber: string;
  materials: Material[];
};

type Props = {
  title?: string;
  jobs: Job[];
  navigation: any;
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'On time':
      return { backgroundColor: '#d4f5dd', color: '#2e7d32' };
    case 'Delayed':
      return { backgroundColor: '#ffe4b3', color: '#d17b00' };
    case 'Assign':
      return { backgroundColor: '#d0e4ff', color: '#0066d6' };
    case 'Canceled':
      return { backgroundColor: '#ffd6d9', color: '#cc0000' };
    default:
      return { backgroundColor: '#eee', color: '#000' };
  }
};

export const PendingJobsTable: React.FC<Props> = ({ title = 'Pending Jobs', jobs, navigation }) => {
  const renderRow = ({ item }: { item: Job }) => {
    const statusStyle = getStatusStyle(item.status);

    const handleStatusPress = () => {
  if (item.status === 'Assign') {
    navigation.navigate('AssignJob', {
      jobId: item.id,
      customerName: item.customer,
      orderTime: item.ord,
      vehicleNumber: item.vehicleNumber,
      materials: item.materials,
      orderId: item.orderId,
      
    });
  }
};


    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.slNo}</Text>
        <Text style={[styles.cell, styles.customerCell]}>{item.customer}</Text>
        <Text style={styles.cell}>{item.ord}</Text>

        <TouchableOpacity onPress={handleStatusPress} activeOpacity={0.7}>
          <Text
            style={[
              styles.status,
              {
                backgroundColor: statusStyle.backgroundColor,
                color: statusStyle.color,
              },
            ]}
          >
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Sl.No</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Customer Name</Text>
        <Text style={styles.headerCell}>ORD</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    margin: moderateScale(16),
    elevation: 2,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
    color: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    color: '#444',
    fontSize: moderateScale(14),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    color: '#333',
    fontSize: moderateScale(14),
  },
  customerCell: {
    flex: 1.5,
    flexWrap: 'wrap',
  },
  status: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(6),
    overflow: 'hidden',
    fontWeight: '600',
    fontSize: moderateScale(12),
  },
});
