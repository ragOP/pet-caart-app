import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import BottomSheet from 'react-native-raw-bottom-sheet';
import { getCoupons } from '../../apis/getCoupons';

const CouponBottomSheet = ({
  innerRef,
  appliedCoupon,
  onSelectCoupon,
  onSheetClose,
}) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCoupons();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setCoupons(response.data.data);
      }
    } catch (e) {
      console.error('Coupon load error:', e);
      setError('Unable to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);
  const handleCouponPress = coupon => {
    const isSelected = appliedCoupon?.id === coupon.id;
    onSelectCoupon(isSelected ? null : coupon);
    onSheetClose();
  };
  const renderCoupon = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.couponItem,
        appliedCoupon?.id === item.id && styles.selectedCoupon,
      ]}
      onPress={() => handleCouponPress(item)}
    >
      <View style={styles.couponInner}>
        <Image
          source={require('../../assets/icons/cpn.png')}
          style={styles.couponIcon}
        />
        <View style={styles.couponDetails}>
          <Text style={styles.couponTitle}>{item.code}</Text>
          <Text style={styles.couponDesc}>
            {item.discountType === 'fixed'
              ? `${item.discountValue} off`
              : `${item.discountValue}% off`}
            {item.maxDiscount ? `, max ₹${item.maxDiscount}` : ''}
          </Text>
          <Text style={styles.couponCondition}>
            {item.minPurchase
              ? `Above ₹${item.minPurchase}`
              : 'No minimum order'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={innerRef}
      closeOnDragDown
      closeOnPressMask
      height={500}
      dragFromTopOnly
      customStyles={{
        container: styles.container,
        wrapper: styles.wrapper,
      }}
    >
      <Text style={styles.header}>Available Coupons</Text>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCoupon}
          keyExtractor={item => String(item.id)}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyMsg}>No coupons available</Text>
            </View>
          }
        />
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#004E6A',
    marginBottom: 16,
    textAlign: 'center',
  },
  couponItem: {
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
  selectedCoupon: {
    borderColor: '#FFA500',
    borderWidth: 2,
  },

  couponInner: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  couponIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  couponDetails: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  couponDesc: {
    color: '#555',
    marginBottom: 2,
  },
  couponCondition: {
    color: '#888',
    fontSize: 13,
  },
  center: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  emptyMsg: {
    color: '#888',
    marginBottom: 16,
  },
});

export default CouponBottomSheet;
