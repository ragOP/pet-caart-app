import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Box,
  Scale,
  ImageIcon,
} from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../apis/getOrders';
import { reorder } from '../../apis/reorder';

const { width } = Dimensions.get('window');
const CARD_IMAGE_W = Math.min(84, Math.max(60, width * 0.2));
const CARD_IMAGE_H = Math.round(CARD_IMAGE_W * 1.33);

const formatUiDate = iso => {
  try {
    const d = new Date(iso);
    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'ˢᵗ'
        : day % 10 === 2 && day !== 12
        ? 'ⁿᵈ'
        : day % 10 === 3 && day !== 13
        ? 'ʳᵈ'
        : 'ᵗʰ';
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = d.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  } catch {
    return '';
  }
};

const primaryItem = order => (order?.items?.length ? order.items[0] : null);

const pickTitle = item => {
  // if (item?.variantId?.variantName) return item.variantId.variantName;
  if (item?.productId?.title) return item.productId.title;
  if (item?.productId?.name) return item.productId.name;
  if (item?.variantId?.sku) return item.variantId.sku;
  return 'Order item';
};

const toInitials = (text = '') => {
  const clean = String(text).trim();
  if (!clean) return 'PR';
  const words = clean.split(/\s+/).slice(0, 2);
  const letters = words.map(w => w[0]?.toUpperCase()).join('');
  return letters || 'PR';
};

const pickImage = (item, title) => {
  const vImg = item?.variantId?.images?.[0];
  const pImg = item?.productId?.images?.[0];
  const url =
    (typeof vImg === 'string' && vImg) ||
    (typeof pImg === 'string' && pImg) ||
    null;
  if (url) return { url, preview: null };
  return {
    url: null,
    preview: { initials: toInitials(title) },
  };
};

const qtyWeightChipText = (order, item) => {
  const qty = item?.quantity ?? 0;
  const orderKg = order?.weight != null ? Number(order.weight) : null;
  const variantGrams =
    item?.variantId?.weight != null ? Number(item.variantId.weight) : null;

  let weightStr = 'Weight N/A';
  if (!Number.isNaN(orderKg) && orderKg !== null) {
    weightStr = `${orderKg} kg`;
  } else if (!Number.isNaN(variantGrams) && variantGrams !== null) {
    weightStr =
      variantGrams >= 1000
        ? `${Math.round(variantGrams / 1000)} kg`
        : `${variantGrams} g`;
  }

  return `${qty}x • ${weightStr}`;
};

const statusPalette = status => {
  switch ((status || '').toLowerCase()) {
    case 'delivered':
    case 'confirmed':
      return { bg: '#21803233', text: '#218032', icon: '#1AA75D' };
    case 'shipped':
      return { bg: '#004E6A1A', text: '#004E6A', icon: '#004E6A' };
    case 'pending':
      return { bg: '#F59A111A', text: '#F59A11', icon: '#F59A11' };
    case 'cancelled':
    case 'canceled':
      return { bg: '#E539351A', text: '#E53935', icon: '#E53935' };
    default:
      return { bg: '#E0E0E033', text: '#555', icon: '#555' };
  }
};

const ProductImage = ({ item, title }) => {
  const { url, preview } = pickImage(item, title);
  if (url) return <Image source={{ uri: url }} style={styles.productImage} />;
  return (
    <View style={styles.previewBox}>
      <View style={styles.previewIconWrap}>
        <ImageIcon size={18} color="#64748B" />
      </View>
      <Text style={styles.previewInitials}>{preview.initials}</Text>
    </View>
  );
};

const MyOrderScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders', { page: 1, limit: 20 }],
    queryFn: () => {
      return getOrders({ params: { page: 1, limit: 20 } });
    },
    select: res => res?.data?.orders ?? [],
    staleTime: 30_000,
  });

  const {
    mutate: reorderMutate,
    isLoading: isReordering,
    variables: reorderVars,
  } = useMutation({
    mutationFn: ({ orderId }) => reorder({ orderId }),
    onMutate: vars => {},
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigation.navigate('BottomTabs', { screen: 'Cart' });
    },
    onError: (err, vars) => {},
    onSettled: (res, err, vars) => {
      console.log('[REORDER] settled. err?', !!err, 'vars:', vars);
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const orders = Array.isArray(data)
    ? [...data].sort(
        (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
      )
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>My Orders</Text>
          </View>
        </SafeAreaView>
      </View>

      <Text style={styles.subHeader}>Recent Orders</Text>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#F59A11" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Failed to load orders</Text>
          <TouchableOpacity
            style={styles.shopButton}
            activeOpacity={1}
            onPress={refetch}
          >
            <Text style={styles.shopButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconWrapper}>
            <Box size={50} color="#AAB2BD" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            activeOpacity={1}
            onPress={() => navigation.navigate('BottomTabs')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.orderList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#F59A11']}
              tintColor="#F59A11"
            />
          }
        >
          {orders.map((order, index) => {
            const item = primaryItem(order);
            const title = pickTitle(item);
            const palette = statusPalette(order?.status);
            const isThisOrderReordering =
              isReordering && reorderVars?.orderId === order?._id;

            return (
              <TouchableOpacity
                key={order?._id ?? index}
                style={styles.orderCard}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('OrderDetailsScreen', {
                    order,
                  })
                }
              >
                <View style={styles.leftCol}>
                  <ProductImage item={item} title={title} />
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.reorderBtnBelowImage,
                      isThisOrderReordering && styles.reorderBtnDisabled,
                    ]}
                    onPress={e => {
                      e.stopPropagation();
                      if (!order?._id) return;
                      reorderMutate({ orderId: order._id });
                    }}
                    disabled={isThisOrderReordering}
                  >
                    {isThisOrderReordering ? (
                      <ActivityIndicator size="small" color="#004E6A" />
                    ) : (
                      <Text style={styles.reorderText}>Reorder</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.orderContent}>
                  <Text style={styles.orderId}>
                    <Text style={styles.orderIdBold}>{order?.orderId}</Text>
                  </Text>

                  <Text numberOfLines={2} style={styles.productTitle}>
                    {title}
                  </Text>

                  <View style={styles.dateWeightRow}>
                    <Text style={styles.orderDate}>
                      {formatUiDate(order?.createdAt)}
                    </Text>
                    <View style={styles.qwChip}>
                      <Scale size={14} color="#004E6A" />
                      <Text style={styles.qwText}>
                        {qtyWeightChipText(order, item)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.footerRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: palette.bg },
                      ]}
                    >
                      <View style={styles.statusIconWrap}>
                        <CheckCircle size={14} color={palette.icon} />
                      </View>
                      <Text
                        style={[styles.statusText, { color: palette.text }]}
                      >
                        {(order?.status || '').toUpperCase()}
                      </Text>
                    </View>
                    <ChevronRight color="#F59A11" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: { paddingRight: 15 },
  header: {
    fontSize: 24,
    flex: 1,
    paddingLeft: 20,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  subHeader: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    marginVertical: 10,
    fontFamily: 'Gotham-Rounded-Medium',
    borderBottomWidth: 0.2,
    borderColor: '#E0E0E0',
  },
  orderList: { paddingHorizontal: 15, paddingBottom: 20 },
  orderCard: {
    backgroundColor: '#F59A110D',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  productImage: {
    width: CARD_IMAGE_W,
    height: CARD_IMAGE_H,
    resizeMode: 'contain',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  reorderBtnBelowImage: {
    marginTop: 8,
    backgroundColor: '#004E6A0D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'stretch',
    minWidth: CARD_IMAGE_W,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#004E6A22',
  },
  reorderBtnDisabled: { opacity: 0.6 },
  reorderText: {
    color: '#004E6A',
    fontSize: 12,
    fontFamily: 'Gotham-Rounded-Medium',
    letterSpacing: 0.2,
  },
  previewBox: {
    width: CARD_IMAGE_W,
    height: CARD_IMAGE_H,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  previewIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInitials: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Gotham-Rounded-Medium',
    letterSpacing: 0.5,
  },
  orderContent: { flex: 1, minWidth: 0, marginLeft: 4 },
  orderId: {
    fontSize: 13,
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  orderIdBold: {
    fontFamily: 'Gotham-Rounded-Medium',
    fontSize: 14,
    letterSpacing: 0.5,
    color: '#004E6A',
  },
  productTitle: {
    fontSize: 13,
    color: '#000',
    marginTop: 6,
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  dateWeightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  orderDate: {
    fontSize: 12,
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Medium',
    flexShrink: 1,
  },
  qwChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#004E6A0D',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 6,
  },
  qwText: {
    fontSize: 12,
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '7%',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    alignItems: 'center',
  },
  statusIconWrap: { transform: [{ translateY: 1 }] },
  statusText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    marginLeft: 4,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 60,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F3F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 8,
    color: '#000',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#6E7480',
    fontSize: 14,
    marginBottom: 30,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  shopButton: {
    backgroundColor: '#F59A11',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  centerBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  errorText: {
    fontSize: 14,
    color: '#E53935',
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default MyOrderScreen;
