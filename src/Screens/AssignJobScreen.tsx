import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { useTruckStore } from '../stores/useTruckStore';
import { baseUrl } from '../../config';

export const AssignJobScreen = ({ route }) => {
  const { orderId, jobId, customerName, orderTime, materials, vehicleNumber } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleNumber);
  const { trucks, fetchAllTrucks } = useTruckStore();

 
const handleAssign = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vehicleNumber: selectedVehicle,
      }),
    });

    if (response.ok) {
      console.log('Assignment successful');
      Alert.alert('Success', 'Job assigned successfully');
      // Optionally: navigate back or refresh screen
    } else {
      const errorData = await response.json();
      console.error('Assignment failed:', errorData);
      Alert.alert('Error', errorData?.message || 'Assignment failed');
    }
  } catch (error) {
    console.error('Network error:', error);
    Alert.alert('Error', 'Network error occurred');
  }
};



  const handleDelete = () => {
    console.log('Job deleted');
  };

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.assignButton} onPress={handleAssign}>
          <Text style={styles.buttonText}>Assign Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Job</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Vehicle Selection */}
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
                  <Text style={styles.vehicleText}>
                    {item.number}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 140,
  },
  heading: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  materialBlock: {
    backgroundColor: '#e9f1ff',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    elevation: 2,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  materialInfo: {
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  changeText: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  vehicleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  vehicleText: {
    fontSize: 16,
    color: '#000',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#F44336',
    fontWeight: '600',
  },
});

