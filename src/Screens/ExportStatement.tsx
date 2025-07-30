import React from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const generateCSV = (): string => {
  const header = 'Date,Description,Amount\n';
  const rows = [
    ['2025-07-30', 'Order #123', '500'],
    ['2025-07-29', 'Refund', '-200'],
  ];
  return header + rows.map(row => row.join(',')).join('\n');
};

const ExportStatement = () => {
  const exportCSV = async () => {
    try {
      const fileName = 'statement.csv';
      const csvData = generateCSV();
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(path, csvData, 'utf8');
      Alert.alert('Success', `File saved at:\n${path}`);

      await Share.open({
        url: `file://${path}`,
        type: 'text/csv',
        filename: fileName,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', error.message || 'An error occurred.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Export CSV" onPress={exportCSV} />
    </View>
  );
};

export default ExportStatement;
