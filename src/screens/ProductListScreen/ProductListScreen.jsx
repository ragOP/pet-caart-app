import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts } from '../../apis/getProducts';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import AdBannner from '../../components/AdBannner/AdBanner';
import FilterBar from '../../components/FilterBar/FilterBar';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductListScreen({ route, navigation }) {
  const { categorySlug, collectionSlug, collectionName } = route.params;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null); // brandSlug
  const [selectedBreed, setSelectedBreed] = useState(null); // breedSlug

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, collectionSlug, selectedBrand, selectedBreed]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { categorySlug, collectionSlug };
      if (selectedBrand) params.brandSlug = selectedBrand;
      if (selectedBreed) params.breedSlug = selectedBreed;
      const res = await getProducts(params);
      if (res?.data?.data) setProducts(res.data.data);
      else setProducts([]);
    } catch (error) {
      console.log('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF5E1"
        translucent={false}
      />
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={30} color="#000" />
          </TouchableOpacity>
          <SearchBar style={styles.searchBar} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F5A500" />
      ) : (
        <ScrollView style={styles.screen}>
          <AdBannner />
          <FilterBar
            collectionName={collectionName}
            selectedBrand={selectedBrand}
            selectedBreed={selectedBreed}
            setSelectedBrand={setSelectedBrand}
            setSelectedBreed={setSelectedBreed}
          />
          {products.length > 0 ? (
            <View style={styles.productContainer}>
              {products.map((product, index) => (
                <View
                  key={product._id}
                  style={[
                    styles.productCardWrapper,
                    index % 2 === 0 && { marginRight: 10 },
                  ]}
                >
                  <ProductCard
                    images={product.images}
                    title={product.title}
                    rating={product.ratings?.average}
                    price={product.salePrice}
                    discount={product.discount}
                    stock={product.stock}
                    brandId={product.brandId}
                    cardWidth={screenWidth * 0.46}
                    productId={product._id}
                    variantId={product.variants?.[0]?._id || null}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noProductsText}>No products found</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF6' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: { paddingRight: 15 },
  searchBar: { flex: 1 },
  screen: { backgroundColor: '#fff', marginTop: '5%' },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#888',
  },
  productContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
});
