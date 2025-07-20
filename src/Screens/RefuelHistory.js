import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTruckStore } from '../stores/useTruckStore';
import { ArrowBack } from '../assets';
import { AddRefuelToVehicleEndpoint, baseUrl } from '../../config';
import axios from 'axios';

export const RefuelHistory = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { vehicleNumber } = params;

  const { trucks, addRefuel } = useTruckStore();
  const truck = trucks.find((t) => t.number === vehicleNumber);
  const history = [...(truck?.refuelHistory || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [volume, setVolume] = useState('');
  const [kilometer, setKilometer] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleAddRefuel = async () => {
    const newEntry = {
      amount: parseFloat(amount),
      volume: parseFloat(volume),
      lastKm: parseFloat(kilometer),
      date: date.toISOString(),
    };

    try {
      await axios.post(
        `${baseUrl}${AddRefuelToVehicleEndpoint(truck.id)}`,
        newEntry
      );

      const previousEntry = history.length > 0 ? history[0] : null;
      const distance = previousEntry ? newEntry.lastKm - previousEntry.kilometer : 0;
      const mileage = newEntry.volume > 0 && distance > 0 ? distance / newEntry.volume : null;

      const localEntry = {
        id: Date.now().toString(),
        ...newEntry,
        kilometer: newEntry.lastKm,
        mileage,
      };

      addRefuel(vehicleNumber, localEntry);

      setAmount('');
      setVolume('');
      setKilometer('');
      setDate(new Date());
      setModalVisible(false);
    } catch (error) {
      console.error('❌ Failed to add refuel entry:', error);
      alert('Failed to submit refuel. Try again.');
    }
  };

  const calculateAverageMileage = () => {
  if (history.length < 2) return '-';

  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const totalDistance = sorted[sorted.length - 1].kilometer - sorted[0].kilometer;
  const totalVolume = sorted.reduce((sum, r) => sum + (r.volume || 0), 0);

  if (totalVolume === 0) return '-';

  return `${(totalDistance / totalVolume).toFixed(2)} km/l`;
};



  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refuel History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Image
              source={require('../assets/refuel.gif')}
              style={styles.refuelGif}
              resizeMode="contain"
            />
            <Text style={styles.vehicleNumber}>{vehicleNumber}</Text>
            <Text style={styles.mileageText}>Avg. Mileage: {calculateAverageMileage()}</Text>
            {history.length === 0 && (
              <Text style={{ color: '#888', marginTop: 8 }}>No refuel records yet.</Text>
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { marginHorizontal: 16 }]}>
            <Text style={styles.text}>Date: {formatDate(item.date)}</Text>
            <Text style={styles.text}>Amount: ₹{item.amount}</Text>
            <Text style={styles.text}>Volume: {item.volume} L</Text>
            <Text style={styles.text}>Kilometers: {item.kilometer} km</Text>
            <Text style={styles.text}>Mileage: {item.mileage?.toFixed(2) ?? '-'} km/l</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Refuel</Text>

            <TextInput
              placeholder="Amount ₹"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Volume in Litres"
              value={volume}
              onChangeText={setVolume}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Kilometer"
              value={kilometer}
              onChangeText={setKilometer}
              keyboardType="numeric"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text>📅 {date.toDateString()}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(pickedDate) => {
                setDate(pickedDate);
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />

            <TouchableOpacity style={styles.addBtn} onPress={handleAddRefuel}>
              <Text style={styles.addBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  refuelGif: {
    width: '100%',
    height: 180,
    marginBottom: 16,
  },
  vehicleNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    fontFamily: 'AbeeZee-Regular',
    marginBottom: 4,
  },
  mileageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1577EA',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F2F2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
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
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
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
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  uploadBtn: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#1577EA',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});