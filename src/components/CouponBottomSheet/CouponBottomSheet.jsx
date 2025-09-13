import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ImageBackground,
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
      <ImageBackground
        source={require('../../assets/images/cpnbg.png')}
        style={styles.couponBackground}
        imageStyle={styles.couponImage}
      >
        <View style={styles.couponInner}>
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

        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>APPLY</Text>
        </TouchableOpacity>
      </ImageBackground>
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
      <View style={styles.couponHeader}>
        <Image
          source={require('../../assets/icons/cpn.png')}
          style={{ width: 20, height: 20 }}
        />
        <Text style={styles.header}>Coupons & Offers</Text>
      </View>
      <View style={styles.couponInputWrapper}>
        <TextInput
          style={styles.couponInput}
          placeholder="Enter Coupon Code"
          placeholderTextColor="#999"
          editable={true}
        />

        <TouchableOpacity activeOpacity={1}>
          <Text style={styles.applyBtn}>APPLY</Text>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>APPLY</Text>
      </TouchableOpacity> */}

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

  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F59A1133',
    paddingBottom: 15,
  },
  header: {
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
    marginBottom: 20,
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
  applyButton: {
    backgroundColor: '#FF9900',
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  couponItem: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  selectedCoupon: {
    borderColor: '#FFA500',
    borderWidth: 2,
  },
  couponBackground: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',

    height: 120,
    justifyContent: 'space-between',
  },
  couponImage: {
    resizeMode: 'contain',
  },
  couponInner: {
    flex: 1,
    justifyContent: 'center',
  },
  couponTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  couponDesc: {
    color: '#fff',
    marginBottom: 2,
  },
  couponCondition: {
    color: '#fff',
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
