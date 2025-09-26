import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../apis/addProductToCart';
import { addItemToCart } from '../../redux/cartSlice';
import Lottie from 'lottie-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PARENT_CARD_WIDTH = Math.round(screenWidth * 0.48);
const VAR_CARD_WIDTH = Math.round(PARENT_CARD_WIDTH * 0.52);
const VAR_CARD_GAP = 5;
const VAR_CARD_HEIGHT = 50;
const CARD_HEIGHT = 425;

const getVariantDiscount = (price, salePrice) => {
  if (!price || !salePrice || price <= salePrice) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const formatWeight = w => {
  const n = Number(w) || 0;
  if (n >= 1000) {
    const kg = n / 1000;
    return Number.isInteger(kg) ? `${kg}kg` : `${kg.toFixed(1)}kg`;
  }
  return `${n}g`;
};

const ProductCard = ({
  images,
  title,
  rating,
  price,
  discount,
  isVeg,
  stock,
  cardWidth = 110,
  brandId,
  isBestSeller,
  productId,
  variants = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants.length > 0 ? variants[0]._id : null,
  );

  const originalPrice = Number(price);
  const discountPercent = parseInt(discount);
  const hasDiscount = !isNaN(discountPercent) && discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  const isOutOfStock = stock <= 0;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const isProductInCart = cartItems.some(item => item.productId === productId);

  const handleAddToCart = async () => {
    if (loading || isOutOfStock) return;
    setLoading(true);
    try {
      const productData = {
        productId,
        variantId: null,
        quantity: 1,
        title,
        price: discountedPrice,
        image: images?.length > 0 ? images[0] : '',
        discount: hasDiscount ? `${discountPercent}%` : '0%',
      };
      dispatch(addItemToCart(productData));
      await addProductToCart({
        productId,
        variantId: null,
        quantity: 1,
      });
      navigation.navigate('Cart');
    } catch (error) {
      console.warn('Failed to add to cart:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCart = () => navigation.navigate('Cart');
  const handleCardPress = () =>
    navigation.navigate('SingleProductScreen', { productId });

  const handleVariantSelect = id => setSelectedVariantId(id);

  const normalizedVariants = useMemo(
    () =>
      variants.map(v => ({
        ...v,
        weightLabel: formatWeight(v.weight),
        salePrice: Number(v.salePrice ?? v.price),
        mrpPrice: Number(v.price),
        discountPercentage: getVariantDiscount(
          Number(v.price),
          Number(v.salePrice ?? v.price),
        ),
      })),
    [variants],
  );

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.card, { width: cardWidth }]}
      onPress={handleCardPress}
    >
      <View style={styles.cardInner}>
        <View style={styles.imageSection}>
          {isBestSeller && (
            <LinearGradient
              colors={['#1C83A8', '#48BDE6', '#2F90B3', '#13789DE6']}
              style={styles.bestsellerContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.bestsellerText}>BESTSELLER</Text>
            </LinearGradient>
          )}
          <Swiper
            style={styles.swiper}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            paginationStyle={styles.pagination}
            autoplay={false}
            loop={false}
            showsPagination
          >
            {images?.length > 0 ? (
              images.map((imgSrc, index) => (
                <Image
                  key={index}
                  source={{ uri: imgSrc }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ))
            ) : (
              <Text>No images available</Text>
            )}
          </Swiper>
          <Text style={styles.ratingText}>⭐ {rating}</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
          {isVeg && (
            <View style={styles.vegMark}>
              <View style={styles.vegBox}>
                <View style={styles.vegDot} />
              </View>
              <Text style={styles.vegText}>VEG</Text>
            </View>
          )}
        </View>

        {brandId?.name && <Text style={styles.brandText}>{brandId.name}</Text>}

        <View>
          {normalizedVariants?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vRow}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={VAR_CARD_WIDTH + VAR_CARD_GAP}
            >
              {normalizedVariants.map(v => {
                return (
                  <Pressable
                    key={v._id}
                    style={[
                      styles.vCard,
                      {
                        width: VAR_CARD_WIDTH,
                        height: VAR_CARD_HEIGHT,
                        marginRight: VAR_CARD_GAP,
                      },
                    ]}
                  >
                    <View style={styles.vHead}>
                      <Text style={styles.vHeadTxt}>{v.weightLabel}</Text>
                    </View>

                    <View style={styles.vBody}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text style={styles.vSale}>₹{v.salePrice}</Text>
                        {v.mrpPrice > v.salePrice && (
                          <Text style={styles.vMrp}>MRP ₹{v.mrpPrice}</Text>
                        )}
                      </View>
                      <Text style={styles.vOff}>
                        {v.discountPercentage}% OFF
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>

        <Text style={styles.priceLabel}>PRICE</Text>
        <View style={styles.priceDiscountRow}>
          <Text style={styles.priceValue}>₹{discountedPrice}</Text>
          {hasDiscount && (
            <>
              <Text style={styles.strikePrice}>₹{originalPrice}</Text>
              <View style={styles.discountContainer}>
                <Text style={styles.discountText}>{discount} OFF</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.cartButtonRow}>
          {isOutOfStock ? (
            <View style={styles.outOfStockButton}>
              <Text style={styles.outOfStockButtonText}>OUT OF STOCK</Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cartButton}
              onPress={isProductInCart ? handleGoToCart : handleAddToCart}
              disabled={loading}
            >
              {loading ? (
                <Lottie
                  source={require('../../lottie/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 25, height: 25, alignSelf: 'center' }}
                />
              ) : (
                <Text style={styles.cartButtonText}>
                  {isProductInCart ? 'GO TO CART' : 'ADD TO CART'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.64,
    alignSelf: 'center',
    paddingHorizontal: 6,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderColor: '#F59A11',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 15,
  },
  cardInner: { flex: 1, justifyContent: 'flex-start' },
  imageSection: {
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
    backgroundColor: '#F6F6F6',
    borderRadius: 6,
    padding: 10,
    height: screenHeight * 0.22,
    borderColor: '#F59A11',
    borderWidth: 0.8,
    marginHorizontal: 1,
    marginTop: 7,
  },
  bestsellerContainer: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    position: 'absolute',
    top: 0,
    left: 1,
    zIndex: 1,
    height: 24,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  swiper: { width: '100%' },
  productImage: { width: '100%', height: '100%' },
  ratingText: {
    fontSize: 10,
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 3,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  titleText: {
    fontSize: 14,
    color: '#181818',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'gotham-rounded-book',
    lineHeight: 18,
  },
  brandText: {
    fontSize: 13,
    color: '#F59A11',
    marginTop: 5,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6A6868',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  priceDiscountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  priceValue: {
    fontSize: 12,
    color: '#218032',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  strikePrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 10,
    marginLeft: 5,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  discountContainer: {
    backgroundColor: '#004E6A',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  discountText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  cartButtonRow: {
    position: 'absolute',
    bottom: 8,
    left: 4,
    right: 5,
  },
  cartButton: {
    backgroundColor: '#F59A11',
    borderRadius: 6,
    width: '100%',
    height: 36,
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  outOfStockButton: {
    backgroundColor: '#99a1ad',
    borderRadius: 8,
    width: '100%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockButtonText: {
    color: '#ffffff',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  vegMark: { alignItems: 'center', marginLeft: 12 },
  vegBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#008000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 11,
    height: 11,
    borderRadius: 7,
    backgroundColor: '#008000',
  },
  vegText: { fontSize: 11, color: '#008000', marginTop: 1 },
  vRow: { paddingVertical: 6 },
  vCard: {
    borderRadius: 10,

    backgroundColor: '#ffffff',
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#014e6a',
  },
  vHead: {
    height: 16,
    backgroundColor: '#0A4B5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vHeadTxt: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  vBody: {
    paddingHorizontal: 4,
    paddingTop: 1,
    paddingBottom: 6,
    flex: 1,
  },
  vSale: { color: '#014e6a', fontSize: 11, fontFamily: 'Gotham-Rounded-Bold' },
  vMrp: {
    marginLeft: 6,
    color: '#6a6a6a',
    fontSize: 9,
    textDecorationLine: 'line-through',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  vOff: {
    color: '#007d17',
    fontSize: 9,
    fontFamily: 'Gotham-Rounded-Bold',
    textAlign: 'center',
  },
});
