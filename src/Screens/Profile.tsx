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
import { useToggleStore } from '../stores/useToggleStore';
import { moderateScale } from './utils/scalingUtils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export const Profile = () => {
  const navigation = useNavigation<any>();
  const { users, setUsers } = useAllUsersStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | null>(null); // NEW: role filter
  const user = useUserStore((state) => state.user);
  const userRole = user?.userrole;
  const { isEnglish } = useToggleStore();

  const fetchUsers = async () => {
    try {
      setError(null);
      const token = await getToken();
      if (!token) {
        setError(isEnglish ? 'Token not found' : 'டோக்கன் கிடைக்கவில்லை');
        return;
      }

      const response = await fetch(`${baseUrl}${RegisterEndpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error:', errorText);
        throw new Error(isEnglish ? 'Failed to fetch users' : 'பயனர்களை ஏற்றுவதில் தோல்வி');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error(isEnglish ? 'Invalid response format' : 'தவறான பதிலின் வடிவம்');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const getRoleLabel = (role: number) => {
    switch (role) {
      case 1:
        return isEnglish ? 'Admin' : 'நிர்வாகி';
      case 2:
        return isEnglish ? 'Driver' : 'ஓட்டுனர்';
      case 3:
        return isEnglish ? 'Customer' : 'வாடிக்கையாளர்';
      default:
        return isEnglish ? 'Unknown' : 'தெரியாதவர்';
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('StatementPage', {
          statements: item.statements ?? [],
          balance: item.balance ?? 0,
          username: item.name,
          phoneNumber: item.phone,
          userId: item.userid,
          userrole: item.userrole,
        })
      }
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
      <Text style={styles.detail}>
        {isEnglish ? 'Balance' : 'மீதம்'}: ₹{item.balance}
      </Text>
      <Text style={styles.detail}>
        {isEnglish ? 'Phone' : 'தொலைபேசி'}: {item.phone}
      </Text>
    </TouchableOpacity>
  );

  if (loading && (!users || users.length === 0)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const filteredUsers = Array.isArray(users)
    ? userRole === 1
      ? users
      : users.filter((u) => u?.userrole === 1)
    : [];

  // Apply role filter
  const roleFilteredUsers = roleFilter
    ? filteredUsers.filter((u) => u?.userrole === roleFilter)
    : filteredUsers;

  // Apply search
  const searchedUsers = roleFilteredUsers.filter(
    (u) =>
      u?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u?.phone?.toString().includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isEnglish ? 'User List' : 'பயனர் பட்டியல்'}
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder={isEnglish ? 'Search by name or phone' : 'பெயர் அல்லது தொலைபேசியில் தேடுக'}
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {[ 
          { label: isEnglish ? 'All' : 'அனைத்து', value: null },
          { label: getRoleLabel(1), value: 1 },
          { label: getRoleLabel(2), value: 2 },
          { label: getRoleLabel(3), value: 3 },
        ].map((chip) => (
          <TouchableOpacity
            key={chip.label}
            style={[
              styles.chip,
              roleFilter === chip.value && styles.chipSelected,
            ]}
            onPress={() => setRoleFilter(chip.value)}
          >
            <Text
              style={[
                styles.chipText,
                roleFilter === chip.value && styles.chipTextSelected,
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      ) : searchedUsers.length > 0 ? (
        <FlatList
          data={searchedUsers}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.text}>
          {isEnglish ? 'No users found' : 'பயனர்கள் இல்லை'}
        </Text>
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
    marginBottom: moderateScale(10),
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: moderateScale(16),
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  chip: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(16),
    backgroundColor: '#eee',
    marginHorizontal: moderateScale(4),
    marginBottom: moderateScale(8),
  },
  chipSelected: {
    backgroundColor: '#007bff',
  },
  chipText: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
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
