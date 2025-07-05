import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Orders = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Orders page</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
