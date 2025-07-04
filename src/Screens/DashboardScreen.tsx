import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { JobCard, MainCard, UserHeaderCard } from '../Component';

export const DashboardScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <UserHeaderCard
        name="Michael"
        imageUrl="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca"
        width={380}
        height={64}
      />

      <View style={styles.section}>
        <MainCard 
          name="Aswath M" 
          company="Aswath Hollow Bricks and Lorry Services"
          balance="₹12,500"
          advance="₹5,000"
          driverId="DRV1234"
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
        //   statusText="On time"
        //   statusColor="#D1FADF"
          width={380}
        />
      </View>
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
});
