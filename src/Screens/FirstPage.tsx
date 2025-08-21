import React from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from './utils/scalingUtils';

export const FirstPage = () => {
  const navigation = useNavigation(); // Access navigation

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Image
        source={require('../assets/images/image.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlayContainer}>
        <Text style={styles.quote}>Aswath Hollow Bricks and Lorry Service</Text>

        <Text style={styles.tagline}>
          Delivering quality bricks and reliable transport services you can count on — built strong, built to last.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginScreen')} // 👈 Navigate to Login screen
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: moderateScale(40),
    width: '100%',
    paddingHorizontal: moderateScale(24),
    alignItems: 'center',
  },
  quote: {
    fontSize: moderateScale(25),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: moderateScale(80),
  },
  tagline: {
    fontSize: moderateScale(14),
    color: '#000',
    textAlign: 'center',
    marginBottom: moderateScale(70),
  },
  button: {
    backgroundColor: '#0a7cf3',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(20),
    width: '100%',
    height: moderateScale(50),
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});
