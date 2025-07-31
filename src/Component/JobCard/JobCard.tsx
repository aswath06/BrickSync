import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type JobCardProps = {
  title?: string;
  statusText?: string;
  statusColor?: string;
  slNo: string;
  customerName: string;
  customerPhone: string;
  loadDetails: string[];
  buttonLabel?: string;
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void; // ✅ Ensure this is included
};

export const JobCard: React.FC<JobCardProps> = ({
  title = 'Pending Jobs',
  statusText,
  statusColor,
  slNo,
  customerName,
  customerPhone,
  loadDetails,
  buttonLabel,
  width = 330,
  height = 'auto',
  style,
  disabled = false,
  onPress,
}) => {
  return (
    <View style={[styles.card, { width, height }, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {statusText && statusColor && (
          <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        )}
      </View>

      {/* Info rows */}
      <View style={styles.row}>
        <Text style={styles.label}>Sl.no</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{slNo}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer Name</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{customerName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer Phone</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{customerPhone}</Text>
      </View>

      {/* Load Details */}
      <View style={styles.row}>
        <Text style={styles.label}>Load details</Text>
        <Text style={styles.colon}>:</Text>
        <View style={{ flex: 1 }}>
          {loadDetails.map((item, index) => (
            <Text key={index} style={styles.loadItem}>
              • {item}
            </Text>
          ))}
        </View>
      </View>

      {/* Button */}
      {buttonLabel && (
        <TouchableOpacity
          style={[styles.button, disabled && styles.disabledButton]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  statusContainer: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  label: {
    width: 130,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  colon: {
    width: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    fontWeight: '400',
  },
  loadItem: {
    fontSize: 14,
    color: '#555',
    fontWeight: '400',
    marginBottom: 2,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#1570EF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
