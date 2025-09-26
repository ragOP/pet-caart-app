import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { Trash2, MapPin, MapPinHouse } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { getCart } from '../../apis/getCart';
import AddressShimmer from '../../ui/Shimmer/AddressShimmer';
import { getCoupons } from '../../apis/getCoupons';
import { addProductToCart } from '../../apis/addProductToCart';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../redux/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { getAddresses } from '../../apis/getAddresses';
import SpecialDeals from '../../components/SpecialDeals/SpecialDeals';
import { AddressBottomSheet } from '../../components/AddressBottomSheet/AddressBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CouponSheet from '../../components/CouponBottomSheet/CouponBottomSheet';
import Lottie from 'lottie-react-native';

const CartScreen = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
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

  const couponSheetRef = useRef();
  const defaultAddress = addresses.find(addr => addr.isDefault);
  const addressSheetRef = useRef();

  const SELECTED_ADDRESS_KEY = '@selectedAddressId';

  const onSheetClose = () => {
    couponSheetRef.current?.close();
  };

  const loadSelectedAddressId = async () => {
    try {
      const savedId = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
      if (savedId) {
        const addr = addresses.find(a => a.id === savedId);
        if (addr) {
          setSelectedAddress(addr);
        }
      }
    } catch (e) {
      console.error('Failed to load selected address ID', e);
    }
  };

  const handleSelectAddress = async address => {
    setSelectedAddress(address);
    try {
      await AsyncStorage.setItem(SELECTED_ADDRESS_KEY, address.id);
    } catch (e) {
      console.error('Failed to save selected address ID', e);
    }
    await fetchAndSetCurrentCart(address.id);
  };

  const fetchAndSetCurrentCart = async addressId => {
    try {
      setLoading(true);
      const effectiveAddressId =
        addressId ?? (await AsyncStorage.getItem(SELECTED_ADDRESS_KEY));
      const cartResponse = await getCart({
        params: { address_id: effectiveAddressId },
      });
      if (cartResponse.success) {
        const formattedItems = cartResponse.data.items.map(item => ({
          id: item._id || item.productId,
          title: item.productId?.title || 'No Title',
          price: item.price || 0,
          quantity: item.quantity || 1,
          total: item.total || item.price * item.quantity,
          cgst: item.cgst || 0,
          sgst: item.sgst || 0,
          cess: item.cess || 0,
          igst: item.igst || 0,
          image: item.productId?.images?.[0] || 'default-image-url',
          productId: item.productId._id || item.productId,
          variantId: item.variantId?._id || null,
        }));
        dispatch(setCart(formattedItems));
        setShippingCost(cartResponse.data.shippingDetails?.totalCost || 0);
        setShippingDate(cartResponse.data.shippingDetails?.estimatedDate || '');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchAllData = async () => {
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
        await fetchAndSetCurrentCart(addressId);
      } catch (error) {
        console.error('Error in initial fetch:', error);
      }
    };
    fetchAllData();
  }, [isLoggedIn, dispatch]);

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
      await fetchAndSetCurrentCart();
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
      await fetchAndSetCurrentCart();
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const totalMRP = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
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

  const totalPayable =
    totalMRP + cgst + sgst + cess + igst - couponDiscount + shippingCost;

  const handleCouponApply = (coupon, isSelected) => {
    if (coupon && totalMRP >= coupon.minPurchase) {
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setCouponError('');
      couponSheetRef.current.close();
    } else if (!coupon) {
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
      couponSheetRef.current.close();
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
  };

  const PROGRESS_TARGET = 2000;
  const progress = Math.min(totalPayable / PROGRESS_TARGET, 1);
  const showProgress = totalPayable > 0;
  const showDog = totalPayable > 0 && totalPayable < PROGRESS_TARGET;

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Svg width={200} height={200} viewBox="0 0 100 100" fill="none">
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
      <Text style={styles.emptyText}>It feels so light!</Text>
      <Text style={styles.emptySubText}>
        There is nothing in your bags. Let's add some items.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.addressContainer}>
          <MapPinHouse size={17} color="#666" />
          <Text style={styles.addressText} numberOfLines={1}>
            {selectedAddress
              ? `${selectedAddress.name}, ${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.zip}`
              : defaultAddress
              ? `${defaultAddress.name}, ${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.zip}`
              : 'Select delivery address'}
          </Text>
          <TouchableOpacity
            onPress={() => addressSheetRef.current.open()}
            style={styles.changeButton}
            activeOpacity={1}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <AddressShimmer />
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <LinearGradient
            colors={['#278939', '#419351', '#74C082', '#419351', '#278939']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.banner, Platform.OS === 'ios' && { height: 60 }]}
          >
            <Text style={styles.bannerText}>
              🎉 You’re saving{' '}
              <Text style={{ fontWeight: 'bold' }}>
                ₹{couponDiscount.toFixed(2)}
              </Text>{' '}
              on this order
            </Text>
          </LinearGradient>

          <ScrollView contentContainerStyle={styles.content}>
            {showProgress && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                </View>
                {showDog && (
                  <Lottie
                    style={[
                      styles.dogImage,
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
                <View style={styles.card}>
                  <Image
                    source={{
                      uri:
                        typeof item.image === 'string'
                          ? item.image
                          : Array.isArray(item.image)
                          ? item.image[0]
                          : '',
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.details}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.priceAndStepper}>
                      <View style={styles.priceWrapper}>
                        <Text style={styles.price}>₹{item.price}</Text>
                        <View style={styles.mrpDiscountContainer}>
                          <Text style={styles.mrp}>MRP ₹{item.price}</Text>
                          <Text style={styles.discount}>(0% Off)</Text>
                        </View>
                      </View>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => decreaseQuantity(item.id)}
                          disabled={updatingId === item.id}
                        >
                          <Text style={styles.stepText}>-</Text>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        {updatingId === item.id ? (
                          <ActivityIndicator size="small" color="#FFA500" />
                        ) : (
                          <Text style={styles.quantity}>{item.quantity}</Text>
                        )}
                        <View style={styles.separator} />
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => increaseQuantity(item.id)}
                          disabled={updatingId === item.id}
                        >
                          <Text style={styles.stepText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {deletingId === item.id ? (
                    <ActivityIndicator
                      style={styles.trashIcon}
                      size="small"
                      color="#FFA500"
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.trashIcon}
                      onPress={() => deleteItem(item.id)}
                      onPressOut={e => e.stopPropagation()}
                    >
                      <Trash2 size={18} color="#fc9a8c" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <SpecialDeals />
            <View style={styles.couponContainer}>
              <View style={styles.couponHeader}>
                <Image
                  source={require('../../assets/icons/cpn.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.couponTitle}>Coupons & Offers</Text>
              </View>
              <View style={styles.couponInputWrapper}>
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter Coupon Code"
                  placeholderTextColor="#999"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  editable={true}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleManualCouponApply}
                >
                  <Text style={styles.applyBtn}>APPLY</Text>
                </TouchableOpacity>
              </View>
              {couponError ? (
                <Text style={styles.couponError}>{couponError}</Text>
              ) : null}
              <TouchableOpacity
                activeOpacity={1}
                style={styles.allCouponsRow}
                onPress={() => couponSheetRef.current.open()}
              >
                <Text style={styles.checkAllCoupons}>Check All Coupons</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gstContainer}>
              <View style={styles.gstHeader}>
                <Image
                  source={require('../../assets/images/gst.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.gstTitle}>Apply for GST Invoice</Text>
              </View>
              <View style={styles.gstInputWrapper}>
                <TextInput
                  style={styles.gstInput}
                  placeholder="Enter GST Number"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity activeOpacity={1}>
                  <Text style={styles.applyBtn}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.priceDetailsWrapper}>
              <Text style={styles.priceDetailsTitle}>📦 Price Details</Text>
              <View style={styles.priceRow}>
                <Text style={styles.label}>Total MRP Price</Text>
                <Text style={styles.value}>₹{totalMRP.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.freeText}>Coupon Discount</Text>
                <Text style={styles.freeText}>
                  - ₹{couponDiscount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>CGST</Text>
                <Text style={styles.value}>₹{cgst.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>SGST</Text>
                <Text style={styles.value}>₹{sgst.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>IGST</Text>
                <Text style={styles.value}>₹{igst.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.label}>CESS</Text>
                <Text style={styles.value}>₹{cess.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.label}>Shipping Charges</Text>
                  <Text style={styles.subText}>
                    {shippingCost === 0
                      ? 'Free'
                      : `Expected Delivery By : ${shippingDate}`}
                  </Text>
                </View>
                <Text style={styles.freeText}>₹{shippingCost.toFixed(2)}</Text>
              </View>
              <View style={styles.dashedLine} />
              <View style={styles.priceRow}>
                <Text style={styles.totalPay}>To Pay</Text>
                <Text style={styles.totalPayAmount}>
                  ₹{totalPayable.toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* This button appears only when cart items are loaded! */}
          <TouchableOpacity
            style={styles.payNowButton}
            activeOpacity={0.9}
            onPress={() => {
              /* TODO: Connect to your checkout or payment screen */
              // navigation.navigate('CheckoutScreen');
            }}
          >
            <Text style={styles.payNowButtonText}>
              PAY ₹{totalPayable.toFixed(2)}
            </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 12,
  },
  addressText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
    flex: 1,
  },
  banner: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  bannerText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  content: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    position: 'relative',
    borderColor: '#F59A11',
    borderWidth: 0.8,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 4,
    color: '#222',
    width: '85%',
  },
  priceAndStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#218032',
    marginBottom: 4,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  mrpDiscountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrp: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 6,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  discount: {
    fontSize: 12,
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
    width: 100,
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#004E6A0D',
  },
  stepBtn: {
    paddingHorizontal: 8,
  },
  stepText: {
    fontSize: 16,
    color: '#222',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  trashIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  emptyCartContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: 'black',
  },
  emptySubText: {
    fontSize: 14,
    color: 'black',
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  couponContainer: {
    backgroundColor: '#0888B133',
    borderColor: '#0888B1',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
    marginLeft: 8,
  },
  couponInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 1,
    height: 45,
  },
  couponInput: {
    fontSize: 16,
    color: '#222',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  applyBtn: {
    color: '#0B99C6',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    marginLeft: 12,
  },
  couponError: {
    color: 'red',
    marginTop: 6,
  },
  gstContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EBEBEB',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  gstHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gstTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
    marginLeft: 8,
  },
  gstInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 1,
    height: 45,
  },
  gstInput: {
    fontSize: 16,
    color: '#222',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  allCouponsRow: {
    borderTopWidth: 1,
    borderTopColor: '#0888B1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderStyle: 'dashed',
  },
  checkAllCoupons: {
    color: '#0888B1',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  priceDetailsWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59A11',
    padding: 16,
    marginBottom: '45%',
  },
  priceDetailsTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#222',
  },
  subText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  freeText: {
    fontSize: 15,
    fontFamily: 'Gotham-Rounded-Bold',
    color: 'green',
  },
  dashedLine: {
    borderTopWidth: 1,
    borderColor: '#F59A11',
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  totalPay: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
  },
  totalPayAmount: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
  },
  payNowButton: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    backgroundColor: '#0888B1',
    paddingVertical: 15,
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
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  changeButtonText: {
    color: '#0888B1',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Gotham-Rounded-Bold',
    paddingVertical: 6,
    paddingHorizontal: 12,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#004E6A80',
  },
  progressContainer: {
    marginBottom: 8,
    height: 50,
    justifyContent: 'center',
    position: 'relative',
  },
  progressBarBackground: {
    height: 12,
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
    width: 60,
    height: 90,
    position: 'absolute',
    top: -42,
  },
});

export default CartScreen;
