// src/screens/CartScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ArrowBack } from '../assets';
import { useProductStore } from '../stores/useProductStore';
import { useAllUsersStore } from '../stores/useAllUsersStore';
import axios from 'axios';
import { baseUrl } from '../../config';
import { moderateScale } from './utils/scalingUtils';


export const CartScreen = ({ navigation, route }) => {
  const { cart, clearCart } = useProductStore();
  const { users } = useAllUsersStore();

  const selectedCustomer = route?.params?.selectedCustomer;
  const totalAmount = cart.reduce((acc, item) => acc + item.total, 0);
  const customers = users.filter((user) => user.userrole === 3);

  const handleCheckout = async () => {
  if (!selectedCustomer) {
    Alert.alert('Customer Required', 'Please select a customer before checking out.');
    return;
  }

  if (cart.length === 0) {
    Alert.alert('Cart is Empty', 'Please add items to the cart.');
    return;
  }

  const orderPayload = {
    orderId: `ORD${Date.now()}`,
    vehicleNumber: 'TN39CK1288',
    userId: selectedCustomer.userid,
    customerName: selectedCustomer.name,
    products: cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    })),
  };

  try {
    const response = await axios.post(`${baseUrl}/api/orders`, orderPayload, {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // optional: wait max 5 seconds
});

    
    // Debug: print backend response
    console.log('Response:', response.data);

    if (response.status === 200 || response.status === 201) {
      Alert.alert('Success', 'Order placed successfully!');
      clearCart();
      navigation.navigate('DashboardScreen', { screen: 'Profile' });


    } else {
      Alert.alert('Error', 'Order could not be placed. Try again.');
    }
  } catch (error) {
    console.error('Order error:', error.response?.data || error.message);

    const errorMessage =
      error.response?.data?.message || 'Something went wrong while placing the order.';

    Alert.alert('Error', errorMessage);
  }
};


  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.product.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.productName}>{item.product.name}</Text>
      <Text style={styles.category}>Category: {item.product.category}</Text>
      {item.selectedType && <Text style={styles.subText}>Type: {item.selectedType}</Text>}
      {item.selectedSize && <Text style={styles.subText}>Size: {item.selectedSize}</Text>}
      <Text style={styles.subText}>Unit Price: {item.product.price}</Text>
      <Text style={styles.subText}>Quantity: {item.quantity}</Text>
      <Text style={styles.totalPrice}>Subtotal: ₹{item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <View style={{ width: 24 }} />
      </View>

     <View style={styles.selectedCustomerContainer}>
  {selectedCustomer ? (
    <Text style={styles.selectedCustomerText}>
      Selected Customer: {selectedCustomer.name}
    </Text>
  ) : (
    <Text style={styles.selectedCustomerText}>
      No customer selected.
    </Text>
  )}

  <TouchableOpacity
    style={styles.selectCustomerButton}
    onPress={() => navigation.navigate('CustomerListScreen', { customers })}
  >
    <Text style={styles.selectCustomerText}>
      {selectedCustomer ? 'Change Customer' : 'Select Customer'}
    </Text>
  </TouchableOpacity>
</View>


      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => item.product.id + index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryContainer}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: moderateScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: moderateScale(42),
    marginBottom: moderateScale(16),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#1E1E1E',
  },
  selectedCustomerContainer: {
    backgroundColor: '#D0EBFF',
    padding: moderateScale(10),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(10),
  },
  selectedCustomerText: {
    fontSize: moderateScale(15),
    color: '#000',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#999',
    textAlign: 'center',
    marginTop: moderateScale(100),
  },
  cartList: {
    paddingBottom: moderateScale(20),
  },
  card: {
    backgroundColor: '#EAF1FB',
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    marginBottom: moderateScale(16),
  },
  image: {
    width: '100%',
    height: moderateScale(120),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  selectCustomerButton: {
    backgroundColor: '#1577EA',
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(8),
    alignSelf: 'flex-start',
  },
  selectCustomerText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  productName: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: moderateScale(4),
  },
  category: {
    fontSize: moderateScale(13),
    color: '#444',
    marginBottom: moderateScale(2),
  },
  subText: {
    fontSize: moderateScale(13),
    color: '#555',
    marginBottom: moderateScale(2),
  },
  totalPrice: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#1577EA',
    marginTop: moderateScale(6),
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderTopWidth: moderateScale(1),
    borderTopColor: '#ddd',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(10),
  },
  totalLabel: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1577EA',
  },
  checkoutButton: {
    backgroundColor: '#1577EA',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: moderateScale(12),
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  clearButton: {
    backgroundColor: '#E53935',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(15),
  },
});
