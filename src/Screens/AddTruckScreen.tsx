import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { moderateScale } from './utils/scalingUtils';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export const AddTruckScreen = () => {
  const navigation = useNavigation();

  // Initialize fields as empty
  const [truckData, setTruckData] = useState({
    slNo: '',
    vehicleNumber: '',
    driverId: '',
    insurance: null,
    permit: null,
    pollution: null,
    fitness: null,
    totalKm: '',
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({ visible: false, field: null });

  const handleChange = (key, value) => {
    setTruckData({ ...truckData, [key]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    const { field } = showDatePicker;
    setShowDatePicker({ visible: false, field: null });
    if (event.type === 'set') {
      setTruckData({ ...truckData, [field]: selectedDate.toISOString().split('T')[0] });
    } else {
      setTruckData({ ...truckData, [field]: null });
    }
  };

  const handleSave = async () => {
    if (!truckData.vehicleNumber || !truckData.driverId) {
      Alert.alert('Error', 'Vehicle Number and Driver ID are required!');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'https://bricksyncbackend-1.onrender.com/api/vehicles',
        truckData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      Alert.alert('Success', 'Truck added successfully!');
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add truck.');
      setLoading(false);
    }
  };

  const renderInputField = (key) => {
    const dateFields = ['insurance', 'pollution', 'permit', 'fitness'];
    if (dateFields.includes(key)) {
      return (
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setShowDatePicker({ visible: true, field: key })}
        >
          <Text style={{ color: truckData[key] ? '#000' : '#888' }}>
            {truckData[key] || `Select ${key}`}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TextInput
        style={styles.input}
        placeholder={`Enter ${key}`}
        placeholderTextColor="#888"
        value={truckData[key]?.toString()}
        onChangeText={(value) => handleChange(key, value)}
        keyboardType={key === 'totalKm' ? 'numeric' : 'default'}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add New Truck</Text>

      {Object.keys(truckData).map((key) => (
        <View style={styles.inputContainer} key={key}>
          <Text style={styles.label}>{key}</Text>
          {renderInputField(key)}
        </View>
      ))}

      {showDatePicker.visible && (
        <DateTimePicker
          value={truckData[showDatePicker.field] ? new Date(truckData[showDatePicker.field]) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={[styles.saveButton, loading && { backgroundColor: '#888' }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Saving...' : 'Save Truck'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: moderateScale(24),
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: moderateScale(20),
    color: '#222',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: moderateScale(16),
  },
  label: {
    fontWeight: 'bold',
    marginBottom: moderateScale(6),
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    backgroundColor: '#fff',
    color: '#000',
    fontSize: moderateScale(14),
  },
  saveButton: {
    marginTop: moderateScale(30),
    backgroundColor: '#4caf50',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
  },
});
