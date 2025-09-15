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
import FilterBar from '../../components/FilterBar/FilterBar';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductListScreen({ route, navigation }) {
  const { categorySlug, collectionSlug, collectionName, searchQuery } =
    route.params;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [allCollectionProducts, setAllCollectionProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);
  useEffect(() => {
    fetchProducts();
  }, [categorySlug, collectionSlug, selectedBrand, selectedBreed, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        categorySlug,
        collectionSlug,
      };
      if (selectedBrand) params.brandSlug = selectedBrand;
      if (selectedBreed) params.breedSlug = selectedBreed;

      const res = await getProducts(params);
      const fetchedProducts = res?.data?.data || [];
      setAllCollectionProducts(fetchedProducts);
      let filtered = fetchedProducts;
      if (searchQuery && searchQuery.trim() !== '') {
        const searchTerm = searchQuery.toLowerCase();
        filtered = fetchedProducts.filter(product => {
          const matchesTitle = product.title
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesDesc = product.description
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesBrand = product.brandId?.name
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesCategory = product.categoryId?.name
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesSubCategory = product.subCategoryId?.name
            ?.toLowerCase()
            .includes(searchTerm);
          const matchesBreed = product.breedId?.some(breed =>
            breed.name?.toLowerCase().includes(searchTerm),
          );
          return (
            matchesTitle ||
            matchesDesc ||
            matchesBrand ||
            matchesCategory ||
            matchesSubCategory ||
            matchesBreed
          );
        });
      }
      setProducts(filtered);
    } catch (error) {
      console.error('Product fetch error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchChange = query => {
    navigation.setParams({ ...route.params, searchQuery: query });
  };

  const handleBrandChange = brandSlug => {
    setSelectedBrand(brandSlug);
  };

  const handleBreedChange = breedSlug => {
    setSelectedBreed(breedSlug);
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
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.searchBar}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F5A500" />
      ) : (
        <ScrollView style={styles.screen}>
          <FilterBar
            collectionName={collectionName}
            selectedBrand={selectedBrand}
            selectedBreed={selectedBreed}
            setSelectedBrand={handleBrandChange}
            setSelectedBreed={handleBreedChange}
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
                    variants={product.variants}
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
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#888',
    alignSelf: 'center',
    fontSize: 16,
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
