// src/screens/BillScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { moderateScale } from './utils/scalingUtils';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import { useToggleStore } from '../stores/useToggleStore';

export const BillScreen = ({ route }) => {
  const { order } = route.params; // receive order data
  const navigation = useNavigation();
  const { isEnglish } = useToggleStore();

  // Helper to get product size
  const getItemSize = (item) => item.selectedSize || item.size || item.type || '-';

  // Render each product row
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{getItemSize(item)}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.quantity}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.price}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.quantity * item.price}</Text>
    </View>
  );

  const totalAmount =
    order.products.reduce((acc, item) => acc + item.quantity * item.price, 0) +
    (order.transportCharge || 0);

  // Handle sharing the bill
  const handleShare = async () => {
    try {
      let billText = `${isEnglish ? 'Aswath Hollow Bricks & Lorry Service' : 'அஸ்வத் ஹாலோ பிரிக்ஸ் மற்றும் லாரி சேவை'}\nSS Tower, Pandian Nagar Bus Stop, Tiruppur - 641602\nMobile: 9843083521 / 9842048181\nEmail: maswath8812@gmail.com\n\n${isEnglish ? 'Invoice / Bill' : 'சரக்கு / விலைப்பட்டியல்'}\n\n${isEnglish ? 'Customer' : 'வாடிக்கையாளர்'}: ${order.customerName}\n${isEnglish ? 'Vehicle No' : 'வாகன எண்'}: ${order.vehicleNumber}\n${isEnglish ? 'Order ID' : 'ஆர்டர் எண்'}: ${order.orderId}\n${order.date ? `${isEnglish ? 'Date' : 'தேதி'}: ${order.date}\n` : ''}\n\n#  ${isEnglish ? 'Material' : 'பொருள்'}       ${isEnglish ? 'Size' : 'வகை'}   ${isEnglish ? 'Qty' : 'அளவு'}   ${isEnglish ? 'Price' : 'விலை'}   ${isEnglish ? 'Subtotal' : 'மொத்தம்'}\n`;

      order.products.forEach((item, index) => {
        billText += `${index + 1}  ${item.name}  ${getItemSize(item)}  ${item.quantity}  ${item.price}  ${item.quantity * item.price}\n`;
      });

      billText += `\n${isEnglish ? 'Transport Charge' : 'போக்குவரத்து கட்டணம்'}: ₹${order.transportCharge}\n${isEnglish ? 'Grand Total' : 'மொத்தம்'}: ₹${totalAmount}\n\n${isEnglish ? 'Thank you for your business!' : 'உங்கள் வணிகத்திற்கு நன்றி!'}`;

      await Share.open({ title: isEnglish ? 'Share Bill' : 'விலைப்பட்டியலை பகிரவும்', message: billText });
    } catch (error) {
      Alert.alert(isEnglish ? 'Error' : 'பிழை', isEnglish ? 'Failed to share bill' : 'விலைப்பட்டியலை பகிர்வதில் தோல்வி');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Company Info */}
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{isEnglish ? 'Aswath Hollow Bricks & Lorry Service' : 'அஸ்வத் ஹாலோ பிரிக்ஸ் மற்றும் லாரி சேவை'}</Text>
        <Text style={styles.companyDetails}>SS Tower, Pandian Nagar Bus Stop, Tiruppur - 641602</Text>
        <Text style={styles.companyDetails}>Mobile: 9843083521 / 9842048181</Text>
        <Text style={styles.companyDetails}>Email: maswath8812@gmail.com</Text>
      </View>

      {/* Bill Title */}
      <Text style={styles.billTitle}>{isEnglish ? 'Invoice / Bill' : 'சரக்கு / விலைப்பட்டியல்'}</Text>

      {/* Customer Info */}
      <View style={styles.customerInfo}>
        <Text style={styles.infoText}>{isEnglish ? 'Customer' : 'வாடிக்கையாளர்'}: {order.customerName}</Text>
        <Text style={styles.infoText}>{isEnglish ? 'Vehicle No' : 'வாகன எண்'}: {order.vehicleNumber}</Text>
        <Text style={styles.infoText}>{isEnglish ? 'Order ID' : 'ஆர்டர் எண்'}: {order.orderId}</Text>
        {order.date && <Text style={styles.infoText}>{isEnglish ? 'Date' : 'தேதி'}: {order.date}</Text>}
      </View>

      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, { flex: 0.5, fontWeight: 'bold' }]}>SN</Text>
        <Text style={[styles.cell, { flex: 1.5, fontWeight: 'bold' }]}>{isEnglish ? 'Material' : 'பொருள்'}</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>{isEnglish ? 'Size' : 'அளவு/வகை'}</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>{isEnglish ? 'Qty' : 'அளவு'}</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>{isEnglish ? 'Price' : 'விலை'}</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>{isEnglish ? 'Subtotal' : 'மொத்தம்'}</Text>
      </View>

      {/* Table Items */}
      <FlatList
        data={order.products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index.toString()}
        scrollEnabled={false}
      />

      {/* Transport Charge */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{isEnglish ? 'Transport Charge:' : 'போக்குவரத்து கட்டணம்:'}</Text>
        <Text style={styles.summaryValue}>₹{order.transportCharge}</Text>
      </View>

      {/* Grand Total */}
      <View style={[styles.summaryRow, { marginTop: moderateScale(4) }]}>
        <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>{isEnglish ? 'Grand Total:' : 'மொத்தம்:'}</Text>
        <Text style={[styles.summaryValue, { fontWeight: 'bold' }]}>₹{totalAmount}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{isEnglish ? 'Thank you for your business!' : 'உங்கள் வணிகத்திற்கு நன்றி!'}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>{isEnglish ? 'Share' : 'பகிரவும்'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>{isEnglish ? 'Close' : 'மூடு'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(16), backgroundColor: '#fff', marginTop: moderateScale(24) },
  companyInfo: { alignItems: 'center', marginBottom: moderateScale(8) },
  companyName: { fontSize: moderateScale(20), fontWeight: 'bold', textAlign: 'center', color: '#000' },
  companyDetails: { fontSize: moderateScale(14), color: '#555', textAlign: 'center' },
  billTitle: { fontSize: moderateScale(18), fontWeight: '600', textAlign: 'center', marginVertical: moderateScale(10), color: '#000' },
  customerInfo: { marginBottom: moderateScale(12), paddingHorizontal: moderateScale(4) },
  infoText: { fontSize: moderateScale(14), marginBottom: moderateScale(2), color: '#000' },
  row: { flexDirection: 'row', paddingVertical: moderateScale(8), borderBottomWidth: 1, borderBottomColor: '#ccc' },
  headerRow: { backgroundColor: '#f0f0f0' },
  cell: { fontSize: moderateScale(14), paddingHorizontal: moderateScale(4), textAlign: 'left', color: '#000' },
  summaryRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: moderateScale(6) },
  summaryLabel: { fontSize: moderateScale(14), flex: 5, textAlign: 'right', color: '#000' },
  summaryValue: { fontSize: moderateScale(14), flex: 1, textAlign: 'center', color: '#000' },
  footer: { marginTop: moderateScale(16), alignItems: 'center' },
  footerText: { fontSize: moderateScale(14), fontStyle: 'italic', color: '#555' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: moderateScale(16) },
  button: { backgroundColor: '#4CAF50', paddingVertical: moderateScale(10), paddingHorizontal: moderateScale(24), borderRadius: moderateScale(6) },
  buttonText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold' },
});
