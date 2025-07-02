import React from 'react';
import { View, ScrollView } from 'react-native';
import { MainCard } from '../../Component';
import { UserHeaderCard } from '../../Component/UserHeaderCard';

export const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <MainCard 
          name="Aswath M" 
          company="Aswath Hollow Bricks and Lorry Services"
          balance="₹12,500"
          advance="₹5,000"
          driverId="DRV1234"
           width="90%"
        height={170}
        /> */}
        {/* <UserHeaderCard
  name="Michael"
  imageUrl="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca"
  width={380}
  height={64}
/> */}
      </View>
    </ScrollView>
  );
};
