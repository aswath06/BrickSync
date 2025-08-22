// TodaySummary.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { moderateScale } from './utils/scalingUtils';
import { baseUrl } from '../../config';
import LottieView from 'lottie-react-native';
import { ArrowBack, ClockIcon } from '../assets';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

export const TodaySummary = ({ navigation }: any) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/orders`);
      const data = await response.json();
      if (response.ok || Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Failed to fetch orders', data);
      }
    } catch (err) {
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by selected date
  const filteredOrders = orders.filter(order =>
    moment(order.createdAt).isSame(selectedDate, 'day')
  );

  // Calculate total sales for filtered orders
  const totalSales = filteredOrders.reduce((sum, order) => {
    const orderTotal = order.products?.reduce((pSum, product) => {
      return pSum + Number(product.price) * Number(product.quantity);
    }, 0) || 0;
    return sum + orderTotal;
  }, 0);

  const renderOrder = ({ item }) => {
    const orderDate = moment(item.createdAt).format('DD MMM YYYY, hh:mm A');

    return (
      <View style={styles.card}>
        <Text style={styles.date}>{orderDate}</Text>
        <Text style={styles.userName}>Customer: {item.User?.name || 'N/A'}</Text>
        {item.products && item.products.length > 0 ? (
          item.products.map((product, idx) => (
            <View key={idx} style={styles.productBlock}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productInfo}>
                Quantity: {product.quantity} | Price: ₹{product.price}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.productInfo}>No products listed</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <LottieView
          source={require('../assets/lottie/Roboloading.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Today's Orders</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <ClockIcon width={24} height={24} color="#1577EA" />
        </TouchableOpacity>
      </View>

      <Text style={styles.selectedDate}>
        {moment(selectedDate).format('DD MMM YYYY')}
      </Text>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: moderateScale(16), paddingBottom: moderateScale(80) }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>
            No orders found for this date.
          </Text>
        }
      />

      {/* Total Sales */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Today's Total Sales: ₹{totalSales}</Text>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(42),
    paddingBottom: moderateScale(16),
    backgroundColor: '#fff',
  },
  title: { fontSize: moderateScale(18), fontWeight: '600', color: '#1E1E1E' },
  selectedDate: {
    textAlign: 'center',
    marginVertical: moderateScale(8),
    fontSize: moderateScale(14),
    color: '#1577EA',
  },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    elevation: moderateScale(3),
  },
  date: { fontSize: moderateScale(12), color: '#777', marginBottom: moderateScale(6) },
  userName: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#1E1E1E', marginBottom: moderateScale(8) },
  productBlock: { backgroundColor: '#e9f1ff', borderRadius: moderateScale(8), padding: moderateScale(8), marginBottom: moderateScale(6) },
  productName: { fontSize: moderateScale(14), fontWeight: '600', color: '#000' },
  productInfo: { fontSize: moderateScale(12), color: '#333' },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: moderateScale(16),
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
    elevation: moderateScale(5),
    alignItems: 'center',
  },
  totalText: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#1577EA' },
});
