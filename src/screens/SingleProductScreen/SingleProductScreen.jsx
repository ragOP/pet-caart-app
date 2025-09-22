import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ArrowLeft, Minus, Plus, Tag } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeliverySection from '../../components/DeliverySection/DeliverySection';
import ProductSliderShimmer from '../../ui/Shimmer/ProductSliderShimmer';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import { addItemToCart } from '../../redux/cartSlice';
import { getProducts } from '../../apis/getProducts';
import { getProductById } from '../../apis/getProductById';
import OffersBottomSheet from '../../components/OffersBottomSheet/OffersBottomSheet';
import Banner from '../../components/Banner/Banner';
import SingleProductShimmer from '../../ui/Shimmer/SingleProductShimmer';

const { width: screenWidth } = Dimensions.get('window');
const getDiscountPercent = (price, salePrice) => {
  if (!price || !salePrice || price <= salePrice) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

const SingleProductScreen = ({ navigation, dispatch }) => {
  const route = useRoute();
  const { productId } = route.params;
  const [expandedSection, setExpandedSection] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [bestSellerData, setBestSellerData] = useState([]);
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
    if (productId) {
      fetchProductDetails();
    }
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
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (stockToShow <= 0) return;
    const productData = {
      productId: currentVariant._id || product._id,
      productTitle: product.title,
      price: currentVariant.price,
      salePrice: currentVariant.salePrice,
      images: product.images,
      weight: shownWeight,
      quantity: 1,
      brandName: product.brandId?.name,
      variantId: currentVariant._id === product._id ? null : currentVariant._id,
    };
    dispatch(addItemToCart(productData));
  };

  if (loading) {
    return <SingleProductShimmer />;
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No product data available</Text>
      </View>
    );
  }

  const currentVariant = selectedVariant || product;
  const shouldShowWeight = selectedVariant && !selectedVariant.isMain;
  const shownWeight = shouldShowWeight ? currentVariant?.weight : null;
  const stockToShow = currentVariant?.stock || 0;

  const Chip = ({ variant, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, isSelected && styles.selectedChip]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
        {variant.weight}g |{' '}
        {getDiscountPercent(variant.price, variant.salePrice)}% OFF
      </Text>
    </TouchableOpacity>
  );

  const renderVariantChips = (variants = []) => {
    if (!variants || variants.length === 0) return null;
    return variants.map(variant => (
      <Chip
        key={variant._id}
        variant={variant}
        isSelected={selectedVariant?._id === variant._id}
        onPress={() => {
          setSelectedVariant(
            selectedVariant?._id === variant._id ? null : variant,
          );
        }}
      />
    ));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
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
        {product.images && (
          <FlatList
            horizontal
            data={product.images}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.productImage}
                resizeMode="contain"
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imagesContainer}
            snapToInterval={screenWidth}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
          />
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
          <View style={styles.chipContainerRow}>
            <Image
              source={require('../../assets/images/variant.png')}
              style={styles.leftSideIcon}
              resizeMode="contain"
            />
            <View style={styles.chipWrap}>
              {renderVariantChips(product.variants)}
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.iconLabelRow}>
              <Tag size={20} color="#00A86B" />
              <Text style={styles.labelText}>Offers and coupons</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => offersSheetRef.current.open()}
            >
              <Text style={styles.actionText}>Check offers {'>'}</Text>
            </TouchableOpacity>
          </View>
          <DeliverySection />
          <View style={{ marginTop: 20, marginBottom: 50 }}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection('productDetails')}
              activeOpacity={0.9}
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
              activeOpacity={0.9}
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
                <View>
                  {shownWeight != null && (
                    <Text style={styles.accordionInlineText}>
                      Weight: {shownWeight}g
                    </Text>
                  )}
                  <Text style={styles.accordionInlineText}>
                    Stock:{' '}
                    {stockToShow > 0
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
          />
        )}
      </ScrollView>
      {product && (
        <View style={styles.stickyPriceBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stickyPriceText}>
              ₹{currentVariant.salePrice}
            </Text>
            {currentVariant.price > currentVariant.salePrice && (
              <Text style={styles.stickyStrikePrice}>
                MRP ₹{currentVariant.price}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.stickyAddToCartButton,
              stockToShow === 0 && styles.disabledButton,
            ]}
            onPress={handleAddToCart}
            disabled={stockToShow === 0}
          >
            <Text style={styles.stickyAddToCartText}>
              {stockToShow === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </Text>
          </TouchableOpacity>
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
  backButton: {
    paddingRight: 15,
  },
  searchBar: {
    flex: 1,
  },
  content: {
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
  },
  pad: {
    paddingHorizontal: 15,
  },
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
    color: '#007bff',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  star: {
    fontSize: 18,
    color: '#f2b01e',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    marginVertical: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 25,
  },
  chipContainerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 12,
  },
  leftSideIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
    marginTop: 3,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    backgroundColor: '#6A68681A',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 15,
    color: '#161616',
    fontFamily: 'Gotham-Rounded-Medium',
    fontWeight: '500',
  },
  selectedChip: {
    backgroundColor: '#004E6A66',
  },
  selectedChipText: {
    color: '#161616',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    padding: 10,
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
    backgroundColor: '#0888B1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 34,
    marginLeft: 15,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  stickyAddToCartText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    letterSpacing: 1.2,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ededed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelText: {
    fontFamily: 'Gotham-Rounded-Medium',
    fontSize: 16,
    color: '#101010',
    marginLeft: 10,
  },
  actionText: {
    color: '#F48C20',
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    letterSpacing: 0.2,
  },
});

export default SingleProductScreen;
