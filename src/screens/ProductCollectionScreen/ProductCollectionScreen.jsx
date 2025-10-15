// screens/ProductCollectionScreen.js

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

const LIFE_STAGE_LABELS = {
  puppy: 'puppy',
  adult: 'adult',
  starter: 'starter',
  kitten: 'kitten',
};

export default function ProductCollectionScreen({ route, navigation }) {
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
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState([]);
  const [selectedLifeStage, setSelectedLifeStage] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState([]);
  const [selectedBreedSize, setSelectedBreedSize] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  useEffect(() => {
    fetchCollections();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [
    categorySlug,
    collectionSlug,
    selectedBrand,
    selectedBreed,
    selectedLifeStage,
    selectedProductType,
    selectedBreedSize,
    searchQuery,
    sortOrder,
    isVeg,
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
  const norm = v =>
    String(v || '')
      .trim()
      .toLowerCase();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { categorySlug, collectionSlug };
      if (selectedBrand?.length) params.brandSlug = selectedBrand.join(',');
      if (selectedBreed?.length) params.breedSlug = selectedBreed.join(',');
      if (selectedLifeStage?.length)
        params.lifeStage = selectedLifeStage.join(',');
      if (selectedProductType?.length)
        params.productType = selectedProductType.join(',');
      if (selectedBreedSize?.length)
        params.breedSize = selectedBreedSize.join(',');
      const res = await getProducts(params);
      const fetchedProducts = res?.data?.data || [];
      setAllCollectionProducts(fetchedProducts);
      let filtered = fetchedProducts;
      if (isVeg) {
        filtered = filtered.filter(product => product.isVeg === true);
        // console.log('Filtered products (veg):', filtered);
      }
      if (searchQuery && String(searchQuery).trim() !== '') {
        const searchTerm = norm(searchQuery);
        filtered = filtered.filter(product => {
          const matchesTitle = norm(product.title).includes(searchTerm);
          const matchesDesc = norm(product.description).includes(searchTerm);
          const matchesBrand = norm(product.brandId?.name).includes(searchTerm);
          const matchesCategory = norm(product.categoryId?.name).includes(
            searchTerm,
          );
          const matchesSubCategory = norm(product.subCategoryId?.name).includes(
            searchTerm,
          );
          const matchesBreed = (product.breedId || []).some(b =>
            norm(b.name).includes(searchTerm),
          );
          const productLifeStages = Array.isArray(product.lifeStage)
            ? product.lifeStage
            : product.lifeStage
            ? [product.lifeStage]
            : [];
          const matchesLifeStageField = productLifeStages
            .map(ls => norm(ls))
            .some(ls => ls.includes(searchTerm));
          const matchesLifeStageLabel = Object.values(LIFE_STAGE_LABELS).some(
            ls => norm(ls).includes(searchTerm),
          );
          const matchesType = norm(product.productType).includes(searchTerm);
          const matchesSize = norm(product.breedSize).includes(searchTerm);
          return (
            matchesTitle ||
            matchesDesc ||
            matchesBrand ||
            matchesCategory ||
            matchesSubCategory ||
            matchesBreed ||
            matchesLifeStageField ||
            matchesLifeStageLabel ||
            matchesType ||
            matchesSize
          );
        });
      }
      filtered = filtered.filter(product => {
        const brandMatches =
          !selectedBrand?.length ||
          (product.brandId?.slug &&
            selectedBrand.includes(product.brandId.slug));
        const breedMatches =
          !selectedBreed?.length ||
          (product.breedId || []).some(b => selectedBreed.includes(b.slug));
        const productLifeStages = Array.isArray(product.lifeStage)
          ? product.lifeStage
          : product.lifeStage
          ? [product.lifeStage]
          : [];
        const normalizedProductStages = productLifeStages.map(v => norm(v));
        const normalizedSelectedStages = (selectedLifeStage || []).map(v =>
          norm(v),
        );
        const lifeStageMatches =
          !normalizedSelectedStages.length ||
          normalizedProductStages.some(ls =>
            normalizedSelectedStages.includes(ls),
          );
        const typeVal = norm(product.productType);
        const normalizedSelectedTypes = (selectedProductType || []).map(v =>
          norm(v),
        );
        const typeMatches =
          !normalizedSelectedTypes.length ||
          normalizedSelectedTypes.includes(typeVal);
        const sizeVal = norm(product.breedSize);
        const normalizedSelectedSizes = (selectedBreedSize || []).map(v =>
          norm(v),
        );
        const sizeMatches =
          !normalizedSelectedSizes.length ||
          normalizedSelectedSizes.includes(sizeVal);
        return (
          brandMatches &&
          breedMatches &&
          lifeStageMatches &&
          typeMatches &&
          sizeMatches
        );
      });
      const getPriceNum = p => {
        const v = p?.salePrice ?? p?.price ?? 0;
        const n = typeof v === 'string' ? parseFloat(v) : Number(v);
        return Number.isFinite(n) ? n : 0;
      };

      if (sortOrder) {
        if (sortOrder === 'lowToHigh') {
          filtered = [...filtered].sort(
            (a, b) => getPriceNum(a) - getPriceNum(b),
          );
        } else if (sortOrder === 'highToLow') {
          filtered = [...filtered].sort(
            (a, b) => getPriceNum(b) - getPriceNum(a),
          );
        }
      }
      console.log('Final products to render:', filtered);
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
  const handleBrandChange = brandSlugs => {
    setSelectedBrand(Array.isArray(brandSlugs) ? brandSlugs : []);
  };
  const handleBreedChange = breedSlugs => {
    setSelectedBreed(Array.isArray(breedSlugs) ? breedSlugs : []);
  };
  const handleLifeStageChange = lifeStages => {
    setSelectedLifeStage(Array.isArray(lifeStages) ? lifeStages : []);
  };
  const handleProductTypeChange = types => {
    setSelectedProductType(Array.isArray(types) ? types : []);
  };
  const handleBreedSizeChange = sizes => {
    setSelectedBreedSize(Array.isArray(sizes) ? sizes : []);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />
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
      <Text style={styles.subcategoryNameText}>{subcategoryName}</Text>

      <View style={styles.filterBarWrapper}>
        <FilterBar
          selectedBrand={selectedBrand}
          selectedBreed={selectedBreed}
          selectedLifeStage={selectedLifeStage}
          selectedProductType={selectedProductType}
          selectedBreedSize={selectedBreedSize}
          setSelectedBrand={handleBrandChange}
          setSelectedBreed={handleBreedChange}
          setSelectedLifeStage={handleLifeStageChange}
          setSelectedProductType={handleProductTypeChange}
          setSelectedBreedSize={handleBreedSizeChange}
          isVeg={isVeg}
          setIsVeg={setIsVeg}
          collectionName={collectionName}
          sortOrder={sortOrder}
          onChangeSort={setSortOrder}
        />
      </View>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 54,
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
  productCardWrapper: { width: '48%' },
  filterBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
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
  circleSelected: { borderColor: '#F17521' },
  image: { width: 52, height: 52, borderRadius: 8 },
  label: { fontSize: 13, color: '#888', textAlign: 'center' },
  labelSelected: { color: '#F17521', fontFamily: 'Gotham-Rounded-Bold' },
  underline: {
    position: 'absolute',
    bottom: -8,
    width: 100,
    height: 3,
    backgroundColor: '#F17521',
    borderRadius: 4,
  },
  subcategoryNameText: {
    color: '#F59A11',
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    marginHorizontal: 15,
    marginVertical: 8,
  },
});
