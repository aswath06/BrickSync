import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { JobCard, MainCard, PendingJobsTable, UserHeaderCard } from '../Component';
import { DashboardInfoCard } from '../Component/DashboardInfoCard';
import { TwoPersonIcon } from '../assets';
import { useUserStore } from '../stores/useUserStore';


const jobData = [
  { id: '1', slNo: '1', customer: 'City center', ord: '5 min', status: 'On time' },
  { id: '2', slNo: '2', customer: 'Airport', ord: '10 min', status: 'Delayed' },
  { id: '3', slNo: '3', customer: 'University', ord: '20 min', status: 'Assign' },
  { id: '4', slNo: '4', customer: 'Shopping Mall', ord: '25 min', status: 'Canceled' },
];

export const DashboardScreen = () => {
  const user = useUserStore((state) => state.user);
  // const userRole = 1;
  const userRole = user?.userrole;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              balance="₹12,500"
              advance="₹5,000"
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
              // icon={<TwoPersonIcon/>}
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
            <PendingJobsTable title="Pending Jobs" jobs={jobData} />
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
