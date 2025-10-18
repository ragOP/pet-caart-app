// components/HandPicked/HandPicked.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import ProductCard from '../ProductCard/ProductCard';
import { getRecommendations } from '../../apis/getRecommendations';
import ProductSliderShimmer from '../../ui/Shimmer/ProductSliderShimmer';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3) / 2;

const toArray = x => (Array.isArray(x) ? x : x ? [x] : []);

const mapProduct = item => {
  const price = Number(item?.price) || 0;
  const salePrice = Number(item?.salePrice) || 0;
  const discountPercent =
    price > 0 && salePrice > 0
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  const variants = Array.isArray(item?.variants) ? item.variants : [];
  const activeVariant = variants.find(v => v?.isActive) || variants[0] || null;

  // Only use primary images; if not present, fallback to active variant images
  const imagesPrimary = toArray(item?.images); // may be a single string
  const imagesVariant = toArray(activeVariant?.images);
  const images = imagesPrimary.length ? imagesPrimary : imagesVariant;

  return {
    _id: item?._id || item?.id || '',
    title: item?.title || '',
    rating: item?.ratings?.average || 0,
    price,
    salePrice: salePrice || null,
    discount: discountPercent > 0 ? `${discountPercent}%` : '0%',
    images,
    isVeg: !!item?.isVeg,
    stock: item?.stock,
    brandId: item?.brandId,
    variants,
    isBestSeller: !!item?.isBestSeller,
    variantId: activeVariant?._id || activeVariant?.id || null,
  };
};
const HandPicked = ({ productId, type = 'related', headingIcon }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      if (!productId) {
        setItems([]);
        setErr('Missing productId');
        return;
      }
      const res = await getRecommendations({ productId, type });
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      const mapped = list.map(mapProduct);
      setItems(mapped);
    } catch (e) {
      console.error('Error fetching recommendations:', e);
      setErr('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [productId, type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const headingNode = useMemo(
    () => (
      <View style={styles.headingContainer}>
        {headingIcon ? (
          <Image
            source={headingIcon}
            style={styles.iconImage}
            resizeMode="contain"
          />
        ) : null}
        <Text style={styles.headingText}>
          <Text style={styles.orange}>Hand </Text>
          <Text style={styles.blue}>Picked For You</Text>
        </Text>
      </View>
    ),
    [headingIcon],
  );

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       {headingNode}
  //       <View style={styles.loaderWrap}>
  //         <ActivityIndicator size="small" color="#3498db" />
  //         <Text style={styles.loaderText}>Loading recommendations…</Text>
  //       </View>
  //     </View>
  //   );
  // }

  if (err) {
    return (
      <View style={styles.container}>
        {headingNode}
        <Text style={styles.errorText}>{err}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {headingNode}
      {items?.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {items.map((item, index) => (
            <View
              key={`${item._id || 'item'}_${index}`}
              style={[styles.cardWrapper, { width: CARD_WIDTH }]}
            >
              <ProductCard
                images={item.images}
                title={item.title}
                rating={item.rating}
                price={item.price}
                salePrice={item.salePrice}
                discount={item.discount}
                isVeg={item.isVeg}
                stock={item.stock}
                brandId={item.brandId}
                cardWidth={CARD_WIDTH}
                productId={item._id}
                variantId={item.variantId}
                variants={item.variants}
                isBestSeller={item.isBestSeller}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <ProductSliderShimmer horizontal cardWidth={CARD_WIDTH} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 4,
    paddingBottom: 5,
  },
  headingText: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  orange: {
    color: '#f39c12',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  blue: {
    color: '#3498db',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  scrollContent: {},
  cardWrapper: {
    marginRight: 12,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#555',
  },
  loaderWrap: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 6,
    color: '#666',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  errorText: {
    color: 'red',
    paddingVertical: 10,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: 'white',
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default HandPicked;
