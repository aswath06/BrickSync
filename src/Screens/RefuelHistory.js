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
  Image,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTruckStore } from '../stores/useTruckStore';
import { ArrowBack } from '../assets';

export const RefuelHistory = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { vehicleNumber } = params;

  const { trucks, addRefuel } = useTruckStore();
  const truck = trucks.find((t) => t.number === vehicleNumber);
  const history = truck?.refuelHistory || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [volume, setVolume] = useState('');
  const [kilometer, setKilometer] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleAddRefuel = () => {
    const newEntry = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      volume: parseFloat(volume),
      kilometer: parseFloat(kilometer),
      date: date.toDateString(),
    };
    addRefuel(vehicleNumber, newEntry);
    setAmount('');
    setVolume('');
    setKilometer('');
    setDate(new Date());
    setModalVisible(false);
  };

  const calculateAverageMileage = () => {
    if (history.length < 2) return '-';
    const sorted = [...history].sort((a, b) => a.kilometer - b.kilometer);
    const distance = sorted[sorted.length - 1].kilometer - sorted[0].kilometer;
    const totalVolume = sorted.reduce((sum, r) => sum + r.volume, 0);
    return `${(distance / totalVolume).toFixed(2)} km/l`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refuel History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* GIF */}
        <Image
          source={require('../assets/refuel.gif')}
          style={styles.refuelGif}
          resizeMode="contain"
        />

        {/* Vehicle and mileage */}
        <Text style={styles.vehicleNumber}>{vehicleNumber}</Text>
        <Text style={styles.mileageText}>
          Avg. Mileage: {calculateAverageMileage()}
        </Text>

        {history.length === 0 ? (
          <Text style={{ color: '#888' }}>No refuel records yet.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.text}>Date: {item.date}</Text>
                <Text style={styles.text}>Amount: ₹{item.amount}</Text>
                <Text style={styles.text}>Volume: {item.volume} L</Text>
                <Text style={styles.text}>Kilometers: {item.kilometer} km</Text>
              </View>
            )}
          />
        )}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Modal */}
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
