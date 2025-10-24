import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  Switch,
} from 'react-native';
import { Trash2, MapPinHouse } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';

// API helpers
import { getCart } from '../../apis/getCart';
import { getCoupons } from '../../apis/getCoupons';
import { addProductToCart } from '../../apis/addProductToCart';
import { getAddresses } from '../../apis/getAddresses';
import { apiService } from '../../apis/apiService';
import { checkUserWallet } from '../../apis/checkUserWallet';

import { useDispatch, useSelector } from 'react-redux';
import { setCart, resetCart } from '../../redux/cartSlice';
import { useNavigation } from '@react-navigation/native';

import SpecialDeals from '../../components/SpecialDeals/SpecialDeals';
import { AddressBottomSheet } from '../../components/AddressBottomSheet/AddressBottomSheet';
import CouponSheet from '../../components/CouponBottomSheet/CouponBottomSheet';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';
import RazorpayCheckout from 'react-native-razorpay';
import CartShimmer from '../../ui/Shimmer/CartShimmer';

const { width: SW, height: SH } = Dimensions.get('window');
const isVerySmallRaw = SW <= 340 || SH <= 600;
const isSmallRaw = SW <= 375 || SH <= 667;
const isSmallStrict = SW <= 384 || SH <= 684;
const useVerySmall = isVerySmallRaw;
const useSmall = isSmallRaw && isSmallStrict;

const SELECTED_ADDRESS_KEY = '@selectedAddressId';

const CartScreen = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const cartItems = useSelector(state => state.cart.items);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingDate, setShippingDate] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [cartId, setCartId] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState('');
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // Wallet from API only
  const [walletSwitch, setWalletSwitch] = useState(false); // controlled by API round-trip
  const [walletBalance, setWalletBalance] = useState(0); // from API
  const [walletDiscount, setWalletDiscount] = useState(0); // from API
  const [serverGrandTotal, setServerGrandTotal] = useState(null); // from API

  const successAnimRef = useRef(null);
  const couponSheetRef = useRef();
  const addressSheetRef = useRef();
  const s = useMemo(
    () => makeStyles({ isSmall: useSmall, isVerySmall: useVerySmall }),
    [],
  );
  const defaultAddress = addresses.find(addr => addr.isDefault);
  const cartIdFromItems = cartItems?.length ? cartItems[0]?.cartId : null;

  const onSheetClose = () => {
    couponSheetRef.current?.close();
  };

  const loadSelectedAddressId = async (list = addresses) => {
    try {
      const savedId = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
      if (savedId) {
        const addr = list.find(a => a.id === savedId);
        if (addr) setSelectedAddress(addr);
      }
    } catch {}
  };

  const handleSelectAddress = async address => {
    setSelectedAddress(address);
    try {
      await AsyncStorage.setItem(SELECTED_ADDRESS_KEY, address.id);
    } catch {}
    await fetchAndSetCurrentCart(address.id, walletSwitch);
  };

  // Core fetch that always asks server whether wallet should be used
  const fetchAndSetCurrentCart = async (
    addressId,
    useWalletFlag = walletSwitch,
  ) => {
    try {
      setLoading(true);
      const effectiveAddressId =
        addressId ?? (await AsyncStorage.getItem(SELECTED_ADDRESS_KEY));

      const params = {
        address_id: effectiveAddressId,
        isUsingWalletAmount: useWalletFlag ? 'true' : 'false',
      };

      const cartResponse = await getCart({ params });

      if (cartResponse?.success) {
        const formattedItems = cartResponse.data.items.map(item => {
          const mrp = item.variantId?.price || item.productId?.price || 0;
          const salePrice = item.price || 0;
          const weight = item.variantId?.weight || item.productId?.weight;
          const discount =
            mrp && salePrice ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;

          return {
            id: item._id,
            title: item.productId?.title || 'No Title',
            price: mrp,
            salePrice,
            discount,
            quantity: item.quantity || 1,
            total: item.total || salePrice * item.quantity,
            cgst: item.cgst || 0,
            sgst: item.sgst || 0,
            cess: item.cess || 0,
            igst: item.igst || 0,
            image: item.productId?.images?.[0] || 'default-image-url',
            productId: item.productId._id || item.productId,
            variantId: item.variantId?._id || null,
            weight,
            variantName:
              item.variantId?.variantName || item.variantId?.title || '',
          };
        });

        dispatch(setCart(formattedItems));
        setShippingCost(cartResponse.data.shippingDetails?.totalCost || 0);
        setShippingDate(cartResponse.data.shippingDetails?.estimatedDate || '');
        setCartId(cartResponse.data?._id || null);

        // Wallet fields driven by API
        setWalletDiscount(Number(cartResponse.data?.walletDiscount || 0));
        setServerGrandTotal(
          typeof cartResponse.data?.total_price_with_shipping_and_discount ===
            'number'
            ? cartResponse.data.total_price_with_shipping_and_discount
            : null,
        );
        setWalletSwitch((cartResponse.data?.walletDiscount || 0) > 0);
      } else {
        dispatch(setCart([]));
        setShippingCost(0);
        setShippingDate('');
        setCartId(null);
        setWalletDiscount(0);
        setWalletBalance(0);
        setServerGrandTotal(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data
  useEffect(() => {
    if (!isLoggedIn) return;
    (async () => {
      try {
        setLoading(true);

        const addrResponse = await getAddresses();
        let formattedAddresses = [];
        if (addrResponse?.success) {
          formattedAddresses = addrResponse.data.map(item => ({
            id: item._id,
            name: `${item.firstName} ${item.lastName}`,
            address: item.address,
            phone: item.phone,
            city: item.city,
            country: item.country,
            state: item.state,
            zip: item.zip,
            isDefault: item.isDefault,
            type: item.type,
          }));
          setAddresses(formattedAddresses);
          await loadSelectedAddressId(formattedAddresses);
        }

        const couponsResponse = await getCoupons();
        if (couponsResponse?.success) {
          setCoupons(couponsResponse.data.data || []);
        }

        const addressId =
          selectedAddress?.id ??
          (await AsyncStorage.getItem(SELECTED_ADDRESS_KEY));

        await fetchAndSetCurrentCart(addressId, false);
      } catch (error) {
        console.error('Error in initial fetch:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn, dispatch]);

  // Wallet balance fetch (optional; UI shows balance regardless)
  useEffect(() => {
    (async () => {
      if (!isLoggedIn) return;
      try {
        const resp = await checkUserWallet();
        const bal = resp?.data?.walletBalance;
        if (typeof bal === 'number') setWalletBalance(bal);
      } catch {}
    })();
  }, [isLoggedIn]);

  // Toggle switch -> request server to apply/remove wallet, then refresh
  const onWalletSwitchChange = async val => {
    setWalletSwitch(val);
    await fetchAndSetCurrentCart(undefined, val);
  };

  // Mutations refetch with current server-intended flag
  const updateQuantity = async (id, newQuantity) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setUpdatingId(id);
    try {
      await addProductToCart({
        productId: item.productId,
        variantId: item.variantId,
        quantity: newQuantity,
      });
      await fetchAndSetCurrentCart(undefined, walletSwitch);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const increaseQuantity = id => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    updateQuantity(id, item.quantity + 1);
  };

  const decreaseQuantity = id => {
    const item = cartItems.find(i => i.id === id);
    if (!item || item.quantity <= 1) return;
    updateQuantity(id, item.quantity - 1);
  };

  const deleteItem = async id => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setDeletingId(id);
    try {
      await addProductToCart({
        productId: item.productId,
        variantId: item.variantId,
        quantity: 0,
      });
      await fetchAndSetCurrentCart(undefined, walletSwitch);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Client-side sums (shown alongside server-calculated fields)
  const totalMRP = cartItems.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0,
  );
  const cgst = cartItems.reduce(
    (sum, item) => sum + (item.cgst || 0) * item.quantity,
    0,
  );
  const sgst = cartItems.reduce(
    (sum, item) => sum + (item.sgst || 0) * item.quantity,
    0,
  );
  const cess = cartItems.reduce(
    (sum, item) => sum + (item.cess || 0) * item.quantity,
    0,
  );
  const igst = cartItems.reduce(
    (sum, item) => sum + (item.igst || 0) * item.quantity,
    0,
  );

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'percentage') {
      const rawDiscount = (appliedCoupon.discountValue / 100) * totalMRP;
      couponDiscount = appliedCoupon.maxDiscount
        ? Math.min(rawDiscount, appliedCoupon.maxDiscount)
        : rawDiscount;
    }
  }

  const localSubtotal =
    totalMRP + cgst + sgst + cess + igst - couponDiscount + shippingCost;

  // Prefer server total; otherwise subtract server wallet discount when switch is ON
  const totalPayable =
    typeof serverGrandTotal === 'number'
      ? serverGrandTotal
      : Math.max(0, localSubtotal - (walletSwitch ? walletDiscount : 0));

  const getEffectiveAddressId = async () => {
    const savedId = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
    return selectedAddress?.id || savedId || defaultAddress?.id || '';
  };

  const getEffectiveCouponId = () => {
    return appliedCoupon?._id || appliedCoupon?.id || '';
  };

  const playSuccessAndNavigate = async () => {
    try {
      setShowSuccessAnim(true);
      await new Promise(res => setTimeout(res, 1800));
    } finally {
      setShowSuccessAnim(false);
      navigation.navigate('MyOrderScreen');
    }
  };

  const handlePayNow = async () => {
    try {
      if (!isLoggedIn) {
        Alert.alert('Login required', 'Please login to continue');
        return;
      }
      if (!totalPayable || totalPayable <= 0) {
        Alert.alert('Cart empty', 'Please add items to proceed');
        return;
      }
      setIsPaying(true);

      const addressId = await getEffectiveAddressId();
      const couponId = getEffectiveCouponId();
      const note = checkoutNote || '';
      const effectiveCartId = cartId || cartIdFromItems;

      if (!effectiveCartId)
        throw new Error('Cart is not ready yet. Please try again.');
      if (!addressId) throw new Error('Please select a delivery address.');

      const createPaymentResp = await apiService({
        endpoint: 'api/razorpay/create-payment',
        method: 'POST',
        data: {
          addressId,
          cartId: effectiveCartId,
          couponId,
          note,
          isUsingWalletAmount: walletSwitch,
        },
      });

      const payload =
        createPaymentResp?.response?.data ||
        createPaymentResp?.data ||
        createPaymentResp;

      const { orderId, amount, currency, key, user } = payload || {};
      if (!orderId || !amount || !currency) {
        throw new Error('Invalid order response from server.');
      }

      const options = {
        key: key || 'rzp_test_RLrG9B2ZmQbDW4',
        amount: String(amount),
        currency,
        name: 'Pet Caart',
        description: 'Order Payment',
        order_id: orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#00BFA5' },
      };

      const paymentData = await RazorpayCheckout.open(options);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        paymentData || {};

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error('Incomplete Razorpay response.');
      }

      await apiService({
        endpoint: 'api/orders',
        method: 'POST',
        data: {
          addressId,
          cartId: effectiveCartId,
          couponId,
          note,
          isUsingWalletAmount: walletSwitch,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      dispatch(resetCart());
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');

      await fetchAndSetCurrentCart(addressId, false);
      await playSuccessAndNavigate();
    } catch (err) {
      Alert.alert(err?.message || 'Something went wrong');
    } finally {
      setIsPaying(false);
    }
  };

  const handleCouponApply = coupon => {
    if (coupon && totalMRP >= coupon.minPurchase) {
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setCouponError('');
      couponSheetRef.current?.close();
      fetchAndSetCurrentCart(undefined, walletSwitch);
    } else if (!coupon) {
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
      couponSheetRef.current?.close();
      fetchAndSetCurrentCart(undefined, walletSwitch);
    } else {
      setCouponError('Minimum purchase not met');
    }
  };

  const handleManualCouponApply = () => {
    const foundCoupon = coupons.find(cpn => cpn.code === couponCode.trim());
    if (!foundCoupon) {
      setCouponError('Invalid Coupon');
      setAppliedCoupon(null);
      return;
    }
    if (totalMRP < foundCoupon.minPurchase) {
      setCouponError('Minimum purchase not met');
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(foundCoupon);
    setCouponError('');
    fetchAndSetCurrentCart(undefined, walletSwitch);
  };

  const formatWeight = grams => {
    if (grams >= 1000) {
      const kg = grams / 1000;
      return Math.floor(kg) + 'kg';
    }
    return grams + 'g';
  };

  const PROGRESS_TARGET = 2000;
  const progress = Math.min(totalPayable / PROGRESS_TARGET, 1);
  const showProgress = totalPayable > 0;
  const showDog = totalPayable > 0 && totalPayable < PROGRESS_TARGET;

  const renderEmptyCart = () => (
    <View style={s.emptyCartContainer}>
      <Svg
        width={useVerySmall ? 120 : useSmall ? 150 : 200}
        height={useVerySmall ? 120 : useSmall ? 150 : 200}
        viewBox="0 0 100 100"
        fill="none"
      >
        <Rect
          x="30"
          y="40"
          width="40"
          height="30"
          rx="5"
          ry="5"
          fill="#684A0080"
        />
        <Path
          d="M30 40 C35 25, 65 25, 70 40"
          fill="transparent"
          stroke="#684A0080"
          strokeWidth="3"
        />
      </Svg>
      <Text style={s.emptyText}>It feels so light!</Text>
      <Text style={s.emptySubText}>
        There is nothing in your bags. Let's add some items.
      </Text>
    </View>
  );

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={s.headerWrapper}>
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>My Cart</Text>
        </View>

        <View style={s.addressContainer}>
          <MapPinHouse
            size={useVerySmall ? 14 : useSmall ? 15 : 17}
            color="#666"
          />
          <Text style={s.addressText} numberOfLines={1}>
            {selectedAddress
              ? `${selectedAddress.name}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.zip}`
              : defaultAddress
              ? `${defaultAddress.name}, ${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.zip}`
              : 'Select delivery address'}
          </Text>
          <TouchableOpacity
            onPress={() => addressSheetRef.current?.open()}
            style={s.changeButton}
            activeOpacity={1}
          >
            <Text style={s.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <CartShimmer />
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <LinearGradient
            colors={['#278939', '#419351', '#74C082', '#419351', '#278939']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.banner}
          >
            <Text style={s.bannerText}>
              🎉 You’re saving{' '}
              <Text style={{ fontWeight: 'bold' }}>
                ₹
                {(couponDiscount + (walletSwitch ? walletDiscount : 0)).toFixed(
                  2,
                )}
              </Text>{' '}
              on this order
            </Text>
          </LinearGradient>

          <ScrollView contentContainerStyle={s.content}>
            {showProgress && (
              <View style={s.progressContainer}>
                <View style={s.progressBarBackground}>
                  <View
                    style={[s.progressBarFill, { width: `${progress * 100}%` }]}
                  />
                </View>
                {showDog && (
                  <Lottie
                    style={[
                      s.dogImage,
                      {
                        left: `${progress * 100}%`,
                        transform: [{ translateX: -20 }],
                      },
                    ]}
                    source={require('../../lottie/Dogwalking.json')}
                    autoPlay
                    loop
                  />
                )}
              </View>
            )}

            {cartItems.map((item, idx) => (
              <TouchableOpacity
                key={item.id ? String(item.id) : String(idx)}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('SingleProductScreen', {
                    productId: item.productId,
                  })
                }
              >
                <View style={s.card}>
                  <Image
                    source={{
                      uri:
                        typeof item.image === 'string'
                          ? item.image
                          : Array.isArray(item.image)
                          ? item.image[0]
                          : '',
                    }}
                    style={s.productImage}
                  />
                  <View style={s.details}>
                    <Text style={s.title}>{item.title}</Text>
                    {item.variantId && (item.variantName || item.weight) && (
                      <View style={s.variantChip}>
                        <Text style={s.variantText}>
                          {item.variantName
                            ? item.variantName
                            : formatWeight(item.weight)}
                        </Text>
                      </View>
                    )}

                    <View style={s.priceAndStepper}>
                      <View style={s.priceWrapper}>
                        <Text style={s.price}>₹{item.salePrice}</Text>
                        <View style={s.mrpDiscountContainer}>
                          <Text style={s.mrp}>MRP ₹{item.price}</Text>
                          <Text style={s.discount}>({item.discount}% Off)</Text>
                        </View>
                      </View>

                      <View className="stepper" style={s.stepper}>
                        <TouchableOpacity
                          style={s.stepBtn}
                          onPress={() => decreaseQuantity(item.id)}
                          disabled={updatingId === item.id}
                        >
                          <Text style={s.stepText}>-</Text>
                        </TouchableOpacity>
                        <View style={s.separator} />
                        {updatingId === item.id ? (
                          <ActivityIndicator size="small" color="#FFA500" />
                        ) : (
                          <Text style={s.quantity}>{item.quantity}</Text>
                        )}
                        <View style={s.separator} />
                        <TouchableOpacity
                          style={s.stepBtn}
                          onPress={() => increaseQuantity(item.id)}
                          disabled={updatingId === item.id}
                        >
                          <Text style={s.stepText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {deletingId === item.id ? (
                    <ActivityIndicator
                      style={s.trashIcon}
                      size="small"
                      color="#FFA500"
                    />
                  ) : (
                    <TouchableOpacity
                      style={s.trashIcon}
                      onPress={() => deleteItem(item.id)}
                      onPressOut={e => e.stopPropagation()}
                    >
                      <Trash2
                        size={useVerySmall ? 14 : useSmall ? 16 : 18}
                        color="#fc9a8c"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <SpecialDeals />

            {/* Coupons */}
            <View style={s.couponContainer}>
              <View style={s.couponHeader}>
                <Image
                  source={require('../../assets/icons/cpn.png')}
                  style={{
                    width: useVerySmall ? 16 : useSmall ? 18 : 20,
                    height: useVerySmall ? 16 : useSmall ? 18 : 20,
                  }}
                />
                <Text style={s.couponTitle}>Coupons & Offers</Text>
              </View>

              <View style={s.couponInputWrapper}>
                <TextInput
                  style={s.couponInput}
                  placeholder="Enter Coupon Code"
                  placeholderTextColor="#999"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  editable
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleManualCouponApply}
                >
                  <Text style={s.applyBtn}>APPLY</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={s.couponError}>{couponError}</Text>
              ) : null}

              <TouchableOpacity
                activeOpacity={1}
                style={s.allCouponsRow}
                onPress={() => couponSheetRef.current?.open()}
              >
                <Text style={s.checkAllCoupons}>Check All Coupons</Text>
              </TouchableOpacity>
            </View>

            {/* Wallet preference driven by API */}
            <View style={s.walletContainer}>
              <View style={s.walletLeft}>
                {/* <Image
                  source={require('../../assets/icons/wallet.png')}
                  style={s.walletIcon}
                /> */}
                <View>
                  <Text style={s.walletTitle}>Use Wallet Balance</Text>
                  <Text style={s.walletSub}>
                    Available: ₹{Number(walletBalance || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
              <Switch
                value={walletSwitch}
                onValueChange={onWalletSwitchChange}
                trackColor={{ false: '#d9d9d9', true: '#9be7f3' }}
                thumbColor={walletSwitch ? '#0888B1' : '#f4f3f4'}
              />
            </View>

            {/* GST */}
            <View style={s.gstContainer}>
              <View style={s.gstHeader}>
                <Image
                  source={require('../../assets/images/gst.png')}
                  style={{
                    width: useVerySmall ? 16 : useSmall ? 18 : 20,
                    height: useVerySmall ? 16 : useSmall ? 18 : 20,
                  }}
                />
                <Text style={s.gstTitle}>Apply for GST Invoice</Text>
              </View>

              <View style={s.gstInputWrapper}>
                <TextInput
                  style={s.gstInput}
                  placeholder="Enter GST Number"
                  placeholderTextColor="#999"
                  value={checkoutNote}
                  onChangeText={setCheckoutNote}
                />
                <TouchableOpacity activeOpacity={1} onPress={() => {}}>
                  <Text style={s.applyBtn}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price Details */}
            <View style={s.priceDetailsWrapper}>
              <Text style={s.priceDetailsTitle}>📦 Price Details</Text>

              <View style={s.priceRow}>
                <Text style={s.label}>Total MRP Price</Text>
                <Text style={s.value}>₹{totalMRP.toFixed(2)}</Text>
              </View>

              <View style={s.priceRow}>
                <Text style={s.freeText}>Coupon Discount</Text>
                <Text style={s.freeText}>- ₹{couponDiscount.toFixed(2)}</Text>
              </View>

              <View style={s.priceRow}>
                <View>
                  <Text style={s.label}>Shipping Charges</Text>
                  <Text style={s.subText}>
                    {shippingCost === 0
                      ? 'Free'
                      : `Expected Delivery By : ${shippingDate}`}
                  </Text>
                </View>
                <Text style={s.freeText}>₹{shippingCost.toFixed(2)}</Text>
              </View>

              {walletSwitch && walletDiscount > 0 ? (
                <View style={s.priceRow}>
                  <Text style={s.label}>Wallet Discount</Text>
                  <Text style={s.freeText}>- ₹{walletDiscount.toFixed(2)}</Text>
                </View>
              ) : null}

              <View style={s.dashedLine} />

              <View style={s.priceRow}>
                <Text style={s.totalPay}>To Pay</Text>
                <Text style={s.totalPayAmount}>₹{totalPayable.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[s.payNowButton, isPaying && { opacity: 0.6 }]}
            activeOpacity={0.9}
            onPress={handlePayNow}
            disabled={isPaying}
          >
            {isPaying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={s.payNowButtonText}>{`PAY ₹${totalPayable.toFixed(
                2,
              )}`}</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <AddressBottomSheet
        ref={addressSheetRef}
        selectedAddressId={selectedAddress?.id}
        defaultAddressId={defaultAddress?.id}
        onSelectAddress={handleSelectAddress}
        onAddAddress={() => navigation.navigate('AddAddressScreen')}
      />

      <CouponSheet
        innerRef={couponSheetRef}
        appliedCoupon={appliedCoupon}
        onSelectCoupon={handleCouponApply}
        onSheetClose={onSheetClose}
      />
      {showSuccessAnim && (
        <View style={s.successOverlay} pointerEvents="none">
          <Lottie
            ref={successAnimRef}
            source={require('../../lottie/Add To Cart Success.json')}
            autoPlay
            loop={false}
            style={s.successLottie}
          />
        </View>
      )}
    </View>
  );
};
const makeStyles = ({ isSmall: small, isVerySmall: vsmall }) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },

    headerWrapper: {
      backgroundColor: '#FFFFFF',
      paddingTop:
        Platform.OS === 'android'
          ? StatusBar.currentHeight || (vsmall ? 18 : small ? 22 : 40)
          : Platform.OS === 'ios'
          ? StatusBar.currentHeight || 50
          : 0,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: vsmall ? 10 : small ? 12 : 15,
      paddingVertical: vsmall ? 4 : small ? 6 : 8,
    },
    headerTitle: {
      fontSize: vsmall ? 16 : small ? 18 : 20,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#222',
    },

    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: vsmall ? 3 : small ? 4 : 5,
      paddingHorizontal: vsmall ? 8 : small ? 10 : 12,
      gap: vsmall ? 3 : small ? 4 : 6,
    },
    addressText: {
      marginLeft: vsmall ? 4 : small ? 5 : 6,
      fontSize: vsmall ? 12 : small ? 13 : 14,
      color: '#555',
      fontFamily: 'Gotham-Rounded-Medium',
      flex: 1,
    },
    changeButton: { paddingLeft: vsmall ? 3 : small ? 4 : 6 },
    changeButtonText: {
      color: '#0888B1',
      fontSize: vsmall ? 11 : small ? 12 : 14,
      fontWeight: '700',
      fontFamily: 'Gotham-Rounded-Bold',
      paddingVertical: vsmall ? 3 : small ? 4 : 6,
      paddingHorizontal: vsmall ? 6 : small ? 8 : 12,
      letterSpacing: 0.4,
      textAlign: 'center',
    },

    banner: {
      paddingVertical: Platform.OS === 'ios' ? 0 : vsmall ? 6 : small ? 8 : 10,
      marginBottom: vsmall ? 8 : small ? 12 : 16,
      height: Platform.OS === 'ios' ? 40 : vsmall ? 44 : small ? 52 : 60,
      justifyContent: 'center',
    },
    bannerText: {
      color: 'white',
      fontSize: vsmall ? 12 : small ? 13 : 14,
      textAlign: 'center',
      fontFamily: 'Gotham-Rounded-Bold',
      paddingHorizontal: vsmall ? 6 : small ? 8 : 0,
    },

    content: {
      padding: vsmall ? 8 : small ? 10 : 12,
      paddingBottom: vsmall ? 72 : small ? 84 : 100,
    },

    progressContainer: {
      marginBottom: vsmall ? 4 : small ? 6 : 8,
      height: vsmall ? 36 : small ? 42 : 50,
      justifyContent: 'center',
      position: 'relative',
    },
    progressBarBackground: {
      height: vsmall ? 8 : small ? 10 : 12,
      backgroundColor: '#E0E0E0',
      borderRadius: 20,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#FFA500',
      borderRadius: 20,
    },
    dogImage: {
      width: vsmall ? 44 : small ? 52 : 60,
      height: vsmall ? 66 : small ? 78 : 90,
      position: 'absolute',
      top: vsmall ? -30 : small ? -36 : -42,
    },

    card: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: vsmall ? 8 : small ? 10 : 12,
      padding: vsmall ? 8 : small ? 10 : 12,
      marginBottom: vsmall ? 8 : small ? 10 : 12,
      alignItems: 'center',
      position: 'relative',
      borderColor: '#F59A11',
      borderWidth: 0.8,
    },
    productImage: {
      width: vsmall ? 58 : small ? 68 : 80,
      height: vsmall ? 58 : small ? 68 : 80,
      resizeMode: 'contain',
      marginRight: vsmall ? 6 : small ? 8 : 10,
    },
    details: { flex: 1 },
    title: {
      fontSize: vsmall ? 12 : small ? 13 : 14,
      fontFamily: 'Gotham-Rounded-Medium',
      marginBottom: vsmall ? 2 : small ? 3 : 4,
      color: '#222',
      width: '90%',
      lineHeight: 17,
    },

    priceAndStepper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: vsmall ? 4 : small ? 6 : 8,
    },
    priceWrapper: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
    },
    price: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      color: '#218032',
      marginBottom: vsmall ? 2 : small ? 3 : 4,
      fontFamily: 'Gotham-Rounded-Bold',
    },
    mrpDiscountContainer: { flexDirection: 'row', alignItems: 'center' },
    mrp: {
      fontSize: vsmall ? 10 : small ? 11 : 12,
      textDecorationLine: 'line-through',
      color: '#999',
      marginRight: vsmall ? 3 : small ? 4 : 6,
      fontFamily: 'Gotham-Rounded-Medium',
    },
    discount: {
      fontSize: vsmall ? 10 : small ? 11 : 12,
      color: '#218032',
      fontFamily: 'Gotham-Rounded-Medium',
    },

    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#004E6A80',
      borderRadius: 22,
      overflow: 'hidden',
      width: vsmall ? 84 : small ? 92 : 100,
      justifyContent: 'space-between',
      paddingHorizontal: 6,
      paddingVertical: Platform.OS === 'ios' ? (vsmall ? 2 : small ? 2 : 4) : 1,
      backgroundColor: '#004E6A0D',
    },
    stepBtn: { paddingHorizontal: vsmall ? 5 : small ? 6 : 8 },
    stepText: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      color: '#222',
      fontFamily: 'Gotham-Rounded-Medium',
    },
    quantity: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      fontFamily: 'Gotham-Rounded-Medium',
    },
    trashIcon: {
      position: 'absolute',
      top: vsmall ? 8 : small ? 10 : 12,
      right: vsmall ? 8 : small ? 10 : 12,
    },

    // Coupons
    couponContainer: {
      backgroundColor: '#0888B133',
      borderColor: '#0888B1',
      borderWidth: 1,
      borderRadius: vsmall ? 10 : small ? 12 : 16,
      padding: vsmall ? 10 : small ? 12 : 16,
      marginTop: vsmall ? 6 : small ? 8 : 10,
      marginBottom: vsmall ? 10 : small ? 14 : 20,
    },
    couponHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: vsmall ? 8 : small ? 10 : 12,
    },
    couponTitle: {
      fontSize: vsmall ? 14 : small ? 16 : 18,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#222',
      marginLeft: vsmall ? 6 : small ? 8 : 8,
    },
    couponInputWrapper: {
      flexDirection: 'row',
      backgroundColor: '#F9F9F9',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#EEE',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: vsmall ? 8 : small ? 10 : 10,
      paddingVertical:
        Platform.OS === 'ios' ? (vsmall ? 8 : small ? 9 : 10) : 1,
      height: vsmall ? 38 : small ? 42 : 45,
    },
    couponInput: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      color: '#222',
      fontFamily: 'Gotham-Rounded-Medium',
      flex: 1,
    },
    applyBtn: {
      color: '#0B99C6',
      fontSize: vsmall ? 14 : small ? 15 : 16,
      fontFamily: 'Gotham-Rounded-Bold',
      marginLeft: vsmall ? 10 : small ? 12 : 12,
    },
    couponError: { color: 'red', marginTop: vsmall ? 4 : small ? 6 : 6 },

    // Wallet styles (only visible on true)
    walletContainer: {
      backgroundColor: '#F2FFFB',
      borderColor: '#00BFA5',
      borderWidth: 1,
      borderRadius: vsmall ? 10 : small ? 12 : 16,
      padding: vsmall ? 10 : small ? 12 : 16,
      marginTop: vsmall ? 6 : small ? 8 : 10,
      marginBottom: vsmall ? 10 : small ? 14 : 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    walletLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    walletIcon: {
      width: vsmall ? 18 : small ? 20 : 22,
      height: vsmall ? 18 : small ? 20 : 22,
      resizeMode: 'contain',
      marginRight: 8,
    },
    walletTitle: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#114A3A',
    },
    walletSub: {
      fontSize: vsmall ? 12 : small ? 13 : 13,
      fontFamily: 'Gotham-Rounded-Medium',
      color: '#247C66',
      marginTop: 2,
    },
    switchOuter: {
      width: 48,
      height: 28,
      borderRadius: 16,
      padding: 3,
      justifyContent: 'center',
      backgroundColor: '#00BFA5',
      alignItems: 'flex-end',
    },
    switchKnob: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: '#fff',
    },

    // Choice buttons (tri-state UX)
    choiceBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#C9EDE7',
      borderRadius: 8,
      backgroundColor: '#F7FFFD',
    },
    choiceBtnActive: {
      borderColor: '#00BFA5',
      backgroundColor: '#E9FFFA',
    },
    choiceBtnText: {
      color: '#20655A',
      fontFamily: 'Gotham-Rounded-Bold',
    },
    choiceBtnTextActive: {
      color: '#0a4f44',
    },

    // GST
    gstContainer: {
      backgroundColor: '#FFFFFF',
      borderColor: '#EBEBEB',
      borderWidth: 2,
      borderRadius: vsmall ? 10 : small ? 12 : 16,
      padding: vsmall ? 10 : small ? 12 : 16,
      marginTop: vsmall ? 6 : small ? 8 : 10,
      marginBottom: vsmall ? 10 : small ? 14 : 20,
    },
    gstHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: vsmall ? 8 : small ? 10 : 12,
    },
    gstTitle: {
      fontSize: vsmall ? 14 : small ? 16 : 18,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#222',
      marginLeft: vsmall ? 6 : small ? 8 : 8,
    },
    gstInputWrapper: {
      flexDirection: 'row',
      backgroundColor: '#F9F9F9',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#EEE',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: vsmall ? 8 : small ? 10 : 10,
      paddingVertical:
        Platform.OS === 'ios' ? (vsmall ? 8 : small ? 9 : 10) : 1,
      height: vsmall ? 38 : small ? 42 : 45,
    },
    gstInput: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      color: '#222',
      fontFamily: 'Gotham-Rounded-Medium',
      flex: 1,
    },

    // Price Details
    priceDetailsWrapper: {
      backgroundColor: '#fff',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F59A11',
      padding: 16,
      marginBottom: '15%',
    },
    priceDetailsTitle: {
      fontSize: vsmall ? 16 : small ? 18 : 18,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#000',
      marginBottom: vsmall ? 12 : small ? 16 : 16,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: vsmall ? 10 : small ? 12 : 12,
    },
    label: {
      fontSize: vsmall ? 14 : small ? 15 : 15,
      color: '#222',
      fontFamily: 'Gotham-Rounded-Medium',
    },
    value: {
      fontSize: vsmall ? 14 : small ? 15 : 15,
      fontFamily: 'Gotham-Rounded-Medium',
      color: '#222',
    },
    subText: {
      fontSize: vsmall ? 11 : small ? 12 : 12,
      color: '#999',
      marginTop: vsmall ? 1 : small ? 2 : 2,
      fontFamily: 'Gotham-Rounded-Medium',
    },
    freeText: {
      fontSize: vsmall ? 14 : small ? 15 : 15,
      fontFamily: 'Gotham-Rounded-Bold',
      color: 'green',
    },
    dashedLine: {
      borderTopWidth: 1,
      borderColor: '#F59A11',
      borderStyle: 'dashed',
      marginVertical: vsmall ? 12 : small ? 16 : 16,
    },
    totalPay: {
      fontSize: vsmall ? 16 : small ? 18 : 18,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#000',
    },
    totalPayAmount: {
      fontSize: vsmall ? 16 : small ? 18 : 18,
      fontFamily: 'Gotham-Rounded-Bold',
      color: '#000',
    },

    payNowButton: {
      position: 'absolute',
      bottom: vsmall ? '13.5%' : small ? '15%' : '10%',
      left: 0,
      right: 0,
      backgroundColor: '#0888B1',
      paddingVertical: vsmall ? 11 : small ? 13 : 15,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
    },
    payNowButtonText: {
      color: '#FFF',
      fontSize: vsmall ? 14 : small ? 16 : 18,
      fontFamily: 'Gotham-Rounded-Bold',
    },

    separator: {
      width: 1,
      height: vsmall ? 16 : small ? 18 : 20,
      backgroundColor: '#004E6A80',
    },

    variantChip: {
      backgroundColor: '#e4ebf0',
      paddingHorizontal: vsmall ? 12 : small ? 14 : 20,
      paddingVertical: vsmall ? 2 : small ? 3 : 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginVertical: vsmall ? 2 : small ? 3 : 3,
    },
    variantText: {
      fontSize: vsmall ? 10 : small ? 11 : 12,
      color: '#232a39',
      fontFamily: 'Gotham-Rounded-Medium',
    },

    emptyCartContainer: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: vsmall ? 14 : small ? 15 : 16,
      fontFamily: 'Gotham-Rounded-Bold',
      color: 'black',
    },
    emptySubText: {
      fontSize: vsmall ? 12 : small ? 13 : 14,
      color: 'black',
      marginTop: 6,
      textAlign: 'center',
      fontFamily: 'Gotham-Rounded-Medium',
    },
    checkAllCoupons: {
      color: '#0888B1',
      fontSize: 16,
      fontFamily: 'Gotham-Rounded-Bold',
      textAlign: 'center',
      marginTop: vsmall ? 6 : small ? 8 : 10,
    },

    // Success overlay
    successOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    successLottie: {
      width: SW * 0.5,
      height: SW * 0.5,
    },
  });

export default CartScreen;
