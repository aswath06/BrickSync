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
  TextInput,
} from 'react-native';
import { useAllUsersStore } from '../stores/useAllUsersStore';
import { getToken } from '../services/authStorage';
import { baseUrl, RegisterEndpoint } from '../../config';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../stores/useUserStore';
import { moderateScale } from './utils/scalingUtils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const Profile = () => {
  const navigation = useNavigation<any>();
  const { users, setUsers } = useAllUsersStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useUserStore((state) => state.user);
  const userRole = user?.userrole;

  const fetchUsers = async (pageNumber = 1, isRefresh = false) => {
    try {
      setError(null);
      const token = await getToken();
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await fetch(
        `${baseUrl}${RegisterEndpoint}?page=${pageNumber}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        if (isRefresh || pageNumber === 1) {
          setUsers(data);
        } else {
          setUsers((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === 10); // Assume no more if less than 10
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
      await fetchUsers(1, true);
      setPage(2);
      setLoading(false);
    };
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(1, true);
    setPage(2);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!loading && hasMore && !refreshing) {
      setLoading(true);
      await fetchUsers(page);
      setPage((prev) => prev + 1);
      setLoading(false);
    }
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
      onPress={() => {
        navigation.navigate('StatementPage', {
          statements: item.statements ?? [],
          balance: item.balance ?? 0,
          username: item.name,
          phoneNumber: item.phone,
          userId: item.userid,
        });
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

  if (loading && users.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const filteredUsers =
    userRole === 1
      ? users
      : users.filter((u) => u.userrole === 1);

  const searchedUsers = filteredUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.toString().includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User List</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or phone"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {error ? (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      ) : searchedUsers.length > 0 ? (
        <FlatList
          data={searchedUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListFooterComponent={
            hasMore && !refreshing ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : null
          }
        />
      ) : (
        <Text style={styles.text}>No users found</Text>
      )}

      {userRole === 1 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddUserPage')}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
    textAlign: 'center',
    color: 'black',
    marginTop: moderateScale(30),
  },
  searchInput: {
    height: moderateScale(40),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    backgroundColor: '#fff',
    marginBottom: moderateScale(16),
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: moderateScale(16),
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: moderateScale(8),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  roleBanner: {
    position: 'absolute',
    top: moderateScale(6),
    right: moderateScale(6),
    backgroundColor: '#007bff',
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(6),
  },
  roleText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: moderateScale(4),
  },
  detail: {
    fontSize: moderateScale(14),
    color: '#555',
    marginTop: moderateScale(2),
    textAlign: 'center',
  },
  text: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginTop: moderateScale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginTop: moderateScale(20),
    color: 'red',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: moderateScale(20),
    right: moderateScale(20),
    backgroundColor: '#007bff',
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(4),
  },
  fabText: {
    fontSize: moderateScale(28),
    color: '#fff',
    marginBottom: moderateScale(2),
  },
});
