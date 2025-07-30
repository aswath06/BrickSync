import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAllUsersStore } from '../stores/useAllUsersStore';
import { getToken } from '../services/authStorage';
import { baseUrl, RegisterEndpoint } from '../../config';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const Profile = () => {
  const navigation = useNavigation<any>();
  const { users, setUsers } = useAllUsersStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setError(null);
      const token = await getToken();
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await fetch(`${baseUrl}${RegisterEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 1:
        return 'Admin';
      case 2:
        return 'Driver';
      case 3:
        return 'Customer';
      default:
        return 'Unknown';
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>{
        navigation.navigate('StatementPage', {
          statements: item.statements ?? [],
  balance: item.balance ?? 0,
  username: item.name,
  phoneNumber: item.phone,
  userId: item.userid, // 👈 Add
        })
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.image ||
              'https://static.vecteezy.com/system/resources/previews/029/271/062/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg',
          }}
          style={styles.image}
        />
        <View style={styles.roleBanner}>
          <Text style={styles.roleText}>{getRoleLabel(item.userrole)}</Text>
        </View>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>Balance: ₹{item.balance}</Text>
      <Text style={styles.detail}>Phone: {item.phone}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User List</Text>
      {error ? (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      ) : users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.text}>No users available</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  roleBanner: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#007bff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
