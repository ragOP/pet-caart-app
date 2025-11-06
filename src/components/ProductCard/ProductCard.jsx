import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../apis/addProductToCart';
import { getCart } from '../../apis/getCart';
import { addItemToCart, removeItemFromCart } from '../../redux/cartSlice';
import Lottie from 'lottie-react-native';

const useScreenSize = () => {
  const [dims, setDims] = useState(Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) =>
      setDims(window),
    );
    return () => sub?.remove?.();
  }, []);
  return dims;
};

const getBP = (w, h) => {
  const short = Math.min(w, h);
  return {
    xs: short < 360,
    sm: short >= 360 && short < 400,
    md: short >= 400 && short < 480,
    lg: short >= 480,
    tablet: w >= 768,
  };
};

const getCardHeight = (w, h, tablet) => {
  const { xs, sm, md, lg } = getBP(w, h);
  if (tablet) return Math.round(h * 0.33);
  if (xs) return Math.round(h * 0.37);
  if (sm) return Math.round(h * 0.38);
  if (md) return Math.round(h * 0.44);
  if (lg) return Math.round(h * 0.41);
  return Math.round(h * 0.46);
};

const pct = (n, base) => Math.round(base * n);

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
  cardWidth,
  brandId,
  isBestSeller,
  productId,
  variants = [],
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.items);
  const isLoggedIn = useSelector(s => !!s.auth.user);
  const { width: W, height: H } = useScreenSize();
  const BP = useMemo(() => getBP(W, H), [W, H]);
  const CARD_HEIGHT = useMemo(
    () => getCardHeight(W, H, BP.tablet),
    [W, H, BP.tablet],
  );

  const computedCardWidth = useMemo(() => {
    if (BP.tablet && W >= 820) return Math.round(W * 0.22);
    if (BP.lg && W >= 820) return Math.round(W * 0.28);
    if (BP.md && W >= 700) return Math.round(W * 0.32);
    return Math.round(W * 0.46);
  }, [BP, W]);

  const widthToUse = cardWidth ?? computedCardWidth;

  const imageH = useMemo(() => {
    if (BP.tablet) return pct(0.48, CARD_HEIGHT);
    if (BP.xs) return pct(0.4, CARD_HEIGHT);
    if (BP.sm) return pct(0.45, CARD_HEIGHT);
    return pct(0.5, CARD_HEIGHT);
  }, [BP, CARD_HEIGHT]);

  const stepperH = BP.tablet ? 40 : BP.xs ? 30 : BP.sm ? 32 : 36;
  const reserveBottom = stepperH + (BP.tablet ? 12 : BP.xs ? 10 : 14);

  const VAR_CARD_H = BP.tablet ? 50 : BP.xs ? 32 : BP.sm ? 40 : 44;
  const VAR_GAP = BP.tablet ? 8 : BP.xs ? 4 : 6;

  const fs = {
    title: BP.tablet ? 15 : BP.xs ? 12.5 : BP.sm ? 13 : 14,
    titleLH: BP.tablet ? 19 : BP.xs ? 15.5 : BP.sm ? 16.5 : 18,
    price: BP.tablet ? 16 : BP.xs ? 13.5 : BP.sm ? 14 : 15,
    brand: BP.tablet ? 14 : BP.xs ? 11.5 : BP.sm ? 12 : 13,
    badge: BP.tablet ? 11 : BP.xs ? 10 : 11,
  };

  const [loading, setLoading] = useState(false);

  const originalPrice = Number(price);
  const discountPercent = parseInt(discount);
  const hasDiscount = !isNaN(discountPercent) && discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  const isOutOfStock = stock <= 0;

  const currentQty = useMemo(() => {
    const found = cartItems.find(
      it => it.productId === productId && it.variantId == null,
    );
    return found?.quantity ?? 0;
  }, [cartItems, productId]);

  const buildCartItem = useCallback(
    qty => ({
      productId,
      variantId: null,
      quantity: qty,
      title,
      price: discountedPrice,
      image: images?.[0] ?? '',
      discount: hasDiscount ? `${discountPercent}%` : '0%',
    }),
    [productId, title, discountedPrice, images, hasDiscount, discountPercent],
  );

  const syncServerQty = useCallback(
    async absQty => {
      await addProductToCart({ productId, variantId: null, quantity: absQty });
    },
    [productId],
  );

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        await getCart({ params: {} });
      } catch {}
    };
    if (isLoggedIn) fetchCartData();
  }, [isLoggedIn]);

  const handleIncrement = async () => {
    if (loading || isOutOfStock) return;
    if (!isLoggedIn) {
      navigation.navigate('LoginScreen', {
        returnScreen: 'SingleProductScreen',
        productId,
      });
      return;
    }
    const newQty = currentQty + 1;
    setLoading(true);
    try {
      dispatch(addItemToCart(buildCartItem(1)));
      await syncServerQty(newQty);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (loading || isOutOfStock || currentQty <= 0) return;
    const newQty = currentQty - 1;
    setLoading(true);
    try {
      if (newQty === 0) {
        dispatch(removeItemFromCart({ productId, variantId: null }));
        await syncServerQty(0);
      } else {
        dispatch(addItemToCart({ ...buildCartItem(-1) }));
        await syncServerQty(newQty);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const hasVariants = normalizedVariants && normalizedVariants.length > 0;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.card, { width: widthToUse, height: CARD_HEIGHT }]}
      onPress={() => navigation.navigate('SingleProductScreen', { productId })}
    >
      <View style={[styles.cardInner, { paddingBottom: reserveBottom }]}>
        <View
          style={[
            styles.imageSection,
            {
              height: imageH,
              paddingVertical: BP.tablet ? 5 : 3,
              paddingHorizontal: 0,
            },
          ]}
        >
          {isBestSeller && (
            <LinearGradient
              colors={['#1C83A8', '#48BDE6', '#2F90B3', '#13789DE6']}
              style={[
                styles.bestsellerContainer,
                { height: BP.tablet ? 24 : BP.xs ? 20 : 22 },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.bestsellerText, { fontSize: fs.badge }]}>
                BESTSELLER
              </Text>
            </LinearGradient>
          )}
          <Swiper
            style={styles.swiper}
            autoplay={false}
            loop={false}
            showsPagination
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
          >
            {images?.length ? (
              images.map((src, i) => (
                <Image
                  key={i}
                  source={{ uri: src }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ))
            ) : (
              <Text>No images available</Text>
            )}
          </Swiper>
        </View>

        {hasVariants && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.vRow,
              { paddingVertical: BP.tablet ? 6 : BP.xs ? 2 : 4 },
            ]}
            snapToAlignment="start"
            decelerationRate="fast"
          >
            {normalizedVariants.map((v, index) => (
              <Pressable
                key={v._id}
                style={[
                  styles.vCard,
                  {
                    height: VAR_CARD_H,
                    marginRight:
                      index < normalizedVariants.length - 1 ? VAR_GAP : 0,
                  },
                ]}
              >
                <View
                  style={[
                    styles.vHead,
                    { height: BP.tablet ? 13.5 : BP.xs ? 11 : 12.5 },
                  ]}
                >
                  <Text
                    style={[
                      styles.vHeadTxt,
                      { fontSize: BP.tablet ? 9 : BP.xs ? 7.5 : 8 },
                    ]}
                  >
                    {v.variantName}
                  </Text>
                </View>
                <View
                  style={[
                    styles.vBody,
                    { paddingBottom: BP.tablet ? 8 : BP.xs ? 4 : 6 },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={[
                        styles.vSale,
                        { fontSize: BP.tablet ? 11 : BP.xs ? 9 : 10 },
                      ]}
                    >{`₹${v.salePrice}`}</Text>
                    {v.mrpPrice > v.salePrice && (
                      <Text
                        style={[
                          styles.vMrp,
                          { fontSize: BP.tablet ? 9 : BP.xs ? 7 : 8 },
                        ]}
                      >{`MRP ₹${v.mrpPrice}`}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.vOff,
                      { fontSize: BP.tablet ? 10 : BP.xs ? 8 : 9 },
                    ]}
                  >{`${v.discountPercentage}% OFF`}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}

        <View
          style={[
            styles.priceDiscountRow,
            { marginTop: BP.tablet ? 5 : BP.xs ? 2 : 3 },
          ]}
        >
          <Text
            style={[styles.priceValue, { fontSize: fs.price }]}
          >{`₹${discountedPrice}`}</Text>
          {isVeg && (
            <View
              style={[
                styles.vegMark,
                { marginLeft: BP.tablet ? 130 : BP.xs ? 96 : 111 },
              ]}
            >
              <View
                style={[styles.vegBox, BP.tablet && { width: 18, height: 18 }]}
              >
                <View
                  style={[styles.vegDot, BP.tablet && { width: 9, height: 9 }]}
                />
              </View>
            </View>
          )}
        </View>

        {brandId?.name ? (
          <Text style={[styles.brandText, { fontSize: fs.brand }]}>
            {brandId.name}
          </Text>
        ) : null}

        <View
          style={[
            styles.titleRow,
            { marginTop: BP.tablet ? 5 : BP.xs ? 2 : 3 },
          ]}
        >
          <Text
            style={[
              styles.titleText,
              { fontSize: fs.title, lineHeight: fs.titleLH },
            ]}
            numberOfLines={hasVariants ? 2 : 5}
          >
            {title}
          </Text>
        </View>

        <View
          style={[
            styles.cartButtonRow,
            BP.xs ? { position: 'relative', bottom: 0, marginTop: 8 } : null,
          ]}
        >
          {!isOutOfStock ? (
            currentQty > 0 ? (
              <View style={[styles.stepperFullWidth, { height: stepperH }]}>
                <TouchableOpacity
                  style={[
                    styles.stepperSide,
                    { width: BP.tablet ? 70 : BP.xs ? 50 : 60 },
                  ]}
                  onPress={handleDecrement}
                  disabled={loading}
                  activeOpacity={1}
                >
                  {!loading ? (
                    <Text
                      style={[
                        styles.stepperSymbol,
                        BP.tablet && { fontSize: 20 },
                      ]}
                    >
                      −
                    </Text>
                  ) : null}
                </TouchableOpacity>
                <View style={styles.stepperMiddle}>
                  {loading ? (
                    <Lottie
                      source={require('../../lottie/loading.json')}
                      autoPlay
                      loop
                      style={{
                        width: BP.tablet ? 28 : 22,
                        height: BP.tablet ? 28 : 22,
                      }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.stepperQtyText,
                        BP.tablet && { fontSize: 16 },
                      ]}
                    >
                      {currentQty}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.stepperSide,
                    { width: BP.tablet ? 70 : BP.xs ? 50 : 60 },
                  ]}
                  onPress={handleIncrement}
                  disabled={loading}
                  activeOpacity={1}
                >
                  {!loading ? (
                    <Text
                      style={[
                        styles.stepperSymbol,
                        BP.tablet && { fontSize: 20 },
                      ]}
                    >
                      +
                    </Text>
                  ) : null}
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.cartButton, { height: stepperH }]}
                onPress={handleIncrement}
                disabled={loading}
              >
                {loading ? (
                  <Lottie
                    source={require('../../lottie/loading.json')}
                    autoPlay
                    loop
                    style={{
                      width: BP.tablet ? 28 : 24,
                      height: BP.tablet ? 28 : 24,
                    }}
                  />
                ) : (
                  <Text
                    style={[
                      styles.cartButtonText,
                      BP.tablet && { fontSize: 14 },
                    ]}
                  >
                    ADD TO CART
                  </Text>
                )}
              </TouchableOpacity>
            )
          ) : (
            <View style={[styles.outOfStockButton, { height: stepperH }]}>
              <Text
                style={[
                  styles.outOfStockButtonText,
                  BP.tablet && { fontSize: 14 },
                ]}
              >
                OUT OF STOCK
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    paddingTop: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 0.1,
    borderColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#404040',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardInner: { flex: 1, justifyContent: 'flex-start' },
  imageSection: {
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
    backgroundColor: '#F6F6F6',
    borderRadius: 6,
    borderColor: '#F59A11',
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  bestsellerContainer: {
    borderRadius: 5,
    paddingHorizontal: 7,
    justifyContent: 'center',
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
    width: Platform.select({
      ios: 96,
      android: 'auto',
      left: 1,
    }),
  },
  bestsellerText: { color: '#fff', fontFamily: 'Gotham-Rounded-Bold' },
  swiper: { width: '100%' },
  productImage: { width: '100%', height: '100%' },
  ratingBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 10,
    color: '#fff',
    alignSelf: 'flex-start',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: '#181818',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'gotham-rounded-book',
    paddingLeft: 2,
  },
  brandText: {
    color: '#F59A11',
    fontFamily: 'Gotham-Rounded-Bold',
    paddingLeft: 3,
  },
  priceDiscountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  priceValue: { color: '#218032', fontFamily: 'Gotham-Rounded-Bold' },
  cartButtonRow: { position: 'absolute', bottom: 5, left: 0, right: 0 },
  cartButton: {
    backgroundColor: '#F59A11',
    borderRadius: 6,
    width: '100%',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  stepperFullWidth: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59A11',
    overflow: 'hidden',
  },
  stepperSide: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F59A11',
    height: '100%',
  },
  stepperMiddle: {
    flex: 1,
    backgroundColor: '#F59A11',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperSymbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  stepperQtyText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  vegMark: { alignItems: 'center' },
  vegBox: {
    width: 15,
    height: 15,
    borderWidth: 2,
    borderColor: '#008000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
  },
  vegDot: {
    width: 7.5,
    height: 7.5,
    borderRadius: 7,
    backgroundColor: '#008000',
  },
  vRow: {
    flexDirection: 'row',
  },
  vCard: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: '#014e6a',
    alignSelf: 'flex-start',
  },
  vHead: {
    backgroundColor: '#0A4B5F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  vHeadTxt: {
    color: '#FFFFFF',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  vBody: {
    paddingHorizontal: 4,
    paddingTop: 1,
    flex: 1,
  },
  vSale: {
    color: '#014e6a',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  vMrp: {
    marginLeft: 6,
    color: '#6a6a6a',
    textDecorationLine: 'line-through',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  vOff: {
    color: '#007d17',
    fontFamily: 'Gotham-Rounded-Bold',
    textAlign: 'center',
  },
  outOfStockButton: {
    backgroundColor: '#CCCCCC',
    borderRadius: 6,
    width: '100%',
    justifyContent: 'center',
  },
  outOfStockButtonText: {
    color: '#666666',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
});
