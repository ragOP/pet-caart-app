import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';

const formatBillDate = iso => {
  try {
    const d = new Date(iso);
    const dd = d.getDate().toString().padStart(2, '0');
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return '';
  }
};

const formatINR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}); // [web:6][web:12][web:15]

const currency = v => {
  if (typeof v === 'number') return formatINR.format(v);
  if (!v && v !== 0) return '—';
  const n = Number(v);
  return Number.isFinite(n) ? formatINR.format(n) : '—';
}; // [web:6][web:12][web:15]

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

const pickTitle = it => {
  const p = it?.productId;
  if (it?.variantId?.variantName) return it.variantId.variantName;
  if (p?.title) return p.title;
  if (p?.name) return p.name;
  if (it?.variantId?.sku) return it.variantId.sku;
  return 'Order item';
};

const pickBrand = it => it?.productId?.brand || it?.productId?.vendor || '';

const pickImageUrl = it => {
  const vImg = it?.variantId?.images?.[0];
  const pImg = it?.productId?.images?.[0];
  return (
    (typeof vImg === 'string' && vImg) ||
    (typeof pImg === 'string' && pImg) ||
    null
  );
};

const OrderDetailsScreen = ({ navigation }) => {
  const { params } = useRoute();
  const order = params?.order || {};
  const bill = useMemo(() => {
    const items = Array.isArray(order?.items) ? order.items : [];
    const subtotal = items.reduce((sum, it) => {
      const price = Number(it?.price ?? it?.variantId?.price ?? 0);
      const qty = Number(it?.quantity ?? 1);
      return sum + price * qty;
    }, 0);
    const couponDiscount = Number(
      order?.discountedAmount ?? order?.couponDiscount ?? 0,
    );
    const providedShipping = Number(order?.shipping ?? 0);
    const grand = Number.isFinite(Number(order?.totalAmount))
      ? Number(order.totalAmount)
      : Math.max(0, subtotal - couponDiscount + providedShipping);

    const computedShipping = Math.max(0, grand - subtotal);

    return {
      subtotal,
      couponDiscount,
      shippingForDisplay: computedShipping,
      grand,
    };
  }, [order]);

  const palette = statusPalette(order?.status);

  const addressLine = (() => {
    const a = order?.address || {};
    const parts = [a?.address, a?.city, a?.state, a?.country, a?.pincode]
      .map(s => (typeof s === 'string' ? s.trim() : s))
      .filter(Boolean);
    return parts.join(', ');
  })();

  const isShippingFree = Math.abs(bill.grand - bill.subtotal) < 0.005;

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
              <ArrowLeft size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.header}>My Orders</Text>
          </View>
        </SafeAreaView>
      </View>

      <Text style={styles.subHeader}>Recent Orders</Text>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <View style={styles.orderInfoCard}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderIdText}>
              ORDER ID :{' '}
              <Text style={styles.boldText}>{order?.orderId || '—'}</Text>
            </Text>
            <TouchableOpacity>
              <Text style={styles.helpText}>HELP</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: palette.bg }]}>
            <View style={styles.statusIconWrap}>
              <CheckCircle size={14} color={palette.icon} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={[styles.statusText, { color: palette.text }]}>
                {(order?.status || '').toUpperCase()}
              </Text>
            </View>
          </View>
          {/* <Text style={[styles.statusText, { color: palette.text }]}>
            {formatBillDate(order?.createdAt)}
          </Text> */}
        </View>

        <Text style={styles.sectionTitle}>ITEM DETAILS</Text>
        {(order?.items || []).map((it, idx) => {
          const title = pickTitle(it);
          const brand = pickBrand(it);
          const imageUrl = pickImageUrl(it);
          const qty = Number(it?.quantity ?? 1);
          const productLabel = it?.productId?.productLabel;

          const tagBits = [];
          if (qty) tagBits.push(`${qty}×`);
          if (productLabel) tagBits.push(productLabel);
          const tagText = tagBits.join(' | ');

          return (
            <View key={it?._id ?? idx} style={styles.itemCard}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.productImage} />
              ) : (
                <View
                  style={[styles.productImage, { backgroundColor: '#F1F5F9' }]}
                />
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.productTitle}>{title}</Text>
                {!!brand && <Text style={styles.brand}>{brand}</Text>}

                {!!tagText && (
                  <View style={styles.tagRow}>
                    <Text style={styles.tagText}>{tagText}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        <Text style={styles.sectionTitle}>TOTAL ORDER BILL DETAILS</Text>
        <View style={styles.billCard}>
          <BillRow label="Total MRP Price" value={currency(bill.subtotal)} />
          <BillRow
            label="Coupon Discount"
            value={
              bill.couponDiscount
                ? `- ${currency(bill.couponDiscount)}`
                : currency(0)
            }
          />
          <BillRow
            label="Shipping Charges"
            value={isShippingFree ? 'FREE' : currency(bill.shippingForDisplay)}
            isFree={isShippingFree}
          />
          <View style={styles.separator} />
          <BillRow label="Grand Total" value={currency(bill.grand)} isBold />
        </View>

        {/* Address under Grand Total */}
        <View style={styles.addressCard}>
          <Text style={styles.addressTitle}>DELIVERY ADDRESS</Text>
          <Text style={styles.addressLine}>
            {order?.address?.name || '—'} • {order?.address?.mobile || '—'}
          </Text>
          <Text style={styles.addressLine}>{addressLine || '—'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const BillRow = ({ label, value, isFree, isBold }) => (
  <View style={styles.billRow}>
    <Text style={[styles.billLabel, isBold && styles.boldText]}>{label}</Text>
    <Text
      style={[
        styles.billValue,
        isFree && styles.freeText,
        isBold && styles.boldText,
      ]}
    >
      {value}
    </Text>
  </View>
);

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
  header: { fontSize: 24, fontFamily: 'Gotham-Rounded-Medium' },

  subHeader: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    marginVertical: 10,
    fontFamily: 'Gotham-Rounded-Medium',
    borderBottomWidth: 0.2,
    borderColor: '#E0E0E0',
  },

  orderInfoCard: {
    backgroundColor: '#F59A111A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    gap: 8,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdText: {
    color: '#555',
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  boldText: {
    color: '#000',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  helpText: {
    color: '#007AFF',
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Bold',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 6,
  },
  statusIconWrap: { transform: [{ translateY: 1 }] },
  statusText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Gotham-Rounded-Medium',
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#888',
    paddingLeft: 12,
  },

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 4,
    color: '#000',
    lineHeight: 18,
  },
  brand: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 6,
  },
  tagRow: {
    backgroundColor: '#F0F2F5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
  },

  billCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  billValue: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  freeText: {
    color: '#1AA75D',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  separator: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#EEE',
    marginVertical: 10,
  },

  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 12,
    gap: 6,
  },
  addressTitle: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Gotham-Rounded-Bold',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13,
    color: '#111',
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default OrderDetailsScreen;
