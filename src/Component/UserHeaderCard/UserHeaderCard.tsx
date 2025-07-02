import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { BellIcons } from '../../assets';

type Props = {
  name: string;
  imageUrl: string;
  width?: number | string;
  height?: number | string;
  containerStyle?: ViewStyle;
};

export const UserHeaderCard: React.FC<Props> = ({
  name,
  imageUrl,
  width = '100%',
  height = 80,
  containerStyle
}) => {
  return (
    <View style={[styles.container, { width, height }, containerStyle]}>
      <Image source={{ uri: imageUrl }} style={styles.avatar} />
      <Text style={styles.greeting}>Hey, {name}</Text>
      <TouchableOpacity>
        <BellIcons />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B3235',
    flex: 1,
    textAlign: 'center',
  },
});
