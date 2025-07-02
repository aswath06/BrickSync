import React from 'react';
import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';

export const FirstPage = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Image
        source={require('../assets/images/image.png')} // Update path if needed
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.overlayContainer}>
        <Text style={styles.quote}>Aswath Hollow Bricks and Lorry Service</Text>
        
        <Text style={styles.tagline}>
          Delivering quality bricks and reliable transport services you can count on — built strong, built to last.
        </Text>

        <TouchableOpacity style={styles.button}>
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
    bottom: 40,
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  quote: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  tagline: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 70,
  },
  button: {
    backgroundColor: '#0a7cf3',
    paddingVertical: 14,
    borderRadius: 20,
    width: '100%',
    height:50,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
