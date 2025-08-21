// src/screens/CustomerListScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { moderateScale } from './utils/scalingUtils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding + 16px gap

export const CustomerListScreen = ({ route, navigation }) => {
  const { customers } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
       navigation.navigate('Cart', { selectedCustomer: item });
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.image ||
              'https://static.vecteezy.com/system/resources/previews/029/271/062/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg',
          }}
          style={styles.image}
        />
        <View style={styles.roleBanner}>
          <Text style={styles.roleText}>Customer</Text>
        </View>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>Phone: {item.phone}</Text>
      <Text style={styles.detail}>Email: {item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customer List</Text>
      {customers.length > 0 ? (
        <FlatList
          data={customers}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      ) : (
        <Text style={styles.text}>No customers found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    paddingTop: moderateScale(42),
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: moderateScale(16),
    textAlign: 'center',
    color: '#000',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: moderateScale(16),
  },
  card: {
    width: CARD_WIDTH, // keep dynamic, can scale if needed
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: moderateScale(0), height: moderateScale(2) },
    shadowRadius: moderateScale(4),
    elevation: moderateScale(3),
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: moderateScale(8),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  roleBanner: {
    position: 'absolute',
    top: moderateScale(6),
    right: moderateScale(6),
    backgroundColor: '#007bff',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(6),
  },
  roleText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: moderateScale(4),
  },
  detail: {
    fontSize: moderateScale(14),
    color: '#444',
    marginTop: moderateScale(2),
    textAlign: 'center',
  },
  text: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginTop: moderateScale(20),
    color: '#000',
  },
});
