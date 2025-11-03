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
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {
  ArrowLeft,
  Minus,
  Plus,
  Tag,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Lock,
  CreditCard,
  FileText,
  Info,
  MessageSquare,
  Star,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../../components/SearchBar/SearchBar';
import DeliverySection from '../../components/DeliverySection/DeliverySection';
import ProductSliderShimmer from '../../ui/Shimmer/ProductSliderShimmer';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import { addItemToCart } from '../../redux/cartSlice';
import { getProducts } from '../../apis/getProducts';
import { getProductById } from '../../apis/getProductById';
import { addProductToCart } from '../../apis/addProductToCart';
import { getReviewsByProductId } from '../../apis/getReviewsByProductId';
import { checkIfUserBoughtProduct } from '../../apis/checkIfUserBoughtProduct';
import { apiService } from '../../apis/apiService';
import Banner from '../../components/Banner/Banner';
import SingleProductShimmer from '../../ui/Shimmer/SingleProductShimmer';
import Lottie from 'lottie-react-native';
import { go } from '../../constants/navigationRef';
import OffersBottomSheet from '../../components/OffersBottomSheet/OffersBottomSheet';
import RenderHtml from 'react-native-render-html';
import ImageView from 'react-native-image-viewing';
import HandPicked from '../../components/HandPicked/HandPicked';
import RecommendedForYou from '../../components/RecommendedForYou/RecommendedForYou';
import WriteReviewBottomSheet from '../../components/WriteReviewBottomSheet/WriteReviewBottomSheet';
import { setReturnRoute } from '../../redux/authSlice';

const { width: screenWidthFull } = Dimensions.get('window');
const screenWidth = screenWidthFull * 0.94;

const getDiscountPercent = (price, salePrice) => {
  if (!price || !salePrice || Number(price) <= Number(salePrice)) return 0;
  return Math.round(
    ((Number(price) - Number(salePrice)) / Number(price)) * 100,
  );
};

const formatWeight = grams => {
  if (!Number.isFinite(Number(grams))) return '';
  const g = Number(grams);
  if (g >= 1000) {
    const kg = g / 1000;
    return kg % 1 === 0 ? `${kg}kg` : `${kg.toFixed(1)}kg`;
  }
  return `${g}g`;
};

const containerMarginHorizontal = 12;
const adjustedSnapInterval = screenWidth + 2 * containerMarginHorizontal;

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
    const topLabel =
      item.titleOverride ||
      item.variantName ||
      item.productLabel ||
      (Number.isFinite(Number(item.weight))
        ? `${formatWeight(item.weight)}`
        : 'Main');

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[styles.cardShadow, isSelected && styles.cardShadowSelected]}
      >
        <View style={[styles.card, isSelected && styles.cardSelected]}>
          <View
            style={[
              styles.topBand,
              isSelected && { backgroundColor: '#014e6a' },
            ]}
          >
            <Text
              style={[styles.topBandText, isSelected && { color: 'white' }]}
            >
              {topLabel}
            </Text>
          </View>

          <View style={styles.middleRow}>
            <Text style={styles.saleText}>₹ {item.salePrice}</Text>
            {Number(item.price) > Number(item.salePrice) && (
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

const ReviewsSection = ({
  reviews,
  totalReviews,
  starCounts,
  userBoughtProduct,
  onWriteReview,
}) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [expandedReviews, setExpandedReviews] = useState({});

  const averageRating =
    totalReviews > 0
      ? (
          (starCounts.five * 5 +
            starCounts.four * 4 +
            starCounts.three * 3 +
            starCounts.two * 2 +
            starCounts.one * 1) /
          totalReviews
        ).toFixed(1)
      : '0.0';

  const getBarWidth = count => {
    if (totalReviews === 0) return '0%';
    return `${(count / totalReviews) * 100}%`;
  };

  const StarBar = ({ stars, count }) => (
    <View style={styles.starBarRow}>
      <Text style={styles.starNumber}>{stars}</Text>
      <Star size={16} color="#FBB040" fill="#FBB040" />
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: getBarWidth(count) }]} />
      </View>
      <Text style={styles.starCount}>{count}</Text>
    </View>
  );

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-IN', { month: 'numeric' });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getInitial = name => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const toggleExpand = reviewId => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 3);
  };

  const displayedReviews = reviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < reviews.length;

  return (
    <View>
      <View style={styles.reviewsSummary}>
        <View style={styles.ratingBox}>
          <Text style={styles.bigRating}>{averageRating}</Text>
          <Star size={32} color="#FBB040" fill="#FBB040" />
          <Text style={styles.ratingsCount}>{totalReviews} Reviews</Text>
        </View>

        <View style={styles.barsContainer}>
          <StarBar stars={5} count={starCounts.five} />
          <StarBar stars={4} count={starCounts.four} />
          <StarBar stars={3} count={starCounts.three} />
          <StarBar stars={2} count={starCounts.two} />
          <StarBar stars={1} count={starCounts.one} />
        </View>
      </View>

      {userBoughtProduct && (
        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={onWriteReview}
          activeOpacity={0.8}
        >
          <MessageSquare size={18} color="#FFFFFF" />
          <Text style={styles.writeReviewButtonText}>Write a Review</Text>
        </TouchableOpacity>
      )}

      {reviews && reviews.length > 0 ? (
        <View style={styles.reviewsList}>
          {displayedReviews.map(review => {
            const isExpanded = expandedReviews[review._id];
            const reviewText = review.review || '';
            const shouldShowReadMore = reviewText.length > 100;
            const displayText =
              isExpanded || !shouldShowReadMore
                ? reviewText
                : reviewText.substring(0, 100) + '...';

            return (
              <View key={review._id} style={styles.reviewCard}>
                <View style={styles.reviewHeaderRow}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {getInitial(review.userId?.name)}
                    </Text>
                  </View>
                  <View style={styles.reviewMainContent}>
                    <View style={styles.nameLocationRow}>
                      <Text style={styles.reviewerName}>
                        {review.userId?.name || 'Anonymous'}
                      </Text>
                      {review.orderId?.address && (
                        <Text style={styles.reviewLocation}>
                          ({review.orderId.address.city},{' '}
                          {review.orderId.address.state})
                        </Text>
                      )}
                    </View>
                    <View style={styles.starsDateRow}>
                      <View style={styles.reviewRatingRow}>
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            size={16}
                            color="#FBB040"
                            fill={index < review.rating ? '#FBB040' : 'none'}
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>{displayText}</Text>
                {shouldShowReadMore && (
                  <TouchableOpacity
                    onPress={() => toggleExpand(review._id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.readMoreText}>
                      {isExpanded ? 'Read Less' : 'Read More'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {hasMoreReviews && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadMoreReviews}
              activeOpacity={0.8}
            >
              <Text style={styles.loadMoreText}>Load More Reviews</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.noReviewsContainer}>
          <Text style={styles.noReviewsText}>No reviews yet.</Text>
          <Text style={styles.noReviewsSubtext}>
            Be the first to review this product!
          </Text>
        </View>
      )}
    </View>
  );
};

const SingleProductScreen = ({ navigation }) => {
  const route = useRoute();
  const { productId } = route.params;

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const isLoggedIn = useSelector(state => !!state.auth.user);

  const [expandedSection, setExpandedSection] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsData, setReviewsData] = useState({
    totalReviews: 0,
    totalFiveStar: 0,
    totalFourStar: 0,
    totalThreeStar: 0,
    totalTwoStar: 0,
    totalOneStar: 0,
  });

  const [userBoughtProduct, setUserBoughtProduct] = useState(false);
  const reviewBottomSheetRef = useRef(null);

  const [cartLoading, setCartLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const offersSheetRef = useRef(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const toggleSection = section => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await getProductById({ id: productId });
        if (response) {
          const productWithCommonImages = {
            ...response,
            images: [
              ...(response.images || []),
              ...(response.commonImages || []),
            ],
            variants: (response.variants || []).map(variant => ({
              ...variant,
              images: [
                ...(variant.images || []),
                ...(response.commonImages || []),
              ],
            })),
          };
          setProduct(productWithCommonImages);
        }
      } catch (e) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByProductId({ id: productId });
        const reviewData =
          response?.response?.data || response?.data || response;

        if (reviewData) {
          setReviews(reviewData.reviews || []);
          setReviewsData({
            totalReviews: reviewData.totalReviews || 0,
            totalFiveStar: reviewData.totalFiveStar || 0,
            totalFourStar: reviewData.totalFourStar || 0,
            totalThreeStar: reviewData.totalThreeStar || 0,
            totalTwoStar: reviewData.totalTwoStar || 0,
            totalOneStar: reviewData.totalOneStar || 0,
          });
        }
      } catch (e) {
        console.log('Failed to fetch reviews', e);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  useEffect(() => {
    const checkUserPurchase = async () => {
      if (!isLoggedIn || !productId) return;
      try {
        const response = await checkIfUserBoughtProduct(productId);
        if (response?.success && response?.data) {
          setUserBoughtProduct(true);
        }
      } catch (error) {
        console.log('Error checking purchase:', error);
        setUserBoughtProduct(false);
      }
    };
    checkUserPurchase();
  }, [productId, isLoggedIn]);

  const handleSubmitReview = async reviewData => {
    try {
      const response = await apiService({
        endpoint: 'api/reviews',
        method: 'POST',
        data: reviewData,
      });

      const responseData = response?.response || response;

      if (responseData?.success) {
        const updatedReviews = await getReviewsByProductId({ id: productId });
        const newReviewData =
          updatedReviews?.response?.data || updatedReviews?.data;
        if (newReviewData) {
          setReviews(newReviewData.reviews || []);
          setReviewsData({
            totalReviews: newReviewData.totalReviews || 0,
            totalFiveStar: newReviewData.totalFiveStar || 0,
            totalFourStar: newReviewData.totalFourStar || 0,
            totalThreeStar: newReviewData.totalThreeStar || 0,
            totalTwoStar: newReviewData.totalTwoStar || 0,
            totalOneStar: newReviewData.totalOneStar || 0,
          });
        }

        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.log('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
      throw error;
    }
  };

  const goToCart = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Cart');
      return;
    }
    go('BottomTabs', { screen: 'Cart' });
  };

  useEffect(() => {
    if (product && !selectedVariant) {
      setSelectedVariant({ ...product, isMain: true, _id: product._id });
    }
  }, [product, selectedVariant]);

  const currentVariant = selectedVariant?._id ? selectedVariant : product;

  const currentVariantId = selectedVariant?.isMain
    ? null
    : selectedVariant?._id === product?._id
    ? null
    : selectedVariant?._id || null;

  const stockToShow = coerceStockNumber(currentVariant || {});
  const inStockFlag =
    typeof currentVariant?.isInStock === 'boolean'
      ? currentVariant.isInStock
      : null;
  const effectiveInStock = inStockFlag !== null ? inStockFlag : stockToShow > 0;

  const shouldShowWeight = selectedVariant && !selectedVariant.isMain;
  const shownWeight = shouldShowWeight
    ? currentVariant?.weight
    : product?.weight;

  const displayedImages =
    selectedVariant?.images?.length > 0
      ? selectedVariant.images
      : product?.images?.length
      ? product.images
      : product?.commonImages || [];

  const viewerImages = (displayedImages || []).map(uri => ({ uri }));

  const openViewerAt = useCallback(index => {
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  const inCartItem = useSelector(state =>
    state.cart.items.find(
      item =>
        item.productId === product?._id && item.variantId === currentVariantId,
    ),
  );
  const isInCart = Boolean(inCartItem);

  useEffect(() => {
    if (isInCart) {
      setQuantity(inCartItem?.quantity || 1);
    } else {
      setQuantity(1);
    }
  }, [isInCart, inCartItem]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      dispatch(
        setReturnRoute({
          routeName: 'SingleProductScreen',
          params: { productId },
        }),
      );
      navigation.replace('LoginScreen');
      return;
    }

    if (!effectiveInStock || cartLoading || !product) return;

    setCartLoading(true);
    try {
      const productData = {
        productId: product._id,
        productTitle: product.title,
        variantId: currentVariantId,
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
        variantId: currentVariantId,
        quantity: 1,
      });

      setQuantity(1);
      goToCart();
    } catch (error) {
      // handle error
    } finally {
      setCartLoading(false);
    }
  };

  const mainProductCard = product
    ? {
        _id: product._id,
        isMain: true,
        productLabel: product.productLabel,
        variantName: product.productLabel,
        price: product.price,
        salePrice: product.salePrice,
        weight: product.weight,
        images: product.images?.length
          ? product.images
          : product.commonImages || [],
        stock: coerceStockNumber(product),
        titleOverride:
          product.productLabel ||
          (Number.isFinite(Number(product.weight))
            ? formatWeight(product.weight)
            : 'Main'),
      }
    : null;

  const priceCardsData = [
    ...(mainProductCard ? [mainProductCard] : []),
    ...((product?.variants || []).map(v => ({
      ...v,
      stock: coerceStockNumber(v),
      packInfo: v.packInfo,
      titleOverride: v.variantName || v.title || undefined,
      isMain: false,
    })) || []),
  ];

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

  const navigateToBrandListing = () => {
    const brandSlug = product?.brandId?.slug || product?.brandId?.name || '';
    navigation.navigate('ProductListScreen', {
      categorySlug: null,
      collectionSlug: null,
      collectionName: product?.brandId?.name || 'Brand',
      searchQuery: '',
      brandSlug,
    });
  };

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
    <>
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
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => openViewerAt(index)}
                    style={[
                      styles.shadowBox,
                      { marginHorizontal: containerMarginHorizontal },
                    ]}
                  >
                    <Image
                      source={{ uri: item }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={item => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imagesContainer}
                snapToInterval={adjustedSnapInterval}
                getItemLayout={(data, index) => ({
                  length: adjustedSnapInterval,
                  offset: adjustedSnapInterval * index,
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

          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <ShieldCheck size={20} color="#00A86B" />
              <Text style={styles.featureText}>100% Authentic</Text>
            </View>
            <View style={styles.featureCard}>
              <Truck size={20} color="#F59A11" />
              <Text style={styles.featureText}>Fast Delivery</Text>
            </View>
            <View style={styles.featureCard}>
              <Lock size={20} color="#3C63E9" />
              <Text style={styles.featureText}>Secure Checkout</Text>
            </View>
            <View style={styles.featureCard}>
              <CreditCard size={20} color="#9B00E8" />
              <Text style={styles.featureText}>Multiple Payments</Text>
            </View>
          </View>

          <View style={styles.pad}>
            <View style={styles.brandRatingRow}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={navigateToBrandListing}
              >
                <Text style={styles.brand}>{product?.brandId?.name}</Text>
              </TouchableOpacity>
              <View style={styles.ratingRow}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.rating}>
                  {reviewsData.totalReviews > 0
                    ? (
                        (reviewsData.totalFiveStar * 5 +
                          reviewsData.totalFourStar * 4 +
                          reviewsData.totalThreeStar * 3 +
                          reviewsData.totalTwoStar * 2 +
                          reviewsData.totalOneStar * 1) /
                        reviewsData.totalReviews
                      ).toFixed(1)
                    : '0.0'}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{product.title}</Text>

            <View style={{ marginTop: 10, marginBottom: 12 }}>
              <PriceCardsRow
                variants={priceCardsData}
                selectedId={selectedVariant?._id}
                onSelect={item =>
                  setSelectedVariant(
                    item || { ...product, isMain: true, _id: product._id },
                  )
                }
              />
            </View>

            <View style={styles.cardContainer}>
              <View style={styles.iconLabelRow}>
                <Tag size={20} color="#00A86B" />
                <Text style={styles.labelText}>Offers and coupons</Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => offersSheetRef.current?.present?.()}
              >
                <Text style={styles.actionText}>Check offers</Text>
              </TouchableOpacity>
            </View>

            <DeliverySection />

            <View style={styles.accordionContainer}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleSection('productDetails')}
                activeOpacity={1}
              >
                <View style={styles.accordionRow}>
                  <FileText size={20} color="#0B0B0B" />
                  <Text style={styles.accordionTitle}>Product Details</Text>
                  <View style={styles.chevronCircle}>
                    {expandedSection === 'productDetails' ? (
                      <Minus size={18} color="#222" />
                    ) : (
                      <Plus size={18} color="#222" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {expandedSection === 'productDetails' && (
                <View style={styles.accordionBody}>
                  {product.description ? (
                    <RenderHtml
                      source={{ html: product.description }}
                      contentWidth={screenWidth}
                      baseStyle={styles.accordionInlineText}
                      tagsStyles={{
                        b: { fontWeight: 'bold', color: '#101010' },
                        strong: { fontWeight: 'bold', color: '#101010' },
                        li: { marginBottom: 6 },
                        ul: { marginLeft: 18 },
                      }}
                    />
                  ) : (
                    <Text style={styles.accordionInlineText}>
                      No product details available.
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleSection('additionalInfo')}
                activeOpacity={1}
              >
                <View style={styles.accordionRow}>
                  <Info size={20} color="#0B0B0B" />
                  <Text style={styles.accordionTitle}>
                    Additional Information
                  </Text>
                  <View style={styles.chevronCircle}>
                    {expandedSection === 'additionalInfo' ? (
                      <Minus size={18} color="#222" />
                    ) : (
                      <Plus size={18} color="#222" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {expandedSection === 'additionalInfo' && (
                <View style={styles.accordionBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Product name:</Text>
                    <Text style={styles.infoValue}>{product.title}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>product Type:</Text>
                    <Text style={styles.infoValue}>
                      {product.productType || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>brand:</Text>
                    <Text style={styles.infoValue}>
                      {product.brandId?.name || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>net Weight:</Text>
                    <Text style={styles.infoValue}>
                      {selectedVariant && !selectedVariant.isMain
                        ? formatWeight(currentVariant?.weight)
                        : formatWeight(product?.weight)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                      imported And Marketed By:
                    </Text>
                    <Text style={styles.infoValue}>
                      {product.importedBy || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>origin:</Text>
                    <Text style={styles.infoValue}>
                      {product.countryOfOrigin || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>price:</Text>
                    <Text style={styles.infoValue}>
                      ₹{currentVariant?.salePrice}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>platform:</Text>
                    <Text style={styles.infoValue}>
                      {product.platform || 'PetCaart'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>sub Category:</Text>

                    <Text style={styles.infoValue}>
                      {product.subCategoryId?.name || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>category:</Text>
                    <Text style={styles.infoValue}>
                      {product.categoryId?.name || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.disclaimerBox}>
                    <Text style={styles.disclaimerText}>
                      All Images are for representation purpose only, You are
                      advised to read the batch details, manufacturer details
                      and other information mentioned on the packet or website
                      at the time of receiving the products
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleSection('reviews')}
                activeOpacity={1}
              >
                <View style={styles.accordionRow}>
                  <MessageSquare size={20} color="#0B0B0B" />
                  <Text style={styles.accordionTitle}>Reviews</Text>
                  <View style={styles.chevronCircle}>
                    {expandedSection === 'reviews' ? (
                      <Minus size={18} color="#222" />
                    ) : (
                      <Plus size={18} color="#222" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {expandedSection === 'reviews' && (
                <View style={styles.accordionBody}>
                  <ReviewsSection
                    reviews={reviews}
                    totalReviews={reviewsData.totalReviews}
                    starCounts={{
                      five: reviewsData.totalFiveStar,
                      four: reviewsData.totalFourStar,
                      three: reviewsData.totalThreeStar,
                      two: reviewsData.totalTwoStar,
                      one: reviewsData.totalOneStar,
                    }}
                    userBoughtProduct={userBoughtProduct}
                    onWriteReview={() => {
                      reviewBottomSheetRef.current?.present();
                    }}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={{ paddingHorizontal: 10 }}>
            <RecommendedForYou
              headingIcon={require('../../assets/icons/paw2.png')}
              productId={productId}
              type="similar"
            />
          </View>
          <Banner />

          <View style={{ paddingHorizontal: 10 }}>
            <HandPicked
              headingIcon={require('../../assets/icons/paw2.png')}
              productId={productId}
              type="related"
            />
          </View>
        </ScrollView>

        {product && (
          <View style={styles.stickyPriceBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stickyPriceText}>
                ₹{currentVariant?.salePrice}
              </Text>
              {Number(currentVariant?.price) >
                Number(currentVariant?.salePrice) && (
                <Text style={styles.stickyStrikePrice}>
                  MRP ₹{currentVariant?.price}
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
                  style={{ width: 26, height: 26 }}
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
                onPress={handleAddToCart}
              >
                <Text style={styles.stickyAddToCartText}>ADD TO CART</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                style={styles.goToCartButton}
                onPress={goToCart}
              >
                <ShoppingCart size={20} color="#fff" />
                <Text style={styles.goToCartText}>Go to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <ImageView
        images={viewerImages}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        presentationStyle="overFullScreen"
        onImageIndexChange={setViewerIndex}
        backgroundColor="#FFFFFF"
      />

      <OffersBottomSheet innerRef={offersSheetRef} />

      <WriteReviewBottomSheet
        innerRef={reviewBottomSheetRef}
        onSubmit={handleSubmitReview}
        productId={productId}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 54,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: { paddingRight: 15 },
  searchBar: { flex: 1 },
  content: { backgroundColor: '#FFFFFF', paddingTop: 5 },
  pad: { paddingHorizontal: 15 },
  imagesContainer: {},
  productImage: {
    width: screenWidth,
    height: screenWidth,
    borderRadius: 10,
  },
  brandRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  accordionContainer: {
    marginVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  accordionHeader: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
    backgroundColor: '#fff',
  },
  accordionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    paddingLeft: 14,
    color: '#151515',
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: '#ededed',
    borderWidth: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionBody: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    borderColor: '#FBB040',
    borderWidth: 0.6,
    backgroundColor: '#FAFAFA',
  },

  // Naye styles add karo:
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#0B0B0B',
    flex: 0.4,
    textTransform: 'capitalize',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#555555',
    flex: 0.6,
    lineHeight: 20,
  },
  disclaimerBox: {
    marginTop: 10,
    paddingTop: 10,
  },
  disclaimerText: {
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#666666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  accordionInlineText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 25,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', padding: 10 },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
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
  cardShadow: { marginRight: 10, borderRadius: 10 },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a6a6a6',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  cardSelected: { borderColor: '#014e6a', borderWidth: 1.5 },
  topBand: { backgroundColor: '#F6F6F6', paddingVertical: 3 },
  topBandText: {
    color: '#000000',
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
    color: '#000000',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  mrpText: {
    fontSize: 10,
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  bottomBand: { paddingHorizontal: 12, alignItems: 'center' },
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
    width: '50%',
  },
  disabledButton: { backgroundColor: '#cccccc' },
  stickyAddToCartText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  goToCartButton: {
    backgroundColor: '#F59A11',
    borderRadius: 12,
    paddingVertical: 14,
    width: '55%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  goToCartText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { backgroundColor: '#F59A11' },
  inactiveDot: { backgroundColor: '#CCCCCC' },
  shadowBox: {
    ...Platform.select({
      ios: {
        shadowColor: '#4040400D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
    backgroundColor: 'white',
    marginHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    borderWidth: 0.1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#222',
  },
  reviewsSummary: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  ratingBox: {
    width: 130,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FBB040',
  },
  bigRating: {
    fontSize: 40,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
  },
  ratingsCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  barsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  starBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  starNumber: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
    width: 12,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#FBB040',
    borderRadius: 4,
  },
  starCount: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#666',
    width: 20,
    textAlign: 'right',
  },
  writeReviewButton: {
    backgroundColor: '#F59A11',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  writeReviewButtonText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  reviewsList: {
    marginTop: 10,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
  },
  reviewMainContent: {
    flex: 1,
  },
  nameLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
    marginRight: 6,
  },
  reviewLocation: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  starsDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewRatingRow: {
    flexDirection: 'row',
    gap: 3,
  },
  reviewDate: {
    fontSize: 13,
    color: '#999',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  reviewText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: '#F48C20',
    fontFamily: 'Gotham-Rounded-Bold',
    marginTop: 4,
  },
  loadMoreButton: {
    backgroundColor: '#F59A11',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  loadMoreText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noReviewsText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#666',
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#999',
  },
});

export default SingleProductScreen;
