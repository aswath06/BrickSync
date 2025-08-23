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
import { useToggleStore } from '../stores/useToggleStore';
import { ArrowBack } from '../assets';
import axios from 'axios';
import { baseUrl, AddServiceToVehicleEndpoint } from '../../config';
import { moderateScale } from './utils/scalingUtils';

export const DamageHistory = ({ route }) => {
  const navigation = useNavigation();
  const { vehicleNumber } = route.params;

  const { trucks, addDamage } = useTruckStore();
  const truck = trucks.find((t) => t.number === vehicleNumber);
  const history = truck?.damageHistory || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [damageText, setDamageText] = useState('');
  const [variation, setVariation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState('Normal');
  const [file, setFile] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEnglish = useToggleStore((state) => state.isEnglish);

  const statuses = [
    isEnglish ? 'Can Drive' : 'ஓட்ட முடியும்',
    isEnglish ? 'Normal' : 'இயல்பானது',
    isEnglish ? 'Need to Change' : 'மாற்ற வேண்டும்',
  ];

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
    if (!damageText || !variation || !selectedDate || !status) {
      alert(isEnglish ? 'Please fill all fields before submitting.' : 'அனைத்து புலங்களையும் நிரப்பவும்.');
      return;
    }

    setLoading(true);
    try {
      const vehicleId = truck?.id;
      if (!vehicleId) throw new Error('Truck ID not found');

      const payload = {
        title: damageText,
        variation,
        fileUrl: file?.uri || '',
        date: selectedDate.toISOString().split('T')[0],
        status,
      };

      addDamage(vehicleNumber, {
        id: Date.now().toString(),
        ...payload,
        file,
        changed: false,
      });

      await axios.post(`${baseUrl}${AddServiceToVehicleEndpoint(vehicleId)}`, payload);

    } catch (err) {
      console.error('❌ Failed to submit damage report:', err?.response?.data || err.message);
    } finally {
      setModalVisible(false);
      setDamageText('');
      setVariation('');
      setFile(null);
      setStatus(statuses[1]); // default to Normal
      setSelectedDate(new Date());
      setLoading(false);
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
      case statuses[0]:
        return '#4CAF50';
      case statuses[1]:
        return '#FFC107';
      case statuses[2]:
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
        <Text style={styles.headerTitle}>
          {isEnglish ? 'Damage History' : 'நஷ்டம் வரலாறு'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{ padding: 16 }}>
          <Text style={styles.subTitle}>
            {isEnglish ? 'Vehicle:' : 'வாகனம்:'} {vehicleNumber}
          </Text>

          {history.length === 0 ? (
            <Text style={{ color: '#888' }}>
              {isEnglish ? 'No damage reported yet.' : 'இன்னும் எந்த நஷ்டமும் பதிவு செய்யப்படவில்லை.'}
            </Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.text}>{item.title || item.text}</Text>
                    {item.changed && <Text style={styles.changedBadge}>{isEnglish ? 'Changed' : 'மாற்றப்பட்டது'}</Text>}
                  </View>
                  <Text style={styles.subText}>
                    {isEnglish ? 'Variation:' : 'விருத்தம்:'} {item.variation || 'N/A'}
                  </Text>
                  <Text style={styles.subText}>
                    {isEnglish ? 'Date:' : 'தேதி:'} {item.date}
                  </Text>
                  <Text style={[styles.subText, { color: getStatusColor(item.status) }]}>
                    {isEnglish ? 'Status:' : 'நிலை:'} {item.status}
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEnglish ? 'Add Damage Report' : 'நஷ்டம் அறிக்கை சேர்க்கவும்'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>{isEnglish ? 'Cancel' : 'ரத்து செய்யவும்'}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={isEnglish ? 'Describe the damage' : 'நஷ்டத்தை விவரிக்கவும்'}
              placeholderTextColor="#666"
              value={damageText}
              onChangeText={setDamageText}
            />

            <TextInput
              style={styles.input}
              placeholder={isEnglish ? 'Variation' : 'விருத்தம்'}
              placeholderTextColor="#666"
              value={variation}
              onChangeText={setVariation}
            />

            <TouchableOpacity onPress={handleFileUpload} style={styles.uploadBtn}>
              <Text>{file ? `📎 ${file.name}` : isEnglish ? 'Upload File' : 'கோப்பை பதிவேற்றவும்'}</Text>
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

            <TouchableOpacity
              style={[styles.addBtn, loading && { opacity: 0.7 }]}
              onPress={handleAddDamage}
              disabled={loading}
            >
              <Text style={styles.addBtnText}>
                {loading ? (isEnglish ? 'Submitting...' : 'சமர்ப்பிக்கப்படுகிறது...') : (isEnglish ? 'Submit' : 'சமர்ப்பி')}
              </Text>
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
    paddingTop: moderateScale(52),
    paddingBottom: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: moderateScale(4),
    shadowColor: '#000',
    shadowOffset: { width: moderateScale(0), height: moderateScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(4),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    fontFamily: 'AbeeZee-Regular',
    color: '#000',
  },
  subTitle: {
    fontSize: moderateScale(14),
    color: '#000',
    marginBottom: moderateScale(12),
  },
  card: {
    backgroundColor: '#F2F2F2',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(4),
  },
  changedBadge: {
    fontSize: moderateScale(10),
    backgroundColor: '#E53935',
    color: '#fff',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(10),
    fontWeight: 'bold',
  },
  text: { fontSize: moderateScale(14), fontWeight: '600', color: '#000' },
  subText: { fontSize: moderateScale(12), color: '#000' },
  fileText: { fontSize: moderateScale(12), color: '#000', marginTop: moderateScale(4) },
  fab: {
    position: 'absolute',
    bottom: moderateScale(30),
    right: moderateScale(20),
    backgroundColor: '#1577EA',
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: moderateScale(6),
  },
  fabText: { color: '#fff', fontSize: moderateScale(24), fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
  },
  modalTitle: { fontSize: moderateScale(14), fontWeight: 'bold', color: '#000', marginBottom: moderateScale(10) },
  input: {
    borderWidth: moderateScale(1),
    borderColor: '#ccc',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: moderateScale(10),
    color: '#000',
  },
  uploadBtn: {
    padding: moderateScale(10),
    backgroundColor: '#1577EA',
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(10),
    alignItems: 'center',
    color:'white',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(8) },
  chip: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    backgroundColor: '#f0f0f0',
    borderRadius: moderateScale(20),
    marginRight: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  activeChip: { backgroundColor: '#1577EA' },
  chipText: { color: '#000', fontSize: moderateScale(12) },
  activeChipText: { color: '#fff', fontSize: moderateScale(12) },
  addBtn: {
    backgroundColor: '#1577EA',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    marginTop: moderateScale(16),
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(10),
  },
  cancelText: {
    fontSize: moderateScale(12),
    color: '#F44336',
    fontWeight: 'bold',
  },
});
