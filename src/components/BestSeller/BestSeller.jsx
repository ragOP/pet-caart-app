import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { getProducts } from '../../apis/getProducts';
import ProductCard from '../ProductCard/ProductCard';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3) / 2;

const BestSeller = ({
  headingIcon,
  headingTextOrange = 'Bestsellers',
  headingTextBlue = 'Under ₹599',
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      if (Array.isArray(response?.data?.data)) {
        const bestSellers = response.data.data
          .filter(item => item.isBestSeller && Number(item.salePrice) < 599)
          .map(item => {
            const discountPercent = item.salePrice
              ? Math.round(((item.price - item.salePrice) / item.price) * 100)
              : 0;
            return {
              _id: item._id,
              title: item.title,
              rating: item.ratings?.average || 0,
              price: item.price,
              salePrice: item.salePrice,
              discount: discountPercent > 0 ? discountPercent + '%' : '0%',
              images: item.images || item.variants?.[0]?.images || [],
              isVeg: item.isVeg || false,
              stock: item.stock,
              brandId: item.brandId,
              variants: item.variants || [],
            };
          });
        setProducts(bestSellers);
      } else {
        setError('No products found');
      }
    } catch (error) {
      setError('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(headingIcon || headingTextOrange || headingTextBlue) && (
        <View style={styles.headingContainer}>
          {headingIcon && (
            <Image
              source={headingIcon}
              style={styles.iconImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.headingText}>
            <Text style={styles.orange}>{headingTextOrange} </Text>
            <Text style={styles.blue}>{headingTextBlue}</Text>
          </Text>
        </View>
      )}

      {products.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {products.map((item, index) => (
            <View
              key={`${item._id}_${index}`}
              style={[styles.cardWrapper, { width: CARD_WIDTH }]}
            >
              <ProductCard
                images={item.images}
                title={item.title}
                rating={item.rating}
                price={item.price}
                salePrice={item.salePrice}
                discount={item.discount}
                isVeg={item.isVeg}
                stock={item.stock}
                brandId={item.brandId}
                cardWidth={CARD_WIDTH}
                productId={item._id}
                variantId={item.variants?.[0]?._id || null}
                variants={item.variants}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>No bestsellers found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconImage: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  headingText: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  orange: {
    color: '#f39c12',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  blue: {
    color: '#3498db',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  scrollContent: {
    paddingRight: 12,
  },
  cardWrapper: {
    marginRight: 12,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#555',
  },
});

export default BestSeller;
