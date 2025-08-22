import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from 'react-native';
import { useTruckStore } from '../stores/useTruckStore';
import { baseUrl } from '../../config';
import { moderateScale } from './utils/scalingUtils';
import Toast from 'react-native-toast-message'; // If using react-native-toast-message

export const AssignJobScreen = ({ route, navigation }) => {
  const { orderId, jobId, customerName, orderTime, materials, vehicleNumber } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleNumber);
  const [loading, setLoading] = useState(false);
  const { trucks, fetchAllTrucks } = useTruckStore();

  // Assign job to vehicle
  const handleAssign = async () => {
    if (!selectedVehicle) {
      showToast('Please select a vehicle');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber: selectedVehicle }),
      });

      if (response.ok) {
        console.log('Assignment successful');
        showToast('Job assigned successfully');
        navigation.navigate('DashboardScreen');
      } else {
        const errorData = await response.json();
        console.error('Assignment failed:', errorData);
        showToast(errorData?.message || 'Assignment failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      showToast('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Toast.show({ type: 'success', text1: message });
    }
  };

  // Delete job
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        showToast('Job deleted successfully');
        navigation.navigate('DashboardScreen');
      } else {
        const errorData = await response.json();
        showToast(errorData?.message || 'Failed to delete job');
      }
    } catch (error) {
      showToast('Network error occurred while deleting job');
    } finally {
      setLoading(false);
    }
  };

  // Open modal to select vehicle
  const handleOpenVehicleModal = async () => {
    await fetchAllTrucks();
    setModalVisible(true);
  };

  const handleSelectVehicle = (vehicleNo) => {
    setSelectedVehicle(vehicleNo);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Assigned Job Details</Text>
        <Text style={styles.label}>Order Id:</Text>
        <Text style={styles.value}>{orderId}</Text>
        <Text style={styles.label}>Job ID:</Text>
        <Text style={styles.value}>{jobId}</Text>
        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{customerName}</Text>
        <Text style={styles.label}>Order Time:</Text>
        <Text style={styles.value}>{orderTime}</Text>

        <View style={styles.vehicleRow}>
          <Text style={styles.label}>Assigned Vehicle Number:</Text>
          <TouchableOpacity onPress={handleOpenVehicleModal}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>{selectedVehicle || 'Not Assigned'}</Text>

        <Text style={styles.label}>Materials:</Text>
        {materials && materials.length > 0 ? (
          materials.map((item, index) => (
            <View key={index} style={styles.materialBlock}>
              <Text style={styles.materialName}>{item.name}</Text>
              <Text style={styles.materialInfo}>Qty: {item.quantity}</Text>
              <Text style={styles.materialInfo}>Price: ₹{item.price}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.value}>No materials listed</Text>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.assignButton, loading && { opacity: 0.6 }]}
          onPress={handleAssign}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Assign Job</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, loading && { opacity: 0.6 }]}
          onPress={handleDelete}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Delete Job</Text>}
        </TouchableOpacity>
      </View>

      {/* Vehicle Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Vehicle</Text>
            <FlatList
              data={trucks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.vehicleItem}
                  onPress={() => handleSelectVehicle(item.number)}
                >
                  <Text style={styles.vehicleText}>{item.number}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {Platform.OS === 'ios' && <Toast />}
    </View>
  );
};


// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: moderateScale(24), paddingBottom: moderateScale(140) },
  heading: { marginTop: moderateScale(30), fontSize: moderateScale(24), fontWeight: 'bold', textAlign: 'center', marginBottom: moderateScale(24), color: '#000' },
  label: { fontSize: moderateScale(16), fontWeight: '600', marginTop: moderateScale(12), color: '#000' },
  value: { fontSize: moderateScale(16), color: '#000' },
  materialBlock: { backgroundColor: '#e9f1ff', padding: moderateScale(12), borderRadius: moderateScale(10), marginTop: moderateScale(8), elevation: moderateScale(2) },
  materialName: { fontSize: moderateScale(16), fontWeight: '600', color: '#000' },
  materialInfo: { fontSize: moderateScale(14), color: '#000' },
  buttonContainer: { position: 'absolute', bottom: moderateScale(20), left: moderateScale(24), right: moderateScale(24), flexDirection: 'row', justifyContent: 'space-between' },
  assignButton: { backgroundColor: '#4CAF50', paddingVertical: moderateScale(14), paddingHorizontal: moderateScale(24), borderRadius: moderateScale(10), flex: 1, marginRight: moderateScale(10), elevation: moderateScale(3) },
  deleteButton: { backgroundColor: '#F44336', paddingVertical: moderateScale(14), paddingHorizontal: moderateScale(24), borderRadius: moderateScale(10), flex: 1, marginLeft: moderateScale(10), elevation: moderateScale(3) },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: moderateScale(16) },
  vehicleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScale(12) },
  changeText: { color: '#1E90FF', fontSize: moderateScale(14), fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', maxHeight: '60%', backgroundColor: '#fff', borderRadius: moderateScale(10), padding: moderateScale(20) },
  modalTitle: { fontSize: moderateScale(18), fontWeight: 'bold', marginBottom: moderateScale(10), color: '#000' },
  vehicleItem: { paddingVertical: moderateScale(12), borderBottomWidth: moderateScale(1), borderColor: '#eee' },
  vehicleText: { fontSize: moderateScale(16), color: '#000' },
  cancelButton: { marginTop: moderateScale(10), paddingVertical: moderateScale(10), alignItems: 'center' },
  cancelText: { color: '#F44336', fontWeight: '600' },
});
