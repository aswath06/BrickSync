import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

import {
  ArrowBack,
  BagIcon,
} from '../assets';
import { SearchIcon } from '../assets/icons/SearchIcon';
import { useProductStore } from '../stores/useProductStore';

const filterCategories = ['All', 'Cement', 'Sand', 'Bricks'];

export const Orders = ({ navigation }: any) => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const { products } = useProductStore();

  const filteredProducts =
    selectedFilter === 'All'
      ? products
      : products.filter(item => item.category === selectedFilter);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
    accessibilityRole="button"
    activeOpacity={0.8}
  >
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity style={styles.heart}>
        <Text style={styles.heartIcon}>💙</Text>
      </TouchableOpacity>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.size}>
        {item.name} - {item.size}
      </Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Place Your Order</Text>
<TouchableOpacity
  style={styles.bagIconWrapper}
  onPress={() => navigation.navigate('Cart')}
>
  <BagIcon width={48} height={48} />
</TouchableOpacity>

      </View>

      <View style={styles.searchBox}>
        <SearchIcon width={16} height={16} color="#1577EA" />
        <TextInput
          style={styles.input}
          placeholder="What do you need?"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.filters}>
        {filterCategories.map(category => {
          const isActive = selectedFilter === category;
          return (
            <TouchableOpacity
              key={category}
              style={isActive ? styles.activeFilter : styles.filter}
              onPress={() => setSelectedFilter(category)}>
              <Text style={isActive ? styles.filterTextActive : styles.filterText}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

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
    width: '100%',
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
});