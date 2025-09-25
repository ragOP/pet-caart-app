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
import ProductListShimmer from '../../ui/Shimmer/ProductListShimmer';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductListScreen({ route, navigation }) {
  const { categorySlug, collectionSlug, collectionName, searchQuery } =
    route.params;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [allCollectionProducts, setAllCollectionProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [isGreenSwitchOn, setIsGreenSwitchOn] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [
    categorySlug,
    collectionSlug,
    selectedBrand,
    selectedBreed,
    searchQuery,
    isGreenSwitchOn,
  ]);

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
      if (isGreenSwitchOn) {
        filtered = filtered.filter(product => product.isVeg === true);
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
  const GreenSwitchButton = ({ value, onValueChange }) => (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={1}
      style={styles.switchWrapper}
    >
      <View style={[styles.track]} />
      <View
        style={[
          styles.thumb,
          { left: value ? 34 : 4, borderColor: value ? '#0a0' : '#bbb' },
        ]}
      >
        <View
          style={[
            styles.thumbInner,
            { backgroundColor: value ? '#0a0' : '#9f9f9f' },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
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
            activeOpacity={1}
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
        <ProductListShimmer />
      ) : (
        <ScrollView style={styles.screen}>
          <View style={styles.filterBarWrapper}>
            <GreenSwitchButton
              value={isGreenSwitchOn}
              onValueChange={setIsGreenSwitchOn}
            />
            <FilterBar
              collectionName={collectionName}
              selectedBrand={selectedBrand}
              selectedBreed={selectedBreed}
              setSelectedBrand={handleBrandChange}
              setSelectedBreed={handleBreedChange}
            />
          </View>
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
                    isVeg={product.isVeg}
                    isBestSeller={product.isBestSeller}
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
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
  screen: { backgroundColor: '#fff' },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#888',
    alignSelf: 'center',
    fontSize: 16,
  },
  productContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    // marginBottom: 20,
  },
  filterBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    // justifyContent: 'space-between',
  },
  switchWrapper: {
    width: 64,
    height: 36,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    width: 56,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    left: 4,
    top: 6,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderWidth: 2,
    backgroundColor: '#fff',
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  thumbInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0a0',
  },
});
