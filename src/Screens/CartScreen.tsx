// src/screens/CartScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { ArrowBack } from '../assets';
import { useProductStore } from '../stores/useProductStore';
import { useAllUsersStore } from '../stores/useAllUsersStore';
import axios from 'axios';
import { baseUrl } from '../../config';
import { moderateScale } from './utils/scalingUtils';

export const CartScreen = ({ navigation, route }) => {
  const { cart, clearCart, updateCartItem, removeCartItem } = useProductStore();
  const { users } = useAllUsersStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [transportCharge, setTransportCharge] = useState('0');
  const [loading, setLoading] = useState(false);

  const selectedCustomer = route?.params?.selectedCustomer;
  const customers = users.filter((user) => user.userrole === 3);

  const cartTotal = cart.reduce((acc, item) => acc + item.total, 0);
  const grandTotal = cartTotal + parseFloat(transportCharge || '0');

  const handleCheckout = async () => {
    if (!selectedCustomer) {
      Alert.alert('Customer Required', 'Please select a customer before checking out.');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to the cart.');
      return;
    }

    setLoading(true);

    const orderPayload = {
      orderId: `ORD${Date.now()}`,
      vehicleNumber: 'TN39CK1288',
      userId: selectedCustomer.userid,
      customerName: selectedCustomer.name,
      transportCharge: parseFloat(transportCharge) || 0,
      products: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    try {
      const response = await axios.post(`${baseUrl}/api/orders`, orderPayload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });

      if (response.status === 200 || response.status === 201) {
        clearCart();
        setTransportCharge('0');

        // Navigate to BillScreen with order details
        navigation.navigate('BillScreen', { order: orderPayload });
      } else {
        Alert.alert('Error', 'Order could not be placed. Try again.');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong while placing the order.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditQty(item.quantity.toString());
    setEditPrice(item.product.price.toString());
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    const quantity = parseInt(editQty);
    const price = parseFloat(editPrice);

    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('Invalid Quantity', 'Quantity must be a positive number.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      Alert.alert('Invalid Price', 'Unit price must be a positive number.');
      return;
    }

    updateCartItem(editingItem.product.id, quantity, price);
    setEditModalVisible(false);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={{ position: 'relative' }}>
        <Image source={{ uri: item.product.imageUrl }} style={styles.image} resizeMode="contain" />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              'Remove Item',
              'Are you sure you want to remove this item from the cart?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', style: 'destructive', onPress: () => removeCartItem(item.product.id) },
              ]
            )
          }
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>X</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.productName}>{item.product.name}</Text>
      <Text style={styles.category}>Category: {item.product.category}</Text>
      {item.selectedType && <Text style={styles.subText}>Type: {item.selectedType}</Text>}
      {item.selectedSize && <Text style={styles.subText}>Size: {item.selectedSize}</Text>}
      <Text style={styles.subText}>Unit Price: {item.product.price}</Text>
      <Text style={styles.subText}>Quantity: {item.quantity}</Text>
      <Text style={styles.totalPrice}>Subtotal: ₹{item.total}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditItem(item)}
      >
        <Text style={{ color: '#fff', fontWeight: '500' }}>Edit</Text>
      </TouchableOpacity>
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
          <Text style={styles.selectedCustomerText}>No customer selected.</Text>
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
            <View style={{ flex: 1 }}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>

            <View style={{ flex: 1, marginLeft: moderateScale(10) }}>
              <Text style={styles.totalLabel}>Transport Charge</Text>
              <TextInput
                style={styles.transportInput}
                keyboardType="numeric"
                value={transportCharge}
                onChangeText={setTransportCharge}
                placeholder="0"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.checkoutButton, loading && { opacity: 0.7 }]}
            onPress={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Edit Item Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <Text>Unit Price:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={editPrice}
              onChangeText={setEditPrice}
            />
            <Text>Quantity:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={editQty}
              onChangeText={setEditQty}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: moderateScale(16) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: moderateScale(42), marginBottom: moderateScale(16) },
  title: { fontSize: moderateScale(18), fontWeight: '600', color: '#1E1E1E' },
  selectedCustomerContainer: { backgroundColor: '#D0EBFF', padding: moderateScale(10), borderRadius: moderateScale(8), marginBottom: moderateScale(10) },
  selectedCustomerText: { fontSize: moderateScale(15), color: '#000', fontWeight: '500' },
  emptyText: { fontSize: moderateScale(16), color: '#999', textAlign: 'center', marginTop: moderateScale(100) },
  cartList: { paddingBottom: moderateScale(20) },
  card: { backgroundColor: '#EAF1FB', borderRadius: moderateScale(16), padding: moderateScale(14), marginBottom: moderateScale(16) },
  image: { width: '100%', height: moderateScale(120), borderRadius: moderateScale(10), marginBottom: moderateScale(10) },
  deleteButton: { position: 'absolute', top: moderateScale(8), right: moderateScale(8), backgroundColor: '#E53935', width: moderateScale(28), height: moderateScale(28), borderRadius: moderateScale(14), justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  editButton: { backgroundColor: '#1577EA', paddingVertical: moderateScale(6), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(8), alignSelf: 'flex-start', marginTop: moderateScale(8) },
  selectCustomerButton: { backgroundColor: '#1577EA', paddingVertical: moderateScale(8), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(8), marginTop: moderateScale(8), alignSelf: 'flex-start' },
  selectCustomerText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '500' },
  productName: { fontSize: moderateScale(15), fontWeight: '600', color: '#1E1E1E', marginBottom: moderateScale(4) },
  category: { fontSize: moderateScale(13), color: '#444', marginBottom: moderateScale(2) },
  subText: { fontSize: moderateScale(13), color: '#555', marginBottom: moderateScale(2) },
  totalPrice: { fontSize: moderateScale(14), fontWeight: 'bold', color: '#1577EA', marginTop: moderateScale(6) },
  summaryContainer: { backgroundColor: '#fff', borderTopWidth: moderateScale(1), borderTopColor: '#ddd', paddingVertical: moderateScale(12), paddingHorizontal: moderateScale(16), flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScale(10) },
  totalLabel: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#1577EA' },
  transportInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: moderateScale(8), padding: moderateScale(6), fontSize: moderateScale(14), marginTop: moderateScale(4) },
  checkoutButton: { backgroundColor: '#1577EA', paddingVertical: moderateScale(14), borderRadius: moderateScale(12), alignItems: 'center', marginTop: moderateScale(12) },
  checkoutText: { color: '#fff', fontWeight: '600', fontSize: moderateScale(16) },
  clearButton: { backgroundColor: '#E53935', paddingVertical: moderateScale(12), borderRadius: moderateScale(12), alignItems: 'center', marginTop: moderateScale(10) },
  clearButtonText: { color: '#fff', fontWeight: 'bold', fontSize: moderateScale(15) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: moderateScale(12), padding: moderateScale(20) },
  modalTitle: { fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: moderateScale(12) },
  modalInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: moderateScale(8), padding: moderateScale(8), marginBottom: moderateScale(12) },
  saveButton: { backgroundColor: '#4CAF50', padding: moderateScale(10), borderRadius: moderateScale(8), flex: 1, marginRight: moderateScale(8), alignItems: 'center' },
  cancelButton: { backgroundColor: '#F44336', padding: moderateScale(10), borderRadius: moderateScale(8), flex: 1, marginLeft: moderateScale(8), alignItems: 'center' },
});
