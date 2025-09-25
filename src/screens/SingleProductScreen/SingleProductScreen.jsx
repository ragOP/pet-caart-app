import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Minus, Plus, Tag } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeliverySection from '../../components/DeliverySection/DeliverySection';
import ProductSliderShimmer from '../../ui/Shimmer/ProductSliderShimmer';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import { addItemToCart } from '../../redux/cartSlice';
import { getProducts } from '../../apis/getProducts';
import { getProductById } from '../../apis/getProductById';
import { addProductToCart } from '../../apis/addProductToCart';
import OffersBottomSheet from '../../components/OffersBottomSheet/OffersBottomSheet';
import Banner from '../../components/Banner/Banner';
import SingleProductShimmer from '../../ui/Shimmer/SingleProductShimmer';
import Lottie from 'lottie-react-native';

const { width: screenWidth } = Dimensions.get('window');

const getDiscountPercent = (price, salePrice) => {
  if (!price || !salePrice || price <= salePrice) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const formatWeight = grams => {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return kg % 1 === 0 ? `${kg}kg` : `${kg.toFixed(1)}kg`;
  }
  return `${grams}g`;
};

const coerceStockNumber = obj => {
  const candidates = [
    obj?.stock,
    obj?.inventory,
    obj?.quantity,
    obj?.available,
    obj?.availableUnits,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n)) return n;
  }
  return 0;
};

const PriceCardsRow = ({ variants = [], selectedId, onSelect }) => {
  const PriceCard = ({ item, isSelected, onPress }) => {
    const discount = getDiscountPercent(item.price, item.salePrice);
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[
          styles.cardShadow,
          isSelected && styles.cardShadowSelected,
          { opacity: isSelected ? 0.8 : 1 },
        ]}
      >
        <View style={[styles.card, isSelected && styles.cardSelected]}>
          <View style={styles.topBand}>
            <Text style={styles.topBandText}>
              {item.titleOverride || `${formatWeight(item.weight)}`}
            </Text>
          </View>
          <View style={styles.middleRow}>
            <Text style={styles.saleText}>
              {'₹'} {item.salePrice}
            </Text>
            {item.price > item.salePrice && (
              <Text style={styles.mrpText}>MRP {item.price}</Text>
            )}
          </View>
          <View style={styles.bottomBand}>
            <Text style={styles.bottomBandText}>{discount}% OFF</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!variants?.length) return null;

  return (
    <FlatList
      data={variants}
      keyExtractor={v => v._id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <PriceCard
          item={item}
          isSelected={selectedId === item._id}
          onPress={() => onSelect(selectedId === item._id ? null : item)}
        />
      )}
    />
  );
};

const SingleProductScreen = () => {
  const route = useRoute();
  const { productId } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const [expandedSection, setExpandedSection] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [bestSellerData, setBestSellerData] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const offersSheetRef = useRef();

  const toggleSection = section => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProductById({ id: productId });
        if (response) {
          setProduct(response);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const allProducts = response?.data?.data;
        if (Array.isArray(allProducts)) {
          const bestSellers = allProducts
            .filter(item => item.isBestSeller && Number(item.salePrice) < 599)
            .map(item => {
              const discountPercent = item.salePrice
                ? Math.round(((item.price - item.salePrice) / item.price) * 100)
                : 0;
              return {
                _id: item._id,
                title: item.title,
                rating: item.ratings?.average || 0,
                price: item.price,
                discount: discountPercent > 0 ? discountPercent + '%' : '0%',
                images: item.images || item.variants?.[0]?.images || [],
                isVeg: item.isVeg || false,
                brandId: item.brandId,
              };
            });
          setBestSellerData(bestSellers);
        }
      } catch (e) {
        console.error('Error fetching products:', e);
      }
    };
    fetchProducts();
  }, []);

  const currentVariant = selectedVariant?._id ? selectedVariant : product;
  const stockToShow = coerceStockNumber(currentVariant);
  const inStockFlag =
    typeof currentVariant?.isInStock === 'boolean'
      ? currentVariant.isInStock
      : null;
  const effectiveInStock = inStockFlag !== null ? inStockFlag : stockToShow > 0;

  const shouldShowWeight = selectedVariant && !selectedVariant.isMain;
  const shownWeight = shouldShowWeight ? currentVariant?.weight : null;

  const displayedImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product?.images || [];

  const inCartItem = cartItems.find(
    item =>
      item.productId === product?._id &&
      item.variantId ===
        (selectedVariant?._id === product?._id ? null : selectedVariant?._id),
  );
  const isInCart = Boolean(inCartItem);

  useEffect(() => {
    if (isInCart) {
      setQuantity(inCartItem.quantity || 1);
    } else {
      setQuantity(1);
    }
  }, [isInCart, inCartItem]);

  const handleAddToCart = async () => {
    if (!effectiveInStock || cartLoading || !product) return;
    setCartLoading(true);
    try {
      const variantId =
        selectedVariant?._id === product._id ? null : selectedVariant?._id;
      const productData = {
        productId: product._id,
        productTitle: product.title,
        variantId,
        price: currentVariant.price,
        salePrice: currentVariant.salePrice,
        images: product.images,
        weight: shownWeight,
        quantity: 1,
        brandName: product.brandId?.name,
      };
      dispatch(addItemToCart(productData));
      await addProductToCart({
        productId: product._id,
        variantId,
        quantity: 1,
      });
    } catch (error) {
      console.warn('Failed to add to cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartQuantity = async newQuantity => {
    if (!isInCart || cartLoading || !product) return;
    setCartLoading(true);
    const variantId =
      selectedVariant?._id === product._id ? null : selectedVariant?._id;
    try {
      await addProductToCart({
        productId: product._id,
        variantId,
        quantity: newQuantity,
      });
      dispatch(
        addItemToCart({
          productId: product._id,
          variantId,
          quantity: newQuantity,
          productTitle: product.title,
          price: currentVariant.price,
          salePrice: currentVariant.salePrice,
          images: product.images,
          weight: shownWeight,
          brandName: product.brandId?.name,
        }),
      );
      setQuantity(newQuantity);
    } catch (err) {
      console.warn('Failed to update cart quantity:', err);
    } finally {
      setCartLoading(false);
    }
  };

  const priceCardsData = (product?.variants || []).map(v => ({
    ...v,
    stock: coerceStockNumber(v),
    packInfo: v.packInfo,
    titleOverride: v.title || undefined,
  }));

  const isAddToCartButtonDisabled = () => {
    if (!effectiveInStock) return true;
    if (cartLoading) return true;
    return false;
  };

  const onScroll = useCallback(event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentImageIndex(index);
  }, []);

  if (loading) return <SingleProductShimmer />;
  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  if (!product)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No product data available</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={1}
          >
            <ArrowLeft size={30} color="#000" />
          </TouchableOpacity>
          <SearchBar style={styles.searchBar} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {displayedImages?.length > 0 && (
          <>
            <FlatList
              horizontal
              data={displayedImages}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              )}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesContainer}
              snapToInterval={screenWidth}
              getItemLayout={(data, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
              initialNumToRender={displayedImages.length}
              onScroll={onScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
            />
            <View style={styles.dotsContainer}>
              {displayedImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex
                      ? styles.activeDot
                      : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </>
        )}

        <View style={styles.pad}>
          <View style={styles.brandRatingRow}>
            <Text style={styles.brand}>{product?.brandId?.name}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.rating}>{'3.0'}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={{ marginTop: 10, marginBottom: 12 }}>
            <PriceCardsRow
              variants={priceCardsData}
              selectedId={selectedVariant?._id}
              onSelect={item => setSelectedVariant(item)}
            />
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.iconLabelRow}>
              <Tag size={20} color="#00A86B" />
              <Text style={styles.labelText}>Offers and coupons</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => offersSheetRef.current.open()}
            >
              <Text style={styles.actionText}>Check offers</Text>
            </TouchableOpacity>
          </View>

          <DeliverySection />

          <View style={{ marginTop: 20, marginBottom: 50 }}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection('productDetails')}
              activeOpacity={1}
            >
              <View style={styles.accordionRow}>
                <Text style={styles.accordionTitle}>Product Details</Text>
                <View>
                  {expandedSection === 'productDetails' ? (
                    <Minus size={20} color="#0B0B0B" />
                  ) : (
                    <Plus size={20} color="#0B0B0B" />
                  )}
                </View>
              </View>
              {expandedSection === 'productDetails' && (
                <Text style={styles.accordionInlineText}>
                  {product?.description || 'No product details available.'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection('additionalInfo')}
              activeOpacity={1}
            >
              <View style={styles.accordionRow}>
                <Text style={styles.accordionTitle}>
                  Additional Information
                </Text>
                <View>
                  {expandedSection === 'additionalInfo' ? (
                    <Minus size={20} color="#0B0B0B" />
                  ) : (
                    <Plus size={20} color="#0B0B0B" />
                  )}
                </View>
              </View>
              {expandedSection === 'additionalInfo' && (
                <View style={{ marginTop: 12 }}>
                  {shouldShowWeight && (
                    <Text style={styles.accordionInlineText}>
                      Weight: {formatWeight(currentVariant.weight)}
                    </Text>
                  )}
                  <Text style={styles.accordionInlineText}>
                    Stock:{' '}
                    {effectiveInStock
                      ? `In Stock (${stockToShow})`
                      : 'Out of Stock'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Banner />

        {bestSellerData.length === 0 ? (
          <ProductSliderShimmer />
        ) : (
          <ProductSlider
            headingIcon={require('../../assets/icons/paw2.png')}
            headingTextOrange="Handpicked"
            headingTextBlue="For You"
            products={bestSellerData}
            navigation={navigation}
          />
        )}
      </ScrollView>

      {product && (
        <View style={styles.stickyPriceBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stickyPriceText}>
              {'₹'}
              {currentVariant.salePrice}
            </Text>
            {currentVariant.price > currentVariant.salePrice && (
              <Text style={styles.stickyStrikePrice}>
                MRP {'₹'}
                {currentVariant.price}
              </Text>
            )}
          </View>

          {cartLoading ? (
            <TouchableOpacity
              style={[
                styles.stickyAddToCartButton,
                { justifyContent: 'center', alignItems: 'center' },
              ]}
              activeOpacity={1}
              disabled
            >
              <Lottie
                source={require('../../lottie/loading.json')}
                autoPlay
                loop
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          ) : !isInCart ? (
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.stickyAddToCartButton,
                isAddToCartButtonDisabled() && styles.disabledButton,
              ]}
              disabled={isAddToCartButtonDisabled()}
              onPress={() => {
                handleAddToCart();
                setQuantity(1);
              }}
            >
              <Text style={styles.stickyAddToCartText}>ADD TO CART</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (quantity > 1) {
                    const newQty = quantity - 1;
                    setQuantity(newQty);
                    updateCartQuantity(newQty);
                  }
                }}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyText}>{quantity}</Text>

              <TouchableOpacity
                onPress={() => {
                  if (quantity < stockToShow) {
                    const newQty = quantity + 1;
                    setQuantity(newQty);
                    updateCartQuantity(newQty);
                  }
                }}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <OffersBottomSheet innerRef={offersSheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: { paddingRight: 15 },
  searchBar: { flex: 1 },
  content: { backgroundColor: '#FFFFFF', paddingTop: 15 },
  pad: { paddingHorizontal: 15 },
  imagesContainer: {},
  productImage: {
    width: screenWidth,
    height: screenWidth * 0.6,
    borderRadius: 10,
  },
  brandRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  brand: {
    fontSize: 14,
    color: '#F48C20',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 16, fontFamily: 'Gotham-Rounded-Medium' },
  star: { fontSize: 18, color: '#f2b01e' },
  title: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    marginVertical: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 25,
  },

  accordionHeader: {
    backgroundColor: '#EBEBEB99',
    padding: 20,
    marginTop: 12,
    borderRadius: 14,
  },
  accordionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#0B0B0B',
  },
  accordionInlineText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
    marginTop: 12,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', padding: 10 },

  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.7,
    borderColor: '#F59A11',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  iconLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  labelText: {
    fontFamily: 'Gotham-Rounded-Medium',
    fontSize: 16,
    color: '#101010',
  },
  actionText: {
    color: '#F48C20',
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    letterSpacing: 0.2,
  },
  listContent: { paddingVertical: 0 },
  cardShadow: {
    marginRight: 10,
    borderRadius: 10,
  },
  cardShadowSelected: { elevation: 5, shadowOpacity: 0.18, shadowRadius: 8 },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#014e6a',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  cardSelected: { borderColor: '#0A7C84' },
  topBand: {
    backgroundColor: '#014e6a',
    paddingVertical: 3,
  },
  topBandText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    textAlign: 'center',
  },
  middleRow: {
    paddingHorizontal: 8,
    paddingTop: 3,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  saleText: {
    fontSize: 14,
    color: '#0B3C45',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  mrpText: {
    fontSize: 10,
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  bottomBand: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bottomBandText: {
    fontSize: 9,
    color: '#258329',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  stickyPriceBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ebebeb',
    paddingHorizontal: 20,
    paddingVertical: 20,
    zIndex: 20,
  },
  stickyPriceText: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  stickyStrikePrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  stickyAddToCartButton: {
    backgroundColor: '#F59A11',
    borderRadius: 12,
    paddingVertical: 14,
    width: '55%',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  stickyAddToCartText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F59A11',
    borderRadius: 8,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 110,
  },
  qtyButton: {
    paddingHorizontal: 40,
    paddingVertical: 2,
  },
  qtyButtonText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F59A11',
  },
  qtyText: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
    minWidth: 15,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F59A11',
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },
});

export default SingleProductScreen;
