import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator, // Import ActivityIndicator
  Linking,
} from 'react-native';
import { getAdBanner2 } from '../../apis/getAdBanner2';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const BakedProduct = ({ style }) => {
  const [bannerData, setBannerData] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdBanners = async () => {
      try {
        const response = await getAdBanner2();
        const banner = response?.data?.data;

        if (banner) {
          setBannerData({
            title: banner.title,
            description: banner.description,
            link: banner.link,
          });
          setProducts(banner.products);
        }
      } catch (error) {
        console.error('Error fetching Ad banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdBanners();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFA200" />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, style]}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.heading1}>{bannerData.title}</Text>
          <Text style={styles.subheading}>{bannerData.description}</Text>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.shopNowButton}
            onPress={() => Linking.openURL(bannerData.link)}
          >
            <Text style={styles.shopNowText}>Shop now</Text>
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <View style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product._id} item={product} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const ProductCard = ({ item }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: item.images[0] }}
      style={styles.productImage}
      resizeMode="contain"
    />
    <Text style={styles.productTitle} numberOfLines={2} ellipsizeMode="tail">
      {item.title}
    </Text>
    <Text style={styles.productPrice}>₹{item.salePrice}</Text>
    <TouchableOpacity activeOpacity={1} style={styles.addButton}>
      <Text style={styles.addButtonText}>Add</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF6C6',
    flex: 1,
    borderRadius: 12,
    margin: 10,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6C6',
  },
  wrapper: {
    padding: 8,
  },
  header: {
    marginBottom: 20,
  },
  heading1: {
    fontSize: 26,
    color: '#522100',
    textAlign: 'left',
    fontFamily: 'Gotham-Rounded-Bold',
    lineHeight: 30,
  },

  subheading: {
    fontSize: 17,
    color: '#333',
    marginTop: 10,
    textAlign: 'left',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  shopNowButton: {
    backgroundColor: '#0888B1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'transparent',
    width: CARD_WIDTH,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: '#0079A1',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 28,
    width: '88%',
  },
  addButtonText: {
    fontSize: 14,
    color: '#0079A1',
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default BakedProduct;
