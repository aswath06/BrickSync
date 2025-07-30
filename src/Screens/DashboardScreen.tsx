import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { JobCard, MainCard, PendingJobsTable, UserHeaderCard } from '../Component';
import { DashboardInfoCard } from '../Component/DashboardInfoCard';
import { useUserStore } from '../stores/useUserStore';
import { baseUrl } from '../../config';

export const DashboardScreen = ({ navigation }) => {
  const user = useUserStore((state) => state.user);
  const userRole = user?.userrole;
  const [jobData, setJobData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/orders`);
    const data = await response.json();

    const transformed = data.map((item, index) => ({
  id: item.id.toString(),
  slNo: (index + 1).toString(),
  customer: item.User?.name || 'Unknown',
  ord: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
  vehicleNumber: item.vehicleNumber || item.Vehicle?.vehicleNumber || 'N/A',
  materials: Array.isArray(item.products)
    ? item.products.map((p) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      }))
    : [],
}));

    setJobData(transformed);
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
  }
};


  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs().finally(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <UserHeaderCard
        name={user?.name || 'Guest'}
        imageUrl="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca"
        width={380}
        height={64}
      />

      {userRole === 2 ? (
        <>
          <View style={styles.section}>
            <MainCard
              name={user?.name || 'Guest'}
              company="Aswath Hollow Bricks and Lorry Services"
              balance={user?.balance}
              advance={user?.advance}
              driverId={user?.userid || 'null'}
              width={380}
              height={170}
            />
          </View>

          <View style={styles.section}>
            <JobCard
              slNo="01"
              customerName="Litisha"
              customerPhone="9976625704"
              loadDetails={['Maha cement * 2', 'M-Sand - 1 unit']}
              buttonLabel="Noted"
              width={380}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.cardRow}>
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png' }}
              title="All Jobs"
              value={23}
            />
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
              title="Completed Jobs"
              value={234}
            />
          </View>

          <View style={styles.cardRow1}>
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
              title="All Users"
              value={12}
            />
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/743/743007.png' }}
              title="Drivers"
              value={23}
            />
          </View>

          <View style={styles.tableContainer}>
            <PendingJobsTable title="Pending Jobs" jobs={jobData} navigation={navigation} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 42,
    paddingBottom: 32,
    alignItems: 'center',
  },
  section: {
    marginTop: 32,
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  cardRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tableContainer: {
    width: 450,
    paddingHorizontal: 16,
  },
});
