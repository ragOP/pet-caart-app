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
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  CreditCard,
  Package,
  Wallet,
  Copy,
} from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

const formatBillDate = iso => {
  try {
    const d = new Date(iso);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return d.toLocaleString('en-IN', options).replace(',', '');
  } catch {
    return '';
  }
};

const formatINR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currency = v => {
  if (typeof v === 'number') return formatINR.format(v);
  if (!v && v !== 0) return '—';
  const n = Number(v);
  return Number.isFinite(n) ? formatINR.format(n) : '—';
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

const pickTitle = it => {
  const p = it?.productId;
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
  const transaction = order?.transcation || {};

  const bill = useMemo(() => {
    const totalMRP = Number(order?.totalMRP ?? 0);
    const rawPrice = Number(order?.rawPrice ?? 0);
    const discountOnMRP = totalMRP > 0 ? totalMRP - rawPrice : 0;
    const walletDiscount = Number(order?.walletDiscount ?? 0);
    const shippingCharge = Number(order?.shippingCharge ?? 0);
    const grand = Number(order?.totalAmount ?? 0);

    return {
      totalMRP,
      discountOnMRP,
      walletDiscount,
      shippingCharge,
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

  const handleCopyAwb = () => {
    const awb = order?.awbNumber;
    if (awb && awb !== 0) {
      Clipboard.setString(awb.toString());
      // Alert.alert('Copied', 'AWB Number copied to clipboard');
    }
  };

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
        {/* Order Info Card */}
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
            <Text style={[styles.statusText, { color: palette.text }]}>
              {(order?.status || '').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Item Details Section */}
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

        {/* Delivery Address Section */}
        <View style={styles.sectionHeaderRow}>
          <MapPin size={20} color="#D4AF37" />
          <Text style={styles.sectionTitleWithIcon}>DELIVERY ADDRESS</Text>
        </View>
        <View style={styles.addressCard}>
          <Text style={styles.addressName}>{order?.address?.name || '—'}</Text>
          <Text style={styles.addressLine}>
            {order?.address?.mobile || '—'} • {order?.address?.email || '—'}
          </Text>
          <Text style={styles.addressLine}>{addressLine || '—'}</Text>
        </View>

        {/* Payment Information Section */}
        <View style={styles.sectionHeaderRow}>
          <CreditCard size={20} color="#D4AF37" />
          <Text style={styles.sectionTitleWithIcon}>PAYMENT INFORMATION</Text>
        </View>
        <View style={styles.paymentCard}>
          <InfoRow
            label="Payment Method ID"
            value={transaction?.paymentMethod || 'razorpay'}
          />
          <InfoRow
            label="Transaction ID"
            value={transaction?.razorpayPaymentId || '—'}
          />
          <InfoRow
            label="Razorpay Order ID"
            value={transaction?.razorpayOrderId || '—'}
          />
          <InfoRow
            label="Payment Status"
            value={
              (transaction?.status || order?.status || 'pending')
                .charAt(0)
                .toUpperCase() +
              (transaction?.status || order?.status || 'pending').slice(1)
            }
            isStatus
            statusColor="#1AA75D"
          />
        </View>

        {/* Order Information Section */}
        <View style={styles.sectionHeaderRow}>
          <Package size={20} color="#D4AF37" />
          <Text style={styles.sectionTitleWithIcon}>ORDER INFORMATION</Text>
        </View>
        <View style={styles.orderInfoDetailCard}>
          <InfoRow
            label="Order Date"
            value={formatBillDate(order?.createdAt)}
          />
          <InfoRow label="Order Weight" value={`${order?.weight || 0} kg`} />
          <InfoRow
            label="Awb Number"
            value={order?.awbNumber || 0}
            showCopy
            onCopy={handleCopyAwb}
          />
        </View>

        {/* Cashback Banner */}
        {order?.cashBackOnOrder > 0 && (
          <View style={styles.cashbackBanner}>
            <Wallet size={18} color="#1AA75D" />
            <Text style={styles.cashbackText}>
              Cashback Earned On this order (+{currency(order.cashBackOnOrder)})
            </Text>
          </View>
        )}

        {/* Total Order Bill Details */}
        <Text style={styles.sectionTitle}>TOTAL ORDER BILL DETAILS</Text>
        <View style={styles.billCard}>
          <BillRow label="Total MRP Price" value={currency(bill.totalMRP)} />
          <BillRow
            label="Discount on MRP Price"
            value={currency(bill.discountOnMRP)}
          />
          <BillRow
            label="Wallet Discount"
            value={
              bill.walletDiscount > 0
                ? `- ${currency(bill.walletDiscount)}`
                : currency(0)
            }
            isDiscount={bill.walletDiscount > 0}
          />
          <BillRow
            label="Delivery Charges"
            value={currency(bill.shippingCharge)}
          />
          <View style={styles.separator} />
          <BillRow label="Grand Total" value={currency(bill.grand)} isBold />
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value, isStatus, statusColor, showCopy, onCopy }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoValueContainer}>
      <Text
        style={[
          styles.infoValue,
          isStatus && {
            color: statusColor || '#1AA75D',
            fontFamily: 'Gotham-Rounded-Bold',
          },
        ]}
      >
        {value}
      </Text>
      {showCopy && value && value !== 0 && (
        <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
          <Copy size={16} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const BillRow = ({ label, value, isBold, isDiscount }) => (
  <View style={styles.billRow}>
    <Text style={[styles.billLabel, isBold && styles.boldText]}>{label}</Text>
    <Text
      style={[
        styles.billValue,
        isDiscount && styles.discountText,
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
    marginTop: 10,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
    paddingLeft: 12,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 8,
    paddingLeft: 12,
  },
  sectionTitleWithIcon: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
  },

  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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

  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressName: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Gotham-Rounded-Bold',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
  },

  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  orderInfoDetailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
    flex: 1,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  infoValue: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'Gotham-Rounded-Medium',
    textAlign: 'right',
  },
  copyButton: {
    padding: 4,
  },

  cashbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1AA75D15',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    gap: 8,
  },
  cashbackText: {
    fontSize: 13,
    color: '#1AA75D',
    fontFamily: 'Gotham-Rounded-Bold',
    flex: 1,
  },

  billCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
  discountText: {
    color: '#E53935',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  separator: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#EEE',
    marginVertical: 10,
  },
});

export default OrderDetailsScreen;
