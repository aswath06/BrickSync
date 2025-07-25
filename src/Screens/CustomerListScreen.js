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
    padding: 16,
    paddingTop: 42,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  roleBanner: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#007bff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#000',
  },
});
