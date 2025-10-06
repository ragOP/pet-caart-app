import React from 'react';
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
} from 'react-native';
import { ArrowLeft, CheckCircle, ChevronRight, Box } from 'lucide-react-native';

const orders = [
  // {
  //   id: '2548514851',
  //   date: '10ᵗʰ MAY 2025',
  //   title: 'Applod Crunch-a-Licious Gluten Free Chicken & Cheese Dog Biscuits',
  //   image:
  //     'https://res.cloudinary.com/doaggd1wa/image/upload/v1751724395/kbpcoekkcunumhlwmv2k.png', // Replace with actual image
  //   quantity: '14x3Kg',
  //   offer: '10% OFF',
  //   status: 'DELIVERED',
  // },
  // {
  //   id: '2548514851',
  //   date: '10ᵗʰ MAY 2025',
  //   title: 'Applod Crunch-a-Licious Gluten Free Chicken & Cheese Dog Biscuits',
  //   image:
  //     'https://res.cloudinary.com/doaggd1wa/image/upload/v1751724395/kbpcoekkcunumhlwmv2k.png',
  //   quantity: '14x3Kg',
  //   offer: '10% OFF',
  //   status: 'DELIVERED',
  // },
  // {
  //   id: '2548514851',
  //   date: '10ᵗʰ MAY 2025',
  //   title: 'Applod Crunch-a-Licious Gluten Free Chicken & Cheese Dog Biscuits',
  //   image:
  //     'https://res.cloudinary.com/doaggd1wa/image/upload/v1751724395/kbpcoekkcunumhlwmv2k.png',
  //   quantity: '14x3Kg',
  //   offer: '10% OFF',
  //   status: 'DELIVERED',
  // },
];
const MyOrderScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" />

      {/* Header */}
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
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconWrapper}>
            <Box size={50} color="#AAB2BD" strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven’t placed any orders yet. Start shopping to see your orders
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
        <>
          <ScrollView contentContainerStyle={styles.orderList}>
            {orders.map((order, index) => (
              <TouchableOpacity
                key={index}
                style={styles.orderCard}
                activeOpacity={1}
                onPress={() => navigation.navigate('OrderDetailsScreen')}
              >
                <Image
                  source={{ uri: order.image }}
                  style={styles.productImage}
                />
                <View style={styles.orderContent}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>
                      Order ID:{' '}
                      <Text style={styles.orderIdBold}>{order.id}</Text>
                    </Text>
                    <Text>|</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <Text style={styles.productTitle}>{order.title}</Text>
                  <View style={styles.deliveryRow}>
                    <View style={styles.statusBadge}>
                      <CheckCircle size={14} color="#1AA75D" />
                      <Text style={styles.statusText}>{order.status}</Text>
                    </View>
                  </View>
                  <View style={styles.orderBottomRow}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {order.quantity} | {order.offer}
                      </Text>
                    </View>
                    <ChevronRight color="#F59A11" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
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
  },
  orderList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#F59A110D',
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImage: {
    width: 60,
    height: 80,
    marginRight: 12,
    resizeMode: 'contain',
  },
  orderContent: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  orderDate: {
    fontSize: 12,
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  productTitle: {
    fontSize: 13,
    color: '#000',
    marginTop: 6,
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    backgroundColor: '#21803233',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#218032',
    fontFamily: 'Gotham-Rounded-Medium',
    marginLeft: 4,
  },
  orderBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#004E6A0D',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  // Empty UI
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
});

export default MyOrderScreen;
