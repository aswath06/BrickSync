import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  Platform,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { baseUrl } from '../../config';
import { Picker } from '@react-native-picker/picker';
import { moderateScale } from './utils/scalingUtils';

type Statement = {
  date: string;
  amount: number;
  orderId?: string;
  modeOfPayment: string;
  typeOfPayment?: string;
  products?: any[];
  vehicleNo?: string;
  invoiceNo?: string;
  status?: string;
  image?: string;
};

type Props = {
  route: {
    params: {
      statements: Statement[];
      balance: number;
      username: string;
      phoneNumber: string;
      userId: string;
    };
  };
};

const PAGE_SIZE = 10;

export const StatementPage: React.FC<Props> = ({ route }) => {
  const { statements, balance, username, phoneNumber, userId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [typeOfPayment, setTypeOfPayment] = useState('Cash');
  const [visibleStatements, setVisibleStatements] = useState<Statement[]>([]);
  const [filteredStatements, setFilteredStatements] = useState<Statement[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Statement | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  // Initialize statements
  useEffect(() => {
    const init = async () => {
      try {
        const safeStatements = Array.isArray(statements) ? statements : [];
        await AsyncStorage.setItem('statements', JSON.stringify(safeStatements));
        setVisibleStatements(safeStatements.slice(0, PAGE_SIZE));
      } catch (err) {
        console.error('AsyncStorage error:', err);
      }
    };
    init();
  }, [statements]);

  // Pagination
  const loadMore = () => {
    const nextPage = page + 1;
    const newItems = Array.isArray(statements)
      ? statements.slice(0, nextPage * PAGE_SIZE)
      : [];
    if (newItems.length > visibleStatements.length) {
      setPage(nextPage);
      setVisibleStatements(newItems);
    }
  };

  // Refresh statements from backend
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/statements/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch statements');
      const data = await res.json();
      const statementsArray = Array.isArray(data) ? data : data.statements ?? [];
      setVisibleStatements(statementsArray.slice(0, PAGE_SIZE));
      await AsyncStorage.setItem('statements', JSON.stringify(statementsArray));
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Failed to fetch statements');
    }
    setPage(1);
    setRefreshing(false);
  };

  // Add received statement
  const handleAddStatement = async () => {
  if (!amount || isNaN(Number(amount))) {
    Alert.alert('Invalid', 'Please enter a valid amount');
    return;
  }

  setSubmitting(true); // start loading
  try {
    const payload = {
      amount: parseFloat(amount),
      modeOfPayment: 'Received',
      typeOfPayment,
    };

    const res = await fetch(`${baseUrl}/api/users/add-statement/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());

    const newStatement: Statement = {
      date: new Date().toISOString(),
      amount: payload.amount,
      modeOfPayment: payload.modeOfPayment,
      typeOfPayment: payload.typeOfPayment,
    };

    setVisibleStatements(prev => [newStatement, ...prev]);
    applyFilter();

    setAmount('');
    setModalVisible(false);
    Alert.alert('Success', 'Statement added!');
  } catch (err: any) {
    Alert.alert('Error', err.message || 'Something went wrong');
  } finally {
    setSubmitting(false); // stop loading
  }
};


  // Apply search and sort
  const applyFilter = () => {
    const data = [...visibleStatements];
    const filtered = data.filter(
      (item) =>
        item.typeOfPayment?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.modeOfPayment.toLowerCase().includes(searchText.toLowerCase())
    );
    const sorted = filtered.sort((a, b) =>
      sortBy === 'date'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : b.amount - a.amount
    );
    setFilteredStatements(sorted);
  };

  useEffect(() => {
    applyFilter();
  }, [searchText, sortBy, visibleStatements]);

  // Export CSV
  const exportToCSV = async () => {
    try {
      const data = filteredStatements.length > 0 ? filteredStatements : visibleStatements;
      if (data.length === 0) {
        Alert.alert('No data', 'There are no statements to export.');
        return;
      }

      const rows = [
        ['Date', 'Mode', 'Order ID / Type', 'Amount'],
        ...data.map((s) => [
          new Date(s.date).toLocaleString(),
          s.modeOfPayment,
          s.modeOfPayment === 'Received' ? s.typeOfPayment ?? '-' : s.orderId ?? '-',
          s.amount.toString(),
        ]),
      ];

      const csvContent = rows.map((r) => r.join(',')).join('\n');
      const fileName = 'statement_export.csv';
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, csvContent, 'utf8');

      await Share.open({
        title: 'Export Statement CSV',
        url: Platform.OS === 'android' ? `file://${path}` : path,
        type: 'text/csv',
        failOnCancel: false,
      });

      Alert.alert('Success', `CSV exported to: ${path}`);
    } catch (err: any) {
      console.error('CSV Export Error:', err);
      Alert.alert('Export failed', err.message || 'Unknown error');
    }
  };

  // Fetch order details
  const handleOrderPress = async (orderId: string) => {
    try {
      setLoadingOrder(true);
      const res = await fetch(`${baseUrl}/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Failed to fetch order details');
      const data = await res.json();

      const orderDetails: Statement = {
        date: data.createdAt,
        amount: data.products.reduce(
          (acc: number, p: any) => acc + parseFloat(p.price) * parseFloat(p.quantity),
          0
        ),
        orderId: data.orderId,
        modeOfPayment: 'Order',
        products: data.products,
        vehicleNo: data.vehicleNumber,
        status: data.status,
        image: data.image,
      };

      setSelectedOrder(orderDetails);
      setOrderModalVisible(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to fetch order');
    } finally {
      setLoadingOrder(false);
    }
  };

  const renderItem = ({ item }: { item: Statement }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.cell}>{item.modeOfPayment}</Text>
      <Text
        style={[styles.cell, { flex: 2, color: item.modeOfPayment === 'Order' ? '#007bff' : '#333' }]}
        numberOfLines={1}
        ellipsizeMode="tail"
        onPress={() => item.orderId && handleOrderPress(item.orderId)}
      >
        {item.modeOfPayment === 'Received'
          ? item.typeOfPayment ?? '-'
          : item.modeOfPayment === 'Order' && item.orderId
          ? item.orderId
          : item.typeOfPayment ?? '-'}
      </Text>
      <Text
        style={[
          styles.cell,
          { color: item.modeOfPayment === 'Order' ? 'red' : 'green', fontWeight: 'bold' },
        ]}
      >
        ₹{item.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Statement</Text>

      <View style={styles.userInfoRow}>
        <View>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.userPhone}>{phoneNumber}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.balanceText}>Balance: ₹{balance}</Text>

      <TextInput
        style={styles.input}
        placeholder="Search by payment type or mode"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => setSortBy('date')}>
          <Text style={[styles.sortButton, sortBy === 'date' && styles.activeSort]}>Sort by Date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('amount')}>
          <Text style={[styles.sortButton, sortBy === 'amount' && styles.activeSort]}>Sort by Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={exportToCSV}>
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Mode</Text>
        <Text style={styles.headerCell}>Order ID / Type</Text>
        <Text style={styles.headerCell}>Amount</Text>
      </View>

      <FlatList
        data={filteredStatements}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Add Received Amount Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentTall}>
            <Text style={styles.modalTitleColorful}>Add Received Amount</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#888"
            />

            <Text style={{ marginBottom: 6, fontWeight: '600', color: '#333' }}>Type of Payment</Text>
            <View style={styles.pickerContainerColorful}>
              <Picker selectedValue={typeOfPayment} onValueChange={setTypeOfPayment} mode="dropdown">
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Bank" value="Bank" />
                <Picker.Item label="UPI" value="UPI" />
                <Picker.Item label="Cheque" value="Cheque" />
              </Picker>
            </View>

            <View style={styles.modalButtonsTall}>
  <TouchableOpacity
    style={[styles.modalButtonTall, { backgroundColor: '#28a745' }]}
    onPress={handleAddStatement}
    disabled={submitting} // prevent multiple clicks
  >
    {submitting ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <Text style={styles.modalButtonText}>Submit</Text>
    )}
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.modalButtonTall, { backgroundColor: '#dc3545' }]}
    onPress={() => setModalVisible(false)}
    disabled={submitting} // prevent closing while submitting if you want
  >
    <Text style={styles.modalButtonText}>Cancel</Text>
  </TouchableOpacity>
</View>

          </View>
        </View>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={orderModalVisible}
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentOrder}>
            {loadingOrder ? (
              <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 40 }} />
            ) : selectedOrder ? (
              <View style={{ maxHeight: '80%' }}>
                <Text style={styles.orderTitle}>Order Details</Text>
                <Text style={styles.orderText}>Order ID: {selectedOrder.orderId}</Text>
                <Text style={styles.orderText}>Vehicle No: {selectedOrder.vehicleNo ?? '-'}</Text>
                <Text style={styles.orderText}>Invoice No: {selectedOrder.invoiceNo ?? '-'}</Text>
                <Text style={[styles.orderText, { marginTop: 10, fontWeight: '600' }]}>Products:</Text>
                <View style={{ marginLeft: 8, marginTop: 4 }}>
                  {selectedOrder.products?.map((p: any, i: number) => (
                    <Text key={i} style={styles.orderText}>
                      {i + 1}. {p.name} | Price: ₹{p.price} | Quantity: {p.quantity}
                    </Text>
                  ))}
                </View>
                <Text style={styles.orderText}>Status: {selectedOrder.status ?? '-'}</Text>
                <Text style={styles.orderText}>Date: {new Date(selectedOrder.date).toLocaleString()}</Text>
                {selectedOrder.image && (
                  <>
                    <Text style={{ marginTop: 12, fontWeight: '600' }}>Order Image:</Text>
                    <Image
                      source={{ uri: selectedOrder.image }}
                      style={styles.orderImage}
                      resizeMode="contain"
                    />
                    <TouchableOpacity onPress={() => Linking.openURL(selectedOrder.image)}>
                      <Text style={{ color: '#007bff', marginTop: 4, textDecorationLine: 'underline' }}>
                        Open Full Image
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={styles.closeOrderButton}
                  onPress={() => setOrderModalVisible(false)}
                >
                  <Text style={styles.closeOrderButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ textAlign: 'center', marginVertical: 40 }}>No order details available</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(16), backgroundColor: '#fff' },
  pageTitle: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: moderateScale(16),
    textAlign: 'center',
    color: '#333',
    marginTop: moderateScale(30),
  },
  userInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(12) },
  userName: { fontSize: moderateScale(18), fontWeight: '600', color: '#333' },
  userPhone: { fontSize: moderateScale(14), color: '#777' },
  actionButton: { backgroundColor: '#007bff', paddingVertical: moderateScale(6), paddingHorizontal: moderateScale(12), borderRadius: moderateScale(6) },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: moderateScale(14) },
  balanceText: { fontSize: moderateScale(16), fontWeight: 'bold', marginBottom: moderateScale(12), color: '#444' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: moderateScale(6), paddingHorizontal: moderateScale(12), paddingVertical: moderateScale(8), marginBottom: moderateScale(12) },
  headerRow: { flexDirection: 'row', backgroundColor: '#eaeaea', paddingVertical: moderateScale(8), borderBottomWidth: 1, borderColor: '#ccc' },
  headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center', fontSize: moderateScale(13) },
  row: {
    flexDirection: 'row',
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: moderateScale(13),
    color: '#333',
    flexShrink: 1,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContentTall: { width: '90%', backgroundColor: '#ffe4e1', borderRadius: moderateScale(12), padding: moderateScale(25), elevation: 8, maxHeight: '80%', justifyContent: 'center' },
  modalTitleColorful: { fontSize: moderateScale(20), fontWeight: 'bold', marginBottom: moderateScale(16), textAlign: 'center', color: '#d6336c' },
  modalButtonsTall: { flexDirection: 'row', justifyContent: 'space-between', marginTop: moderateScale(16) },
  modalButtonTall: { flex: 1, paddingVertical: moderateScale(14), marginHorizontal: moderateScale(6), borderRadius: moderateScale(8) },
  modalButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: moderateScale(12) },
  sortButton: { fontSize: moderateScale(14), color: '#007bff', fontWeight: '600', marginRight: moderateScale(12) },
  activeSort: { textDecorationLine: 'underline', color: '#d6336c' },
  exportText: { color: '#28a745', fontWeight: '600' },
  pickerContainerColorful: { borderWidth: 1, borderColor: '#007bff', borderRadius: moderateScale(6), marginBottom: moderateScale(12) },
  orderImage: { width: '100%', height: moderateScale(180), marginTop: 10, borderRadius: moderateScale(8) },
  modalContentOrder: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(20),
    elevation: 8,
    alignSelf: 'center',
  },
  orderTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
    textAlign: 'center',
    color: '#d6336c',
  },
  orderText: {
    fontSize: moderateScale(14),
    color: '#333',
    marginBottom: moderateScale(4),
  },
  closeOrderButton: {
    backgroundColor: '#dc3545',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(16),
  },
  closeOrderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});
