import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import { ArrowBack } from '../assets';
import { useProductStore } from '../stores/useProductStore';

const { height } = Dimensions.get('window');

export const ProductDetails = ({ route, navigation }: any) => {
  const { productId, product: passedProduct } = route.params || {};

  // Load product either from params or Zustand store by id
  const product =
    passedProduct || useProductStore.getState().getProductById(productId);

  // Fallback UI if product not found
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isTypeSelectable = !!product.typeOptions;
  const isSandCategory = product.category === 'Sand';

  // Safe type and size arrays
  const types: string[] = Array.isArray(product.availableSizes)
    ? product.availableSizes
    : [];
  const [selectedType, setSelectedType] = useState(types[0] || '');

  const sizes: string[] =
    (product.typeOptions &&
      selectedType &&
      Array.isArray(product.typeOptions[selectedType])
      ? product.typeOptions[selectedType]
      : Array.isArray(product.availableSizes)
      ? product.availableSizes
      : product.size
      ? [product.size]
      : []);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');

  const [quantity, setQuantity] = useState('');
  const description = product.description ?? 'No description available.';
  const unitPrice = parseInt(product.price?.replace(/[^\d]/g, '') || '0', 10);

  const animScale = useRef(new Animated.Value(1)).current;
  const animTranslateY = useRef(new Animated.Value(0)).current;

  const handleAddToCart = () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const total = qty * unitPrice;

    // Add to Zustand cart store
    useProductStore.getState().addToCart({
      product,
      selectedType,
      selectedSize,
      quantity: qty,
      total,
    });

    // Animation
    Animated.parallel([
      Animated.timing(animScale, {
        toValue: 0.1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(animTranslateY, {
        toValue: height / 2,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      animScale.setValue(1);
      animTranslateY.setValue(0);
    });
  };

  useEffect(() => {
    if (isTypeSelectable && selectedType && product.typeOptions) {
      const defaultSize = product.typeOptions[selectedType]?.[0] ?? '';
      setSelectedSize(defaultSize);
    }
  }, [selectedType, product.typeOptions, isTypeSelectable]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBack width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Details</Text>
        <TouchableOpacity>
          <Text style={styles.heartIcon}>💙</Text>
        </TouchableOpacity>
      </View>

      {/* Animated Content */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale: animScale }, { translateY: animTranslateY }],
        }}
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            nestedScrollEnabled
          >
            <View style={styles.dragHandle} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.details}>{description}</Text>

            {/* Type Selector */}
            {isTypeSelectable && (
              <>
                <Text style={styles.chooseSize}>Choose Type</Text>
                <View style={styles.sizeRow}>
                  {types.map((type: string) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.sizeButton,
                        selectedType === type && styles.sizeButtonActive,
                      ]}
                      onPress={() => setSelectedType(type)}
                    >
                      <Text
                        style={
                          selectedType === type
                            ? styles.sizeTextActive
                            : styles.sizeText
                        }
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Size Selector */}
            {!isSandCategory && sizes.length > 0 && (
              <>
                <Text style={styles.chooseSize}>Choose Size</Text>
                <View style={styles.sizeRow}>
                  {sizes.map((size: string) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.sizeButtonActive,
                      ]}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text
                        style={
                          selectedSize === size
                            ? styles.sizeTextActive
                            : styles.sizeText
                        }
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Quantity */}
            <Text style={styles.quantity}>Quantity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter quantity"
              placeholderTextColor="#aaa"
              value={quantity}
              onChangeText={setQuantity}
            />

            {/* Total Summary */}
            {quantity !== '' && !isNaN(Number(quantity)) && (
              <>
                <Text style={styles.summaryText}>Selected Quantity: {quantity}</Text>
                <Text style={styles.summaryText}>
                  Total Price: ₹{Number(quantity) * unitPrice}
                </Text>
              </>
            )}

            {/* Add to Cart Button */}
            <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
              <Text style={styles.cartText}>Add to Cart</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginTop: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: { fontSize: 18, fontWeight: '600' },
  heartIcon: { fontSize: 22 },
  image: { width: '100%', height: 400 },
  bottomSheet: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  productName: { fontSize: 20, fontWeight: '700', marginBottom: 6, color: '#1E1E1E' },
  price: { fontSize: 16, fontWeight: '600', color: '#1577EA', marginBottom: 10 },
  descriptionLabel: { fontWeight: '600', marginBottom: 4 },
  details: { fontSize: 13, color: '#666', marginBottom: 12 },
  chooseSize: { fontWeight: '600', marginBottom: 6 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sizeButtonActive: {
    backgroundColor: '#1577EA',
    borderColor: '#1577EA',
  },
  sizeText: { fontSize: 13, color: '#333' },
  sizeTextActive: { fontSize: 13, color: '#fff' },
  quantity: { fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginVertical: 8,
    fontSize: 14,
    color: '#000',
  },
  summaryText: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4, marginTop: 4 },
  cartButton: {
    backgroundColor: '#1577EA',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cartText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
