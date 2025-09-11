import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../apis/addProductToCart';
import { addItemToCart, removeItemFromCart } from '../../redux/cartSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getVariantDiscount = (price, salePrice) => {
  if (!price || !salePrice || price <= salePrice) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const CARD_HEIGHT = 425;
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
  productId,
  variantId,
  variants = [],
}) => {
  const originalPrice = Number(price);
  const discountPercent = parseInt(discount);
  const hasDiscount = !isNaN(discountPercent) && discountPercent > 0;
  const [loading, setLoading] = useState(false);

  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  const isOutOfStock = stock <= 0;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const isProductInCart = cartItems.some(
    item => item.productId === productId && item.variantId === variantId,
  );

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const productData = {
        productId,
        variantId,
        quantity: 1,
        title,
        price: discountedPrice,
        image: images && images.length > 0 ? images[0] : '',
        discount,
      };
      dispatch(addItemToCart(productData));
      console.log('productData', productData);
      await addProductToCart({ productId, variantId, quantity: 1 });
      navigation.navigate('Cart');
    } catch (error) {
      console.warn('Failed to add to cart:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCart = () => {
    navigation.navigate('Cart');
  };

  const handleCardPress = () => {
    navigation.navigate('SingleProductScreen', { productId });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.card, { width: cardWidth }]}
      onPress={handleCardPress}
    >
      {/* Content wrapper */}
      <View style={styles.cardInner}>
        <View style={styles.imageSection}>
          <LinearGradient
            colors={['#1C83A8', '#48BDE6', '#2F90B3', '#13789DE6']}
            style={styles.bestsellerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bestsellerText}>BESTSELLER</Text>
          </LinearGradient>
          <Swiper
            style={styles.swiper}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            paginationStyle={styles.pagination}
            autoplay={false}
            loop={false}
            showsPagination
          >
            {images && images.length > 0 ? (
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
          {/* <View style={styles.vegWrapper}>
            <Image
              source={require('../../assets/images/vegg.png')}
              style={styles.vegIcon}
              resizeMode="contain"
            />
          </View> */}
          <View style={styles.vegMark}>
            <View style={styles.vegBox}>
              <View style={styles.vegDot} />
            </View>
            <Text style={styles.vegText}>VEG</Text>
          </View>
        </View>
        {brandId && brandId.name && (
          <Text style={styles.brandText}>{brandId.name}</Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
          {variants.map((variant, index) => (
            <View
              key={variant._id || index}
              style={[
                styles.variantChipContainer,
                { marginRight: 8, marginBottom: 4 },
              ]}
            >
              <Text style={styles.variantChipText}>
                {variant.weight} |{' '}
                {getVariantDiscount(variant.price, variant.salePrice)}% OFF
              </Text>
            </View>
          ))}
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
      </View>
      <View style={styles.cartButtonRow}>
        {isOutOfStock ? (
          <View style={styles.outOfStockButton}>
            <Text style={styles.outOfStockButtonText}>OUT OF STOCK</Text>
          </View>
        ) : isProductInCart ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.cartButton}
            onPress={handleGoToCart}
          >
            <Text style={styles.cartButtonText}>GO TO CART</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.cartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.cartButtonText}>
              {loading ? 'ADDING…' : 'ADD TO CART'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.64,
    alignSelf: 'center',
    paddingHorizontal: 5,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
  },
  cardInner: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
    backgroundColor: '#F6F6F6',
    borderRadius: 6,
    padding: 1,
    height: screenHeight * 0.22,
  },
  bestsellerContainer: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 4,
    position: 'absolute',
    top: 0,
    left: 1,
    zIndex: 1,
    height: 22,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  swiper: {
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  dot: {
    backgroundColor: '#ccc',
    width: 4,
    height: 4,
    borderRadius: 3,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#333',
    width: 6,
    height: 6,
    borderRadius: 4,
    margin: 3,
  },
  pagination: {
    bottom: -5,
  },
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
    fontSize: 15,
    fontWeight: '600',
    color: '̀',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'gotham-rounded-book',
  },
  vegWrapper: {
    alignItems: 'center',
    marginLeft: 4,
    width: 22,
  },
  vegIcon: {
    width: 14,
    height: 16,
    marginRight: 3,
  },
  brandText: {
    fontSize: 12,
    color: '#6A6868',
    marginTop: 5,
    fontFamily: 'gotham-rounded-book',
  },
  variantChipContainer: {
    backgroundColor: '#6A68681A',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  variantChipText: {
    color: '#19191c',
    fontSize: 11,
    fontFamily: 'Gotham-Rounded-Medium',
    letterSpacing: 0.2,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6A6868',
    marginTop: 6,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  priceDiscountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    left: 5,
    right: 5,
  },
  cartButton: {
    backgroundColor: '#0888B1',
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
});
