import React from 'react';
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

const OrderDetailsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />
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
              ORDER ID : <Text style={styles.boldText}>2548514851</Text>
            </Text>
            <TouchableOpacity>
              <Text style={styles.helpText}>HELP</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.deliveredText}>DELIVERED | 10-05-2025</Text>
        </View>
        <Text style={styles.sectionTitle}>ITEM DETAILS</Text>
        <View style={styles.itemCard}>
          <Image
            source={require('../../assets/images/product.png')}
            style={styles.productImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle}>
              Applod Crunch-a-Licious Gluten Free Chicken & Cheese Dog Biscuits
            </Text>
            <Text style={styles.brand}>Applod</Text>
            <View style={styles.tagRow}>
              <Text style={styles.tagText}>14×3Kg | 10% OFF</Text>
            </View>
          </View>
          <Text style={styles.price}>₹109</Text>
        </View>
        <Text style={styles.sectionTitle}>TOTAL ORDER BILL DETAILS</Text>
        <View style={styles.billCard}>
          <BillRow label="Total MRP Price" value="₹109" />
          <BillRow label="Coupon Discount" value="₹109" />
          <BillRow label="Discount on MRP" value="₹109" />
          <BillRow label="Shipping Charges" value="FREE" isFree />
          <View style={styles.separator} />
          <BillRow label="Grand Total" value="₹109" isBold />
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
    backgroundColor: '#FEF5E7',
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
    fontFamily: 'Gotham-Rounded-Medium',
  },
  orderInfoCard: {
    backgroundColor: '#F59A111A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
  deliveredText: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#888',
    paddingLeft: 12,
  },
  subHeader: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    marginVertical: 10,
    fontFamily: 'Gotham-Rounded-Medium',
    borderBottomWidth: 0.2,
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
    width: 50,
    height: 70,
    resizeMode: 'contain',
    marginRight: 10,
  },
  productTitle: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 4,
    color: '#000',
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
  price: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000',
    marginLeft: 10,
    marginTop: 2,
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
});

export default OrderDetailsScreen;
