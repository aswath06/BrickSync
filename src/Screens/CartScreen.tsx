import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ArrowBack } from '../assets';
import { useProductStore } from '../stores/useProductStore';

export const CartScreen = ({ navigation }: any) => {
  const { cart, clearCart } = useProductStore();

  const totalAmount = cart.reduce((acc, item) => acc + item.total, 0);

  const renderItem = ({ item }: any) => (
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

          <TouchableOpacity style={styles.checkoutButton}>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 42,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E1E',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 100,
  },
  cartList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#EAF1FB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  subText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1577EA',
    marginTop: 6,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1577EA',
  },
  checkoutButton: {
    backgroundColor: '#1577EA',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
