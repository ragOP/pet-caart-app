import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import BottomSheet from 'react-native-raw-bottom-sheet';
import { getCoupons } from '../../apis/getCoupons';

const OffersBottomSheet = ({ innerRef }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCoupons();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setOffers(response.data.data);
      }
    } catch (e) {
      console.error('Offers load error:', e);
      setError('Unable to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const renderOffer = ({ item }) => (
    <View style={styles.offerItem}>
      <ImageBackground
        source={require('../../assets/images/cpnbg.png')}
        style={styles.offerBackground}
        imageStyle={styles.offerImage}
      >
        <View style={styles.offerInner}>
          <Text style={styles.offerDesc}>
            {item.discountType === 'fixed'
              ? `${item.discountValue} off`
              : `${item.discountValue}% off`}
            {item.maxDiscount ? `, max ₹${item.maxDiscount}` : ''}
          </Text>
          <Text style={styles.offerCondition}>
            {item.minPurchase
              ? `Above ₹${item.minPurchase}`
              : 'No minimum order'}
          </Text>
        </View>
      </ImageBackground>
    </View>
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
      <View style={styles.offerHeader}>
        <Image
          source={require('../../assets/icons/cpn.png')}
          style={{ width: 20, height: 20 }}
        />
        <Text style={styles.header}>Offers & Coupons</Text>
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
          data={offers}
          renderItem={renderOffer}
          keyExtractor={item => String(item.id)}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyMsg}>No offers available</Text>
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
  offerHeader: {
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
  offerItem: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  offerBackground: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    height: 100,
  },
  offerImage: {
    resizeMode: 'cover',
  },
  offerInner: {
    flex: 1,
    justifyContent: 'center',
  },
  offerDesc: {
    color: '#fff',
    marginBottom: 2,
    fontFamily: 'Gotham-Rounded-Medium',
    fontSize: 16,
  },
  offerCondition: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  center: {
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  emptyMsg: {
    color: '#888',
    marginBottom: 16,
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default OffersBottomSheet;
