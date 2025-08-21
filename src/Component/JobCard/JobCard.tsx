import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { moderateScale } from '../../Screens/utils/scalingUtils';

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
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(6),
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  statusContainer: {
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(12),
  },
  statusText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: moderateScale(6),
  },
  label: {
    width: moderateScale(130),
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#000',
  },
  colon: {
    width: moderateScale(10),
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#000',
  },
  value: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#555',
    fontWeight: '400',
  },
  loadItem: {
    fontSize: moderateScale(14),
    color: '#555',
    fontWeight: '400',
    marginBottom: moderateScale(2),
  },
  button: {
    marginTop: moderateScale(16),
    backgroundColor: '#1570EF',
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(6),
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: moderateScale(24),
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
});

