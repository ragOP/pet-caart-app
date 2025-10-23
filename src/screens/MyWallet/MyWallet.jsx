import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWalletTransactions } from '../../apis/getWalletTransactions';
import { checkUserWallet } from '../../apis/checkUserWallet';
import AddressShimmer from '../../ui/Shimmer/AddressShimmer';
const MyWallet = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const spacing = Math.max(12, Math.min(20, width * 0.045));
  const cardRadius = Math.max(12, Math.min(16, width * 0.035));
  const amountFont = Math.max(24, Math.min(30, width * 0.09));
  const headerFont = Math.max(20, Math.min(24, width * 0.06));
  const sectionFont = Math.max(16, Math.min(18, width * 0.045));
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      setBalanceLoading(true);
      const res = await checkUserWallet();
      const amt = Number(res?.data?.walletBalance ?? 0);
      setBalance(Number.isNaN(amt) ? 0 : amt);
      setBalanceError(null);
    } catch (e) {
      setBalanceError('Failed to fetch wallet balance');
    } finally {
      setBalanceLoading(false);
    }
  }, []);
  const fetchPage = useCallback(
    async (pg = 1, replace = true) => {
      try {
        if (!refreshing) setLoading(true);
        const res = await getWalletTransactions({ page: pg, perPage });
        const inner = res?.data;
        const list = Array.isArray(inner?.data) ? inner.data : [];
        const totalCount = Number(inner?.total ?? 0);

        setTotal(totalCount);
        setItems(prev => (replace ? list : [...prev, ...list]));
        setPage(Number(inner?.page ?? pg));
        setError(null);
      } catch (e) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [perPage, refreshing],
  );
  useEffect(() => {
    fetchBalance();
    fetchPage(1, true);
  }, [fetchBalance, fetchPage]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBalance();
    fetchPage(1, true);
  }, [fetchBalance, fetchPage]);
  const onEndReached = useCallback(() => {
    const canLoadMore = items.length < total && !loading;
    if (canLoadMore) fetchPage(page + 1, false);
  }, [items.length, total, loading, page, fetchPage]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{item?.title ?? 'Transaction'}</Text>
        <Text style={styles.rowSub}>{item?.date ?? '-'}</Text>
      </View>
      <Text
        style={[
          styles.rowAmount,
          { color: (item?.amount ?? 0) >= 0 ? '#16a34a' : '#dc2626' },
        ]}
      >
        ₹{Math.abs(item?.amount ?? 0).toFixed(2)}
      </Text>
    </View>
  );

  const ListEmpty = useMemo(
    () => (
      <View
        style={[
          styles.emptyWrap,
          { minHeight: height * 0.45, paddingHorizontal: spacing },
        ]}
      >
        <Text style={styles.emptyText}>No transactions yet</Text>
      </View>
    ),
    [height, spacing],
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View
        style={[
          styles.headerRow,
          { paddingHorizontal: spacing, paddingVertical: spacing * 0.8 },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.header, { fontSize: headerFont }]}>My Wallet</Text>
      </View>

      <View style={[styles.topRow, { paddingHorizontal: spacing }]}>
        <Text style={styles.topLabel}>
          {balanceError ? 'Balance unavailable' : ''}
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing || loading || balanceLoading}
          accessibilityRole="button"
          accessibilityLabel="Refresh wallet"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[
            styles.refreshBtn,
            { opacity: refreshing || loading || balanceLoading ? 0.5 : 1 },
          ]}
          activeOpacity={0.6}
        >
          <RefreshCw size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.balanceCard,
          {
            marginHorizontal: spacing,
            paddingHorizontal: spacing,
            borderRadius: cardRadius,
          },
        ]}
      >
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <View style={styles.amountRow}>
          <Text style={[styles.currency, { fontSize: amountFont }]}>₹</Text>
          <Text style={[styles.amount, { fontSize: amountFont }]}>
            {balanceLoading ? '...' : Number(balance).toFixed(2)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.divider,
          { marginTop: spacing * 0.7, marginBottom: spacing * 0.5 },
        ]}
      />

      <View
        style={{ paddingHorizontal: spacing, paddingVertical: spacing * 0.5 }}
      >
        <Text style={[styles.sectionTitle, { fontSize: sectionFont }]}>
          Transaction History
        </Text>
      </View>

      {loading && items.length === 0 ? <AddressShimmer /> : null}

      {error && items.length === 0 && !loading ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchPage(1, true)}
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={items}
        keyExtractor={(item, idx) => String(item?.id ?? idx)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={!loading && !error ? ListEmpty : null}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={
          loading && items.length > 0 ? (
            <View style={{ paddingVertical: 14 }}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default MyWallet;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: { paddingRight: 12, paddingVertical: 6 },
  header: { fontWeight: 'bold', paddingLeft: 10, color: '#000' },
  topRow: {
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLabel: { color: '#111', fontSize: 14, opacity: 0.7 },
  refreshBtn: { padding: 6 },
  balanceCard: {
    backgroundColor: '#F59A11',
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  balanceLabel: { color: '#fff', opacity: 0.9, fontSize: 14, marginBottom: 6 },
  amountRow: { flexDirection: 'row', alignItems: 'flex-end' },
  currency: { color: '#fff', fontWeight: '700', marginRight: 4 },
  amount: { color: '#fff', fontWeight: '800', letterSpacing: 0.2 },
  divider: { height: 1, backgroundColor: '#F3E3CF' },
  sectionTitle: { fontWeight: '700', color: '#222' },

  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    backgroundColor: '#fff',
  },
  rowTitle: { color: '#222', fontWeight: '700' },
  rowSub: { color: '#6b7280', marginTop: 2 },
  rowAmount: { fontWeight: '800' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#8c9197', fontWeight: '600' },
  initialLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorBox: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#991b1b',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  retryBtn: {
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '700' },
});
