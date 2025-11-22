import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Dimensions,
  Platform,
} from 'react-native';
import { addProductToCart } from '../../apis/addProductToCart';
import { addItemToCart } from '../../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getSpecialProducts } from '../../apis/getSpecialProducts';

const { width: SW, height: SH } = Dimensions.get('window');
const isVerySmallRaw = SW <= 340 || SH <= 600;
const isSmallRaw = SW <= 375 || SH <= 667;
const isSmallStrict = SW <= 384 || SH <= 684;
const useVerySmall = isVerySmallRaw;
const useSmall = isSmallRaw && isSmallStrict;

const SpecialDealCard = ({ deal, cardWidth, onClaim, isInCart, loading }) => (
  <View style={[styles.card, { width: cardWidth }]}>
    <Image
      source={{ uri: deal.image }}
      style={styles.productImage}
      resizeMode="contain"
    />
    <View style={styles.infoContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {deal.title}
        </Text>
        {deal.veg && (
          <View style={styles.vegMark}>
            <View style={styles.vegBox}>
              <View style={styles.vegDot} />
            </View>
            <Text style={styles.vegText}>VEG</Text>
          </View>
        )}
      </View>
      <View style={styles.labelRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{deal.badge}</Text>
        </View>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{`₹${deal.price}`}</Text>
      </View>
      <View style={styles.mrpDiscountRow}>
        <Text style={styles.mrp}>{`₹${deal.mrp}`}</Text>
        <Text style={styles.discount}> ({deal.discount})</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.claimBtn, isInCart && styles.goToCartBtn]}
        onPress={onClaim}
        disabled={loading}
      >
        <Text style={styles.claimBtnText}>
          {loading ? 'CLAIMING' : isInCart ? 'CLAIMED' : 'CLAIM'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SpecialDeals = () => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.9, 360);
  const cardSpacing = (width - cardWidth - 32) / 6;
  const [bestSellerData, setBestSellerData] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getSpecialProducts();
        const allProducts = response?.data;
        console.log('API Response:', response);
        console.log('Products Data:', response?.data);

        if (Array.isArray(allProducts) && allProducts.length > 0) {
          const specialDeals = allProducts.map(item => {
            const weight = item.weight || 0;
            const formattedWeight =
              weight >= 1000 ? `${(weight / 1000).toFixed(1)}kg` : `${weight}g`;

            const brandName = item.brandId?.name
              ? ` | ${item.brandId.name}`
              : '';
            const badge = formattedWeight + brandName;
            const hasVariants = item.variants && item.variants.length > 0;
            const variantId = hasVariants ? item.variants[0]._id : null;
            const salePrice = item.salePrice || item.price || 0;
            const originalPrice = item.price || 0;
            const finalPrice = Math.round(salePrice);
            const finalMrp = Math.round(originalPrice);
            let discountText = '0%';
            if (originalPrice > salePrice && salePrice > 0) {
              const discountPercentage = Math.round(
                ((originalPrice - salePrice) / originalPrice) * 100,
              );
              discountText = `${discountPercentage}%`;
            }

            const dealObj = {
              id: item._id,
              image: item.images?.[0] || '',
              title: item.title || 'Unknown Product',
              badge,
              price: finalPrice,
              mrp: finalMrp,
              discount: discountText,
              veg: item.isVeg || false,
              productId: item._id,
              variantId: variantId,
              stock: item.stock || 1,
            };

            console.log('Deal Object Created:', dealObj);
            return dealObj;
          });

          console.log('All Special Deals:', specialDeals);
          setBestSellerData(specialDeals);
        } else {
          console.log('No special products available');
          setBestSellerData([]);
        }
      } catch (error) {
        console.error('Error fetching special products:', error);
        setBestSellerData([]);
      }
    };

    fetchProducts();
  }, []);

  const handleGoToCart = () => {
    navigation.navigate('Cart');
  };

  const handleClaim = async deal => {
    if (loadingMap[deal.id]) return;

    setLoadingMap(prev => ({ ...prev, [deal.id]: true }));

    try {
      const cartItemPayload = {
        productId: deal.productId,
        variantId: deal.variantId,
        quantity: 1,
        title: deal.title,
        price: deal.mrp,
        salePrice: deal.price,
        image: deal.image,
        discount: deal.discount,
        total: deal.price,
      };
      dispatch(addItemToCart(cartItemPayload));
      const apiPayload = {
        productId: deal.productId,
        quantity: 1,
      };
      if (deal.variantId) {
        apiPayload.variantId = deal.variantId;
      }

      console.log('API Payload:', apiPayload);
      await addProductToCart(apiPayload);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      console.error('Error message:', error.message);
    } finally {
      setLoadingMap(prev => ({ ...prev, [deal.id]: false }));
    }
  };

  const isProductInCart = (productId, variantId) => {
    if (variantId) {
      return cartItems.some(
        item => item.productId === productId && item.variantId === variantId,
      );
    } else {
      return cartItems.some(item => item.productId === productId);
    }
  };
  if (bestSellerData.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Unlock special deals</Text>
      <Text style={styles.subHeader}>Almost there! Add ₹903 more</Text>

      <FlatList
        data={bestSellerData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        extraData={cartItems}
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 5 }}>
            <SpecialDealCard
              deal={item}
              cardWidth={cardWidth}
              isInCart={isProductInCart(item.productId, item.variantId)}
              loading={loadingMap[item.id]}
              onClaim={
                isProductInCart(item.productId, item.variantId)
                  ? handleGoToCart
                  : () => handleClaim(item)
              }
            />
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: cardSpacing,
          paddingVertical: 14,
        }}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: useVerySmall ? 6 : useSmall ? 8 : 8,
    backgroundColor: '#fff',
  },
  header: {
    color: '#1195d6',
    fontFamily: 'Gotham-Rounded-Bold',
    fontSize: useVerySmall ? 16 : useSmall ? 18 : 19,
    marginBottom: useVerySmall ? 1 : useSmall ? 2 : 2,
  },
  subHeader: {
    color: '#2ca9dd',
    fontSize: useVerySmall ? 12 : useSmall ? 13 : 14,
    marginBottom: useVerySmall ? 8 : useSmall ? 10 : 11,
    fontFamily: 'gotham-rounded-book',
  },
  card: {
    backgroundColor: '#F59A110D',
    borderRadius: 13,
    padding: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ffe2c2',
    minHeight: 96,
  },
  productImage: {
    width: 64,
    height: 88,
    marginRight: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#233',
    marginBottom: 2,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#004E6A33',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#223',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  vegMark: {
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 2,
  },
  vegBox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: '#008000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 7,
    backgroundColor: '#008000',
  },
  vegText: {
    fontSize: 8,
    color: '#008000',
    marginTop: 1,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#169542',
    marginRight: 6,
  },
  mrpDiscountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 0,
  },
  mrp: {
    fontSize: 10,
    color: '#998077',
    textDecorationLine: 'line-through',
    marginRight: 3,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  discount: {
    fontSize: 10,
    color: '#43b67e',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  claimBtn: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    backgroundColor: '#ffa930',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    minWidth: '45%',
  },
  goToCartBtn: {
    backgroundColor: '#0888B1',
  },
  claimBtnText: {
    fontSize: 12,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#fff',
    letterSpacing: 1,
  },
});

export default SpecialDeals;
