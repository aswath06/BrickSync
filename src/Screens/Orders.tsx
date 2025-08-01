import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ArrowBack, BagIcon } from '../assets';
import { SearchIcon } from '../assets/icons/SearchIcon';
import { getToken } from '../services/authStorage';
import { baseUrl } from '../../config';
import { useProductStore } from '../stores/useProductStore'; // ✅ Zustand store
import { useUserStore } from '../stores/useUserStore';
import LottieView from 'lottie-react-native';

const filterCategories = ['All', 'Cement', 'Sand', 'Bricks'];

export const Orders = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newPrice, setNewPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
    const user = useUserStore((state) => state.user);

  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  // const addToCart = useProductStore((state) => state.addToCart);

  const userRole = user?.userrole;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${baseUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setProducts(data); // ✅ Save in Zustand
      } else {
        console.error('Fetch error:', data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((item) =>
    (selectedFilter === 'All' || item.category === selectedFilter) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePriceUpdate = async () => {
    if (!selectedProduct) return;
    try {
      const token = await getToken();
      const response = await fetch(`${baseUrl}/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...selectedProduct, price: newPrice }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedList = products.map((p) =>
          p.id === selectedProduct.id ? data : p
        );
        setProducts(updatedList);
        Alert.alert('Success', 'Price updated');
        setShowModal(false);
      } else {
        Alert.alert('Error', data.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity style={styles.heart}>
        <Text style={styles.heartIcon}>💙</Text>
      </TouchableOpacity>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.size}>{item.name} - {item.size}</Text>
      <Text style={styles.price}>{item.price}</Text>

      {/* 🛒 Add to Cart */}
      {/* <TouchableOpacity
        style={{ marginTop: 8, backgroundColor: '#1577EA', padding: 6, borderRadius: 6 }}
        onPress={() => addToCart({
          product: item,
          quantity: 1,
          total: parseFloat(item.price),
        })}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Add to Cart</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Place Your Order</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.bagIconWrapper}>
          <BagIcon width={48} height={48} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <SearchIcon width={16} height={16} color="#1577EA" />
        <TextInput
          style={styles.input}
          placeholder="What do you need?"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {filterCategories.map(category => {
          const isActive = selectedFilter === category;
          return (
            <TouchableOpacity
              key={category}
              style={isActive ? styles.activeFilter : styles.filter}
              onPress={() => setSelectedFilter(category)}
            >
              <Text style={isActive ? styles.filterTextActive : styles.filterText}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Product List */}
     {loading ? (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <LottieView
      source={require('../assets/lottie/Roboloading.json')}
      autoPlay
      loop
      style={{ width: 150, height: 150 }}
    />
  </View>
) : (
        <FlatList
  data={filteredProducts}
  numColumns={2}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  columnWrapperStyle={styles.row}
  contentContainerStyle={styles.productList}
  showsVerticalScrollIndicator={false}
  refreshing={loading}
  onRefresh={fetchProducts}
/>

      )}

      {/* Admin Price Update FAB */}
      {userRole === 1 && products.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            const firstProduct = products[0];
            setSelectedProduct(firstProduct);
            setNewPrice(firstProduct.price);
            setShowModal(true);
          }}
        >
          <Text style={styles.fabText}>₹</Text>
        </TouchableOpacity>
      )}

      {/* Debug Button (optional) */}
      <TouchableOpacity onPress={() => console.log(useProductStore.getState())}>
        <Text style={{ textAlign: 'center', color: 'gray', marginVertical: 10 }}>Log Store State</Text>
      </TouchableOpacity>

      {/* Price Modal */}
      {showModal && selectedProduct && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Update Product Price</Text>

            <Text style={styles.modalLabel}>Select Product</Text>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedProduct.id}
                onValueChange={(itemValue) => {
                  const product = products.find((p) => p.id === itemValue);
                  setSelectedProduct(product);
                  setNewPrice(product?.price || '');
                }}
              >
                {products.map((product) => (
                  <Picker.Item key={product.id} label={product.name} value={product.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.modalLabel}>New Price</Text>
            <TextInput
              style={styles.modalInput}
              value={newPrice}
              onChangeText={setNewPrice}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handlePriceUpdate}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
// Styles unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 42,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#1E1E1E' },
  bagIconWrapper: { width: 48, height: 48 },
  searchBox: {
    height: 47,
    flexDirection: 'row',
    backgroundColor: '#EAF1FB',
    borderRadius: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  input: { fontSize: 14, flex: 1, color: '#333', marginLeft: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  filter: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    elevation: 1,
  },
  activeFilter: {
    backgroundColor: '#1577EA',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  filterText: { fontSize: 12, color: '#444' },
  filterTextActive: { fontSize: 12, color: '#fff' },
  productList: { paddingBottom: 80 },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#EAF1FB',
    borderRadius: 16,
    padding: 12,
    width: '48%',
    marginBottom: 16,
    position: 'relative',
  },
  image: { width: '100%', height: 100 },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  heartIcon: { fontSize: 14 },
  category: { fontSize: 12, color: '#777', marginTop: 8 },
  size: { fontSize: 13, color: '#333' },
  price: { fontSize: 15, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#1577EA',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#1577EA',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
