import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getProducts } from '../../apis/getProducts';

const EssentialSlider = ({
  headingIcon,
  headingTextOrange = 'Newly',
  headingTextBlue = 'Launched',
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (Array.isArray(response?.data?.data)) {
        setProducts(response.data.data);
      } else {
        setError('No products found');
      }
    } catch (error) {
      setError('Error fetching products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const groupedProducts = [];
  if (products.length) {
    for (let i = 0; i < products.length; i += 4) {
      groupedProducts.push(products.slice(i, i + 4));
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingVertical: 20 }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {headingIcon && (
        <View style={styles.headingContainer}>
          <Image
            source={headingIcon}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.headingText}>
            <Text style={styles.orange}>{headingTextOrange} </Text>
            <Text style={styles.blue}>{headingTextBlue}</Text>
          </Text>
        </View>
      )}
      {groupedProducts.map((row, rowIndex) => (
        <FlatList
          key={rowIndex}
          horizontal
          data={row}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image
                source={{
                  uri:
                    item.images?.[0] || item.variants?.[0]?.images?.[0] || '',
                }}
                style={styles.image}
                resizeMode="contain"
                onError={() => console.warn('Failed to load image', item.title)}
              />
              <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => item._id || `${rowIndex}_${index}`}
          showsHorizontalScrollIndicator={false}
          style={styles.sliderRow}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: { width: 35, height: 35, marginRight: 8 },
  headingText: { fontSize: 20, fontFamily: 'Gotham-Rounded-Bold' },
  orange: { color: '#f39c12', fontFamily: 'Gotham-Rounded-Bold' },
  blue: { color: '#3498db', fontFamily: 'Gotham-Rounded-Bold' },
  sliderRow: {
    marginVertical: 10,
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 8,
    width: 120,
  },
  image: {
    width: 120,
    height: 130,
  },
  text: {
    width: '100%',
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Gotham-Rounded-Bold',
    lineHeight: 20,
  },
});

export default EssentialSlider;
