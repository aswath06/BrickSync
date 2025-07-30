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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { baseUrl } from '../../config';

type Statement = {
  date: string;
  amount: number;
  orderId?: string;
  modeOfPayment: string;
  typeOfPayment?: string;
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

  useEffect(() => {
    const init = async () => {
      try {
        await AsyncStorage.setItem('statements', JSON.stringify(statements));
      } catch {}
      setVisibleStatements(statements.slice(0, PAGE_SIZE));
    };
    init();
  }, [statements]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newItems = statements.slice(0, nextPage * PAGE_SIZE);
    if (newItems.length > visibleStatements.length) {
      setPage(nextPage);
      setVisibleStatements(newItems);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const saved = await AsyncStorage.getItem('statements');
      if (saved) {
        const localData = JSON.parse(saved) as Statement[];
        setVisibleStatements(localData.slice(0, PAGE_SIZE));
      }
    } catch {}
    setPage(1);
    setRefreshing(false);
  };

  const handleAddStatement = async () => {
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

      Alert.alert('Success', 'Statement added!');
      setModalVisible(false);
      setAmount('');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

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

  const exportToCSV = async () => {
    const rows = [
      ['Date', 'Mode', 'Order ID', 'Amount', 'Type'],
      ...filteredStatements.map((s) => [
        new Date(s.date).toLocaleString(),
        s.modeOfPayment,
        s.orderId ?? '-',
        s.amount.toString(),
        s.typeOfPayment ?? '-',
      ]),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const path = `${RNFS.DocumentDirectoryPath}/statement_export.csv`;

    await RNFS.writeFile(path, csvContent, 'utf8');
    await Share.open({ url: `file://${path}`, type: 'text/csv' });
  };

  const renderItem = ({ item }: { item: Statement }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{new Date(item.date).toLocaleString()}</Text>
      <Text style={styles.cell}>{item.modeOfPayment}</Text>
      <Text style={styles.cell}>{item.orderId ?? '-'}</Text>
      <Text
        style={[
          styles.cell,
          { color: item.modeOfPayment === 'Order' ? 'red' : 'green' },
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
        <Text style={styles.headerCell}>Order ID</Text>
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

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Received Amount</Text>

            <TextInput style={styles.input} placeholder="Enter amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <TextInput style={styles.input} placeholder="Type of Payment" value={typeOfPayment} onChangeText={setTypeOfPayment} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#28a745' }]} onPress={handleAddStatement}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#dc3545' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  pageTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333', marginTop: 30 },
  userInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 18, fontWeight: '600', color: '#333' },
  userPhone: { fontSize: 14, color: '#777' },
  actionButton: { backgroundColor: '#007bff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  balanceText: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#444' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row', backgroundColor: '#eaeaea', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#ccc',
  },
  headerCell: {
    flex: 1, fontWeight: 'bold', textAlign: 'center', fontSize: 13,
  },
  row: {
    flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0',
  },
  cell: {
    flex: 1, textAlign: 'center', fontSize: 13, color: '#333',
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '85%', backgroundColor: '#fff', borderRadius: 10, padding: 20, elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 6,
  },
  modalButtonText: {
    color: '#fff', textAlign: 'center', fontWeight: 'bold',
  },
  sortRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12,
  },
  sortButton: {
    color: '#555', fontWeight: 'bold',
  },
  activeSort: {
    color: '#007bff', textDecorationLine: 'underline',
  },
  exportText: {
    color: '#28a745', fontWeight: 'bold',
  },
});
