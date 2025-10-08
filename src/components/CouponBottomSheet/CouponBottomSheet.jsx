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

  const renderCoupon = ({ item }) => {
    const isApplied = appliedCoupon?.id === item.id;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.couponItem, isApplied && styles.selectedCoupon]}
        onPress={() => handleCouponPress(item)}
      >
        <ImageBackground
          source={require('../../assets/images/cpnbg.png')}
          style={styles.couponBackground}
          imageStyle={styles.couponImage}
        >
          <View style={styles.ticketWrapper}>
            <View style={styles.leftTicket}>
              <View style={styles.leftInner}>
                <Text style={styles.discountBig}>DISCOUNT{'\n'}COUPON</Text>
                <Text style={styles.validText}>
                  VALID UNTIL <Text style={styles.bold}>JULY 12</Text>TH
                </Text>
              </View>
            </View>

            <View style={styles.rightTicket}>
              <Text style={styles.voucherText}>VOUCHER</Text>
              <Text style={styles.discountPercent}>{item.discountValue}%</Text>
              <Text style={styles.discountWord}>DISCOUNT</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleCouponPress(item)}
              >
                <Text style={styles.applyButtonText}>
                  {isApplied ? 'REMOVE' : 'APPLY'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

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
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    color: '#005973',
    fontFamily: 'Gotham-Rounded-Medium',
    fontSize: 14,
  },
  couponItem: {
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 16,
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
    // justifyContent: 'space-between',
    borderRadius: 16,
  },
  couponImage: {
    resizeMode: 'stretch',
    borderRadius: 16,
  },
  ticketWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftTicket: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  rightTicket: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBig: {
    fontSize: 25,
    color: '#4E3B02',
    fontFamily: 'HoltwoodOneSC',
    textAlign: 'center',
  },
  validText: {
    color: '#4E3B02',
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  bold: {},
  voucherText: {
    color: '#222',
    fontFamily: 'Gotham-Rounded-Medium',
    marginTop: 20,
  },
  discountPercent: {
    fontFamily: 'HoltwoodOneSC',
    fontSize: 16,
    color: '#4E3B02',
    justifyContent: 'center',
    alignContent: 'center',
  },
  discountWord: {
    color: '#4E3B02',
    fontFamily: 'HoltwoodOneSC',
    fontSize: 12,
    color: '#4E3B02',
  },
  center: {
    // marginTop: 24,
    // justifyContent: 'center',
    // alignItems: 'center',
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
