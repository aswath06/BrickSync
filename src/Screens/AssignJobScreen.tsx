import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export const AssignJobScreen = ({ route }) => {
  const { jobId, customerName, orderTime, materials, vehicleNumber } = route.params;

  const handleAssign = () => {
    console.log('Job assigned');
  };

  const handleDelete = () => {
    console.log('Job deleted');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Assigned Job Details</Text>

        <Text style={styles.label}>Job ID:</Text>
        <Text style={styles.value}>{jobId}</Text>

        <Text style={styles.label}>Customer Name:</Text>
        <Text style={styles.value}>{customerName}</Text>

        <Text style={styles.label}>Order Time:</Text>
        <Text style={styles.value}>{orderTime}</Text>

        <Text style={styles.label}>Assigned Vehicle Number:</Text>
        <Text style={styles.value}>{vehicleNumber || 'Not Assigned'}</Text>

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
});
