import React, { useState, useEffect } from 'react';
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
import { Trash2, MapPin } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { getCart } from '../../apis/getCart';
import AddressShimmer from '../../ui/Shimmer/AddressShimmer';
import { getCoupons } from '../../apis/getCoupons';
import { addProductToCart } from '../../apis/addProductToCart';

const CartScreen = () => {
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const response = await getCart({ params: {} });
        if (response.success) {
          const fetchedItems = response.data.items.map(item => ({
            id: item._id,
            title: item.productId.title,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            cgst: item.cgst,
            sgst: item.sgst,
            cess: item.cess,
            image: { uri: item.productId.images[0] },
            productId: item.productId._id,
            variantId: item.variantId?._id || null,
          }));

          setCartItems(fetchedItems);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchCoupons = async () => {
      try {
        const couponsResponse = await getCoupons();
        console.log('Coupons Response:', couponsResponse);
        if (
          couponsResponse &&
          couponsResponse.data &&
          Array.isArray(couponsResponse.data.data)
        ) {
          setCoupons(couponsResponse.data.data);
        } else {
          console.error('Invalid coupon data format.');
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    fetchCartData();
    fetchCoupons();
  }, []);
  const increaseQuantity = async id => {
    const item = cartItems.find(i => i.id === id);
    if (!item) {
      console.warn('Item not found for increaseQuantity:', id);
      return;
    }

    const newQuantity = item.quantity + 1;
    console.log(`Increasing quantity for ${item.title} to ${newQuantity}`);
    setUpdatingId(id);

    try {
      const apiResponse = await addProductToCart({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: newQuantity,
      });

      const updated = cartItems.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i,
      );
      setCartItems(updated);
      console.log('Updated cartItems (after increase):', updated);
    } catch (error) {
      console.error('Error while increasing quantity:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const decreaseQuantity = async id => {
    const item = cartItems.find(i => i.id === id);
    if (!item || item.quantity <= 1) {
      console.warn('Cannot decrease quantity for item:', id);
      return;
    }

    const newQuantity = item.quantity - 1;
    console.log(`Decreasing quantity for ${item.title} to ${newQuantity}`);
    setUpdatingId(id);

    try {
      const apiResponse = await addProductToCart({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: newQuantity,
      });

      const updated = cartItems.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i,
      );
      setCartItems(updated);
      console.log('Updated cartItems (after decrease):', updated);
    } catch (error) {
      console.error('Error while decreasing quantity:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteItem = async id => {
    const item = cartItems.find(i => i.id === id);
    if (!item) {
      console.warn('Item not found for delete:', id);
      return;
    }

    setUpdatingId(id);

    try {
      const apiResponse = await addProductToCart({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: 0,
      });

      const updated = cartItems.filter(i => i.id !== id);
      setCartItems(updated);
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error while deleting item:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCouponApply = coupon => {
    if (totalMRP >= coupon.minPurchase) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError(
        `Coupon requires a minimum purchase of ₹${coupon.minPurchase}`,
      );
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

  let couponDiscount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'fixed') {
      couponDiscount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'percentage') {
      const rawDiscount = (appliedCoupon.discountValue / 100) * totalMRP;
      if (appliedCoupon.maxDiscount) {
        couponDiscount = Math.min(rawDiscount, appliedCoupon.maxDiscount);
      } else {
        couponDiscount = rawDiscount;
      }
    }
  }

  const totalPrice = totalMRP + cgst + sgst + cess - couponDiscount;

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
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />

      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.addressContainer}>
          <MapPin size={16} color="#666" />
          <Text style={styles.addressText} numberOfLines={1}>
            402, Silver Oak Apartments, JP Nagar Phase 5, Be...
          </Text>
        </View>
      </View>
      {loading ? (
        <AddressShimmer />
      ) : cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <View>
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
            {cartItems.map(item => (
              <View key={item.id} style={styles.card}>
                <Image source={item.image} style={styles.productImage} />
                <View style={styles.details}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.priceAndStepper}>
                    <View style={styles.priceWrapper}>
                      <Text style={styles.price}>₹{item.price}</Text>
                      <View style={styles.mrpDiscountContainer}>
                        <Text style={styles.mrp}>MRP ₹{item.price}</Text>
                        <Text style={styles.discount}>(70% Off)</Text>
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

                      {updatingId === item.id ? (
                        <ActivityIndicator size="small" color="#FFA500" />
                      ) : (
                        <Text style={styles.quantity}>{item.quantity}</Text>
                      )}

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
                  <ActivityIndicator size="small" color="#FFA500" />
                ) : (
                  <TouchableOpacity
                    style={styles.trashIcon}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Trash2 size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
                />
                <TouchableOpacity activeOpacity={1}>
                  <Text style={styles.applyBtn}>APPLY</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.allCouponsRow}
                onPress={() => setShowAllCoupons(!showAllCoupons)}
              >
                <Text style={styles.checkAllCoupons}>
                  {showAllCoupons ? 'Hide Coupons' : 'Check All Coupons'}
                </Text>
              </TouchableOpacity>

              {showAllCoupons && (
                <View style={styles.couponChipsWrapper}>
                  {coupons.map(coupon => {
                    const isSelected = appliedCoupon?.code === coupon.code;

                    return (
                      <View
                        key={coupon._id}
                        style={[
                          styles.couponChip,
                          isSelected && styles.selectedCouponChip,
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.selectedChipText,
                          ]}
                        >
                          {coupon.code}
                        </Text>
                        <TouchableOpacity
                          style={styles.applyCouponBtn}
                          onPress={() => {
                            if (isSelected) {
                              setAppliedCoupon(null);
                            } else {
                              handleCouponApply(coupon);
                            }
                          }}
                        >
                          <Text style={styles.chipBtn}>
                            {isSelected ? 'Remove' : 'Apply'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {couponError && (
                <Text style={styles.couponError}>{couponError}</Text>
              )}
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
                <Text style={styles.label}>CESS</Text>
                <Text style={styles.value}>₹{cess.toFixed(2)}</Text>
              </View>

              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.label}>Shipping Charges</Text>
                  <Text style={styles.subText}>To be applied at checkout</Text>
                </View>
                <Text style={styles.freeText}>FREE</Text>
              </View>

              <View style={styles.dashedLine} />

              <View style={styles.priceRow}>
                <Text style={styles.totalPay}>To Pay</Text>
                <Text style={styles.totalPayAmount}>
                  ₹{totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.fixedBottomButtonWrapper}>
                <TouchableOpacity
                  style={styles.payNowButton}
                  onPress={() => {
                    console.log(
                      'Proceeding to payment of ₹' + totalPrice.toFixed(2),
                    );
                  }}
                >
                  <Text style={styles.payNowText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#FFF8EE',
  },
  headerWrapper: {
    backgroundColor: '#FEF5E7',
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
  },
  productImage: {
    width: 60,
    height: 100,
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
  tag: {
    backgroundColor: '#004E6A33',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
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
    backgroundColor: 'white',
    borderColor: '#FFA500',
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
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
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
  allCouponsRow: {
    borderTopWidth: 1,
    borderTopColor: '#FFA500',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderStyle: 'dashed',
  },
  checkAllCoupons: {
    color: '#FFA500',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  arrow: {
    color: '#FFA500',
    fontSize: 20,
    marginLeft: 8,
  },
  priceDetailsWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFA500',
    padding: 16,
    marginBottom: 250,
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
    borderColor: '#FFA500',
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
  couponChipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 10,
  },
  couponChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
    marginRight: 10,
  },
  chipBtn: {
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#FFA500',
  },
  fixedBottomButtonWrapper: {
    bottom: 0,
    left: 0,
    right: 0,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },

  payNowButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },

  payNowText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
  },
});
