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
} from 'react-native';
import LottieView from 'lottie-react-native';
import { ArrowBack } from '../assets';
import { useProductStore } from '../stores/useProductStore';
import { useAllUsersStore } from '../stores/useAllUsersStore';
import { useToggleStore } from '../stores/useToggleStore';
import axios from 'axios';
import { baseUrl } from '../../config';
import { moderateScale } from './utils/scalingUtils';

export const CartScreen = ({ navigation, route }) => {
  const { cart, clearCart, updateCartItem, removeCartItem } = useProductStore();
  const { users } = useAllUsersStore();
  const { isEnglish } = useToggleStore();

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
      Alert.alert(
        isEnglish ? 'Customer Required' : 'வாடிக்கையாளர் தேவை',
        isEnglish
          ? 'Please select a customer before checking out.'
          : 'செக்கவுட் செய்யும் முன் ஒரு வாடிக்கையாளரைத் தேர்ந்தெடுக்கவும்.'
      );
      return;
    }
    if (cart.length === 0) {
      Alert.alert(
        isEnglish ? 'Cart is Empty' : 'சேக்கொடு காலியாக உள்ளது',
        isEnglish ? 'Please add items to the cart.' : 'சேக்கொட்டில் பொருட்களைச் சேர்க்கவும்.'
      );
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
        size: item.selectedSize || null,
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
        navigation.navigate('BillScreen', { order: orderPayload });
      } else {
        Alert.alert(
          isEnglish ? 'Error' : 'பிழை',
          isEnglish ? 'Order could not be placed. Try again.' : 'ஆர்டர் செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (isEnglish
          ? 'Something went wrong while placing the order.'
          : 'ஆர்டர் செய்யும் போது ஒரு பிழை ஏற்பட்டது.');
      Alert.alert(isEnglish ? 'Error' : 'பிழை', errorMessage);
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
      Alert.alert(
        isEnglish ? 'Invalid Quantity' : 'தவறான அளவு',
        isEnglish ? 'Quantity must be a positive number.' : 'அளவு ஒரு நேர்மறை எண்ணாக இருக்க வேண்டும்.'
      );
      return;
    }
    if (isNaN(price) || price <= 0) {
      Alert.alert(
        isEnglish ? 'Invalid Price' : 'தவறான விலை',
        isEnglish
          ? 'Unit price must be a positive number.'
          : 'ஒரு பொருளின் விலை நேர்மறை எண்ணாக இருக்க வேண்டும்.'
      );
      return;
    }

    updateCartItem(editingItem.product.id, quantity, price);
    setEditModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.image} resizeMode="contain" />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.product.name}</Text>
        {item.selectedType && (
          <Text style={styles.subText}>
            {isEnglish ? 'Type' : 'வகை'}: {item.selectedSize}
          </Text>
        )}
        <Text style={styles.subText}>
          {isEnglish ? 'Unit Price' : 'ஒரு பொருளின் விலை'}: ₹{item.product.price}
        </Text>
        <Text style={styles.subText}>
          {isEnglish ? 'Quantity' : 'அளவு'}: {item.quantity}
        </Text>
        <Text style={styles.totalPrice}>
          {isEnglish ? 'Subtotal' : 'மொத்தம்'}: ₹{item.total}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: moderateScale(6) }}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditItem(item)}>
            <Text style={{ color: '#fff', fontWeight: '500' }}>{isEnglish ? 'Edit' : 'மாற்று'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: '#E53935', marginLeft: moderateScale(8) }]}
            onPress={() =>
              Alert.alert(
                isEnglish ? 'Remove Item' : 'பொருள் அகற்று',
                isEnglish
                  ? 'Are you sure you want to remove this item from the cart?'
                  : 'இந்த பொருளை கார்டில் இருந்து அகற்ற விரும்புகிறீர்களா?',
                [
                  { text: isEnglish ? 'Cancel' : 'ரத்து செய்', style: 'cancel' },
                  { text: isEnglish ? 'Yes' : 'ஆம்', style: 'destructive', onPress: () => removeCartItem(item.product.id) },
                ]
              )
            }
          >
            <Text style={{ color: '#fff', fontWeight: '500' }}>{isEnglish ? 'Remove' : 'அகற்று'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{isEnglish ? 'Your Cart' : 'உங்கள் கார்ட்'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.selectedCustomerContainer}>
        {selectedCustomer ? (
          <Text style={styles.selectedCustomerText}>
            {isEnglish ? 'Selected Customer' : 'தேர்ந்தெடுக்கப்பட்ட வாடிக்கையாளர்'}: {selectedCustomer.name}
          </Text>
        ) : (
          <Text style={styles.selectedCustomerText}>
            {isEnglish ? 'No customer selected.' : 'ஒரு வாடிக்கையாளர் தேர்ந்தெடுக்கப்படவில்லை.'}
          </Text>
        )}

        <TouchableOpacity
          style={styles.selectCustomerButton}
          onPress={() => navigation.navigate('CustomerListScreen', { customers })}
        >
          <Text style={styles.selectCustomerText}>
            {selectedCustomer
              ? isEnglish
                ? 'Change Customer'
                : 'வாடிக்கையாளரை மாற்றவும்'
              : isEnglish
              ? 'Select Customer'
              : 'வாடிக்கையாளரை தேர்ந்தெடுக்கவும்'}
          </Text>
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>{isEnglish ? 'Your cart is empty.' : 'உங்கள் கார்ட் காலியாக உள்ளது.'}</Text>
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
              <Text style={styles.totalLabel}>{isEnglish ? 'Grand Total' : 'மொத்தம்'}</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>

            <View style={{ flex: 1, marginLeft: moderateScale(10) }}>
              <Text style={styles.totalLabel}>{isEnglish ? 'Transport Charge' : 'போக்குவரத்து கட்டணம்'}</Text>
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
            <Text style={styles.checkoutText}>{isEnglish ? 'Proceed to Checkout' : 'செக்கவுட் செய்யவும்'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>{isEnglish ? 'Clear Cart' : 'கார்டை காலி செய்யவும்'}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Edit Item Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEnglish ? 'Edit Item' : 'பொருளை மாற்றவும்'}</Text>
            <Text>{isEnglish ? 'Unit Price:' : 'ஒரு பொருளின் விலை:'}</Text>
            <TextInput style={styles.modalInput} keyboardType="numeric" value={editPrice} onChangeText={setEditPrice} />
            <Text>{isEnglish ? 'Quantity:' : 'அளவு:'}</Text>
            <TextInput style={styles.modalInput} keyboardType="numeric" value={editQty} onChangeText={setEditQty} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{isEnglish ? 'Save' : 'சேமி'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{isEnglish ? 'Cancel' : 'ரத்து செய்'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Lottie Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <LottieView source={require('../assets/lottie/AddToCartSuccess.json')} autoPlay loop style={{ width: 150, height: 150 }} />
        </View>
      )}
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
  card: { flexDirection: 'row', backgroundColor: '#EAF1FB', borderRadius: moderateScale(16), padding: moderateScale(10), marginBottom: moderateScale(16) },
  image: { width: moderateScale(100), height: moderateScale(100), borderRadius: moderateScale(10), marginRight: moderateScale(12) },
  infoContainer: { flex: 1 },
  editButton: { backgroundColor: '#1577EA', paddingVertical: moderateScale(6), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(8), alignItems: 'center' },
  selectCustomerButton: { backgroundColor: '#1577EA', paddingVertical: moderateScale(8), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(8), marginTop: moderateScale(8), alignSelf: 'flex-start' },
  selectCustomerText: { color: '#fff', fontSize: moderateScale(14), fontWeight: '500' },
  productName: { fontSize: moderateScale(15), fontWeight: '600', color: '#1E1E1E', marginBottom: moderateScale(4) },
  subText: { fontSize: moderateScale(13), color: '#555', marginBottom: moderateScale(2) },
  totalPrice: { fontSize: moderateScale(14), fontWeight: 'bold', color: '#1577EA', marginTop: moderateScale(4) },
  summaryContainer: { backgroundColor: '#fff', borderTopWidth: moderateScale(1), borderTopColor: '#ddd', paddingVertical: moderateScale(12), paddingHorizontal: moderateScale(16), flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScale(10) },
  totalLabel: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#333' },
  totalValue: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#1577EA' },
  transportInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: moderateScale(8), padding: moderateScale(6), fontSize: moderateScale(14), marginTop: moderateScale(4), color: '#000' },
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
