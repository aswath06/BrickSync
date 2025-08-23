import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { ArrowBack } from '../assets';
import { useProductStore } from '../stores/useProductStore';
import { useToggleStore } from '../stores/useToggleStore';
import { moderateScale } from './utils/scalingUtils';

const { height } = Dimensions.get('window');

export const ProductDetails = ({ route, navigation }: any) => {
  const { productId, product: passedProduct } = route.params || {};
  const { isEnglish } = useToggleStore();

  const product =
    passedProduct || useProductStore.getState().getProductById(productId);

  const [showLottie, setShowLottie] = useState(false);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>{isEnglish ? 'Product not found.' : 'பொருள் கிடைக்கவில்லை.'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: 'blue' }}>{isEnglish ? 'Go Back' : 'மீண்டும் செல்லவும்'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isTypeSelectable = !!product.typeOptions;
  const isSandCategory = product.category === 'Sand';

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
  const description = product.description ?? (isEnglish ? 'No description available.' : 'விளக்கம் இல்லை.');
  const unitPrice = parseInt(product.price?.replace(/[^\d]/g, '') || '0', 10);

  const handleAddToCart = () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      alert(isEnglish ? 'Please enter a valid quantity.' : 'சரியான அளவை உள்ளிடவும்.');
      return;
    }

    const total = qty * unitPrice;

    useProductStore.getState().addToCart({
      product,
      selectedType,
      selectedSize,
      quantity: qty,
      total,
    });

    setShowLottie(true);
    setTimeout(() => setShowLottie(false), 1500);
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
        <Text style={styles.title}>{isEnglish ? 'Details' : 'விபரங்கள்'}</Text>
        <TouchableOpacity>
          <Text style={styles.heartIcon}>💙</Text>
        </TouchableOpacity>
      </View>

      {/* Full-screen Lottie overlay */}
      {showLottie && (
        <View style={styles.fullScreenLottie}>
          <ScrollView
            contentContainerStyle={styles.lottieScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <LottieView
              source={require('../assets/lottie/ShoppingCart.json')}
              autoPlay
              loop={false}
              style={styles.lottieStyle}
            />
          </ScrollView>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        nestedScrollEnabled
      >
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          <Text style={styles.descriptionLabel}>{isEnglish ? 'Description' : 'விளக்கம்'}</Text>
          <Text style={styles.details}>{description}</Text>

          {/* Type Selector */}
          {isTypeSelectable && (
            <>
              <Text style={styles.chooseSize}>{isEnglish ? 'Choose Type' : 'வகையை தேர்ந்தெடுக்கவும்'}</Text>
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
              <Text style={styles.chooseSize}>{isEnglish ? 'Choose Size' : 'அளவை தேர்ந்தெடுக்கவும்'}</Text>
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
          <Text style={styles.quantity}>{isEnglish ? 'Quantity' : 'அளவு'}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder={isEnglish ? 'Enter quantity' : 'அளவை உள்ளிடவும்'}
            placeholderTextColor="#aaa"
            value={quantity}
            onChangeText={setQuantity}
          />

          {/* Total Summary */}
          {quantity !== '' && !isNaN(Number(quantity)) && (
            <>
              <Text style={styles.summaryText}>
                {isEnglish ? 'Selected Quantity' : 'தேர்ந்தெடுக்கப்பட்ட அளவு'}: {quantity}
              </Text>
              <Text style={styles.summaryText}>
                {isEnglish ? 'Total Price' : 'மொத்த விலை'}: ₹{Number(quantity) * unitPrice}
              </Text>
            </>
          )}

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <Text style={styles.cartText}>{isEnglish ? 'Add to Cart' : 'கார்ட்டில் சேர்க்கவும்'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginTop: moderateScale(20) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(52),
    paddingHorizontal: moderateScale(16),
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: { fontSize: moderateScale(18), fontWeight: '600' },
  heartIcon: { fontSize: moderateScale(22) },
  image: { width: '100%', height: moderateScale(400) },
  bottomSheet: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    padding: moderateScale(20),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(6),
    marginTop: moderateScale(-20),
  },
  dragHandle: {
    width: moderateScale(40),
    height: moderateScale(4),
    backgroundColor: '#ccc',
    borderRadius: moderateScale(2),
    alignSelf: 'center',
    marginBottom: moderateScale(12),
  },
  productName: { fontSize: moderateScale(20), fontWeight: '700', marginBottom: moderateScale(6), color: '#1E1E1E' },
  price: { fontSize: moderateScale(16), fontWeight: '600', color: '#1577EA', marginBottom: moderateScale(10) },
  descriptionLabel: { fontWeight: '600', marginBottom: moderateScale(4), color:'black' },
  details: { fontSize: moderateScale(13), color: '#666', marginBottom: moderateScale(12) },
  chooseSize: { fontWeight: '600', marginBottom: moderateScale(6), color:'black' },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: moderateScale(10), marginBottom: moderateScale(16) },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: moderateScale(14),
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateScale(6),
  },
  sizeButtonActive: { backgroundColor: '#1577EA', borderColor: '#1577EA' },
  sizeText: { fontSize: moderateScale(13), color: '#333' },
  sizeTextActive: { fontSize: moderateScale(13), color: '#fff' },
  quantity: { fontWeight: '600', color:'black' },
  input: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    marginVertical: moderateScale(8),
    fontSize: moderateScale(14),
    color: '#000',
  },
  summaryText: { fontSize: moderateScale(14), fontWeight: '600', color: '#333', marginBottom: moderateScale(4), marginTop: moderateScale(4) },
  cartButton: {
    backgroundColor: '#1577EA',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  cartText: { color: '#fff', fontWeight: 'bold', fontSize: moderateScale(15) },
  fullScreenLottie: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 999,
  },
  lottieScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  lottieStyle: {
    width: '80%',
    height: '80%',
  },
});
