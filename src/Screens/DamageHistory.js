import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { useTruckStore } from '../stores/useTruckStore';
import { ArrowBack } from '../assets';
import axios from 'axios';
import { baseUrl, AddServiceToVehicleEndpoint } from '../../config';

export const DamageHistory = ({ route }) => {
  const navigation = useNavigation();
  const { vehicleNumber } = route.params;

  const { trucks, addDamage } = useTruckStore();
  const truck = trucks.find((t) => t.number === vehicleNumber);
  const history = truck?.damageHistory || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [damageText, setDamageText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState('Normal');
  const [file, setFile] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statuses = ['Can Drive', 'Normal', 'Need to Change'];

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      setFile(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.warn('Document pick error:', err);
      }
    }
  };

  const handleAddDamage = async () => {
    try {
      const vehicleId = truck?.id;
      if (!vehicleId) throw new Error('Truck ID not found');

      const payload = {
        title: damageText || 'No Title',
        fileUrl: file?.uri || '', // replace with real URL if uploading to cloud
        date: selectedDate.toISOString().split('T')[0],
        status,
      };

      // Add locally for display
      addDamage(vehicleNumber, {
        id: Date.now().toString(),
        ...payload,
        file,
        changed: false,
      });

      // Submit to backend
      await axios.post(`${baseUrl}${AddServiceToVehicleEndpoint(vehicleId)}`, payload);

      console.log('✅ Damage report submitted');

    } catch (err) {
      console.error('❌ Failed to submit damage report:', err?.response?.data || err.message);
    } finally {
      setModalVisible(false);
      setDamageText('');
      setFile(null);
      setStatus('Normal');
      setSelectedDate(new Date());
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await useTruckStore.getState().fetchAllTrucks();
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Can Drive':
        return '#4CAF50';
      case 'Normal':
        return '#FFC107';
      case 'Need to Change':
        return '#F44336';
      default:
        return '#000';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Damage History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{ padding: 16 }}>
          <Text style={styles.subTitle}>Vehicle: {vehicleNumber}</Text>

          {history.length === 0 ? (
            <Text style={{ color: '#888' }}>No damage reported yet.</Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.text}>{item.title || item.text}</Text>
                    {item.changed && <Text style={styles.changedBadge}>Changed</Text>}
                  </View>
                  <Text style={styles.subText}>Date: {item.date}</Text>
                  <Text style={[styles.subText, { color: getStatusColor(item.status) }]}>
                    Status: {item.status}
                  </Text>
                  {item.file && <Text style={styles.fileText}>📎 {item.file.name}</Text>}
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Damage Report</Text>

            <TextInput
              style={styles.input}
              placeholder="Describe the damage"
              value={damageText}
              onChangeText={setDamageText}
            />

            <TouchableOpacity onPress={handleFileUpload} style={styles.uploadBtn}>
              <Text>{file ? `📎 ${file.name}` : 'Upload File'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text>📅 {selectedDate.toDateString()}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => {
                setSelectedDate(date);
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />

            <View style={styles.chipRow}>
              {statuses.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, status === s && styles.activeChip]}
                  onPress={() => setStatus(s)}
                >
                  <Text style={status === s ? styles.activeChipText : styles.chipText}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddDamage}>
              <Text style={styles.addBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Your styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: '#000',
  },
  subTitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  card: {
    backgroundColor: '#F2F2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  changedBadge: {
    fontSize: 10,
    backgroundColor: '#E53935',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  text: { fontSize: 14, fontWeight: '600' },
  subText: { fontSize: 12, color: '#555' },
  fileText: { fontSize: 12, color: '#1577EA', marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1577EA',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  uploadBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: '#1577EA',
  },
  chipText: { color: '#333', fontSize: 12 },
  activeChipText: { color: '#fff', fontSize: 12 },
  addBtn: {
    backgroundColor: '#1577EA',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
});
