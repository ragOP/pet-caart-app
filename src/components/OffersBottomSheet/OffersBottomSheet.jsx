// OffersBottomSheet.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { getCoupons } from '../../apis/getCoupons';

const OffersBottomSheet = ({ innerRef }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!innerRef) return;
    innerRef.current = {
      present: () => modalRef.current?.present?.(),
      dismiss: () => modalRef.current?.dismiss?.(),
      expand: () => modalRef.current?.expand?.(),
      snapToIndex: i => modalRef.current?.snapToIndex?.(i),
    };
  }, [innerRef]);

  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCoupons();
        const list = res?.data?.data;
        setOffers(Array.isArray(list) ? list : []);
      } catch {
        setError('Unable to load offers. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={modalRef}
        index={0} // presented hone par first snap se start
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: '#ddd' }}
        backgroundStyle={styles.container}
        containerStyle={{ zIndex: 1000 }}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 16 }}>
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
              keyExtractor={it => String(it.id)}
              renderItem={({ item }) => (
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
              )}
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text style={styles.emptyMsg}>No offers available</Text>
                </View>
              }
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F59A1133',
    paddingBottom: 15,
    paddingTop: 8,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
    marginLeft: 8,
  },
  offerItem: { marginBottom: 12, overflow: 'hidden' },
  offerBackground: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    height: 100,
  },
  offerImage: { resizeMode: 'cover', borderRadius: 12 },
  offerInner: { flex: 1, justifyContent: 'center' },
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
  center: { marginTop: 24, justifyContent: 'center', alignItems: 'center' },
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
