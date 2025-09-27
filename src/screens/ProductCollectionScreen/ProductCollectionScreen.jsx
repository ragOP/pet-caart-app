import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts } from '../../apis/getProducts';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import { getCollection } from '../../apis/getCollection';
import ProductCollectionShimmer from '../../ui/Shimmer/ProductCollectionShimmer';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductCollectionScreeen({ route, navigation }) {
  const {
    categorySlug,
    collectionSlug,
    collectionName,
    searchQuery = '',
    subcategoryName,
    subcategoryId,
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [products, setProducts] = useState([]);
  const [allCollectionProducts, setAllCollectionProducts] = useState([]);
  const [collections, setCollections] = useState([]);

  // Multi-select arrays
  const [selectedBrand, setSelectedBrand] = useState([]); // array of brand slugs
  const [selectedBreed, setSelectedBreed] = useState([]); // array of breed slugs

  const [isGreenSwitchOn, setIsGreenSwitchOn] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    categorySlug,
    collectionSlug,
    JSON.stringify(selectedBrand), // ensure effect triggers on array changes
    JSON.stringify(selectedBreed),
    searchQuery,
    isGreenSwitchOn,
  ]);

  const fetchCollections = async () => {
    try {
      setLoadingCollections(true);
      const collectionData = await getCollection();
      if (collectionData?.data?.data) {
        setCollections(collectionData.data.data);
      }
    } catch (err) {
      console.error('Collection fetch error:', err);
    } finally {
      setLoadingCollections(false);
    }
  };

  const filteredCollections = collections
    .filter(coll => coll.subCategoryId === subcategoryId)
    .sort((a, b) => {
      if (a.slug === collectionSlug) return -1;
      if (b.slug === collectionSlug) return 1;
      return 0;
    });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { categorySlug, collectionSlug };

      // If API expects CSV strings, join arrays; if it accepts arrays, assign directly
      if (selectedBrand?.length) params.brandSlug = selectedBrand.join(',');
      if (selectedBreed?.length) params.breedSlug = selectedBreed.join(',');

      const res = await getProducts(params);
      const fetchedProducts = res?.data?.data || [];
      setAllCollectionProducts(fetchedProducts);

      // Local filtering pipeline
      let filtered = fetchedProducts;

      // Text search
      if (searchQuery && searchQuery.trim() !== '') {
        const searchTerm = String(searchQuery).toLowerCase();
        filtered = filtered.filter(product => {
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

      // Multi-select brand/breed filter
      filtered = filtered.filter(product => {
        const brandMatches =
          !selectedBrand?.length ||
          (product.brandId?.slug &&
            selectedBrand.includes(product.brandId.slug));

        const breedMatches =
          !selectedBreed?.length ||
          product.breedId?.some(b => selectedBreed.includes(b.slug));

        return brandMatches && breedMatches;
      });

      // Veg-only toggle
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

  // Receive arrays from FilterBar after Apply
  const handleBrandChange = brandSlugs => {
    setSelectedBrand(Array.isArray(brandSlugs) ? brandSlugs : []);
  };

  const handleBreedChange = breedSlugs => {
    setSelectedBreed(Array.isArray(breedSlugs) ? breedSlugs : []);
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
          { left: value ? 34 : 4, borderColor: value ? '#0a0' : '#9f9f9f' },
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

      {/* Header with back + search */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={1}
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

      <View style={styles.filterBarWrapper}>
        <Text style={styles.subcategoryNameText}>{subcategoryName}</Text>
        <GreenSwitchButton
          value={isGreenSwitchOn}
          onValueChange={setIsGreenSwitchOn}
        />
        <FilterBar
          selectedBrand={selectedBrand}
          selectedBreed={selectedBreed}
          setSelectedBrand={handleBrandChange}
          setSelectedBreed={handleBreedChange}
          collectionName={collectionName}
        />
      </View>

      {/* Body */}
      {loading ? (
        <ProductCollectionShimmer />
      ) : (
        <ScrollView style={styles.screen}>
          {loadingCollections ? (
            <Text style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
              Loading collections...
            </Text>
          ) : (
            <View
              style={{
                height: 115,
                backgroundColor: '#fff',
                justifyContent: 'center',
              }}
            >
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={filteredCollections}
                keyExtractor={item => item._id}
                contentContainerStyle={{
                  paddingLeft: 12,
                  paddingTop: 5,
                  alignItems: 'center',
                }}
                renderItem={({ item }) => {
                  const selected = item.slug === collectionSlug;
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[
                        styles.touchable,
                        {
                          marginRight: 18,
                          width: 90,
                          position: 'relative',
                          alignItems: 'center',
                        },
                      ]}
                      onPress={() =>
                        navigation.setParams({
                          ...route.params,
                          collectionSlug: item.slug,
                        })
                      }
                    >
                      <View
                        style={[
                          styles.circle,
                          selected
                            ? styles.circleSelected
                            : { borderColor: '#eee' },
                        ]}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={styles.image}
                          resizeMode="contain"
                        />
                      </View>
                      <Text
                        style={[styles.label, selected && styles.labelSelected]}
                      >
                        {item.name}
                      </Text>
                      {selected && <View style={styles.underline} />}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

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
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
  },

  filterBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },

  // Green switch
  switchWrapper: {
    width: 64,
    height: 30,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    width: 56,
    height: 24,
    borderRadius: 10,
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

  // Collections row
  touchable: { alignItems: 'center' },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 5,
  },
  circleSelected: {
    borderColor: '#F17521',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  label: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#F17521',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  underline: {
    position: 'absolute',
    bottom: -8,
    width: 100,
    height: 3,
    backgroundColor: '#F17521',
    borderRadius: 4,
  },

  subcategoryNameText: {
    color: '#181818',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    marginLeft: 8,
    marginRight: 8,
  },
});
