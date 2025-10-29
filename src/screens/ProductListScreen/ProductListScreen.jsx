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
} from 'react-native';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getProducts } from '../../apis/getProducts';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import ProductListShimmer from '../../ui/Shimmer/ProductListShimmer';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductListScreen({ route, navigation }) {
  const {
    categorySlug,
    collectionSlug,
    collectionName,
    searchQuery = '',
    subcategoryName,
    subcategoryId,
    initialBrandSlugs = [],
    brandSlug = null,
    categoryId = null,
    subCategorySlug = null,
  } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [allCollectionProducts, setAllCollectionProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(
    Array.isArray(initialBrandSlugs) && initialBrandSlugs.length
      ? initialBrandSlugs
      : brandSlug
      ? [brandSlug]
      : [],
  );
  const [selectedBreed, setSelectedBreed] = useState([]);
  const [selectedLifeStage, setSelectedLifeStage] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState([]);
  const [selectedBreedSize, setSelectedBreedSize] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);

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
    categoryId,
    subCategorySlug,
  ]);

  const norm = v =>
    String(v || '')
      .trim()
      .toLowerCase();

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // API params - only send what API supports
      const params = { categorySlug, collectionSlug };
      if (selectedBrand?.length) params.brandSlug = selectedBrand.join(',');
      if (selectedBreed?.length) params.breedSlug = selectedBreed.join(',');
      if (categoryId) params.categoryId = categoryId;
      if (subcategoryId) params.subcategoryId = subcategoryId;
      if (subCategorySlug) params.subCategorySlug = subCategorySlug;
      if (searchQuery && String(searchQuery).trim() !== '') {
        params.search = String(searchQuery).trim();
      }
      if (isVeg) {
        params.isVeg = true;
      }

      const res = await getProducts(params);
      const fetchedProducts = res?.data?.data || [];
      setAllCollectionProducts(fetchedProducts);

      // Client-side filtering
      let filtered = fetchedProducts;

      if (isVeg) {
        filtered = filtered.filter(product => product.isVeg === true);
      }

      filtered = filtered.filter(product => {
        // Brand filter (already handled by API but keeping for consistency)
        const brandMatches =
          !selectedBrand?.length ||
          (product.brandId?.slug &&
            selectedBrand.includes(product.brandId.slug));

        // Breed filter (already handled by API but keeping for consistency)
        const breedMatches =
          !selectedBreed?.length ||
          (product.breedId || []).some(b => selectedBreed.includes(b.slug));

        // Life Stage filter (client-side only)
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

        // Product Type filter (client-side only)
        const normalizedProductType = norm(product.productType || '');
        const normalizedSelectedTypes = (selectedProductType || []).map(v =>
          norm(v),
        );
        const typeMatches =
          !normalizedSelectedTypes.length ||
          normalizedSelectedTypes.includes(normalizedProductType);

        // Breed Size filter (client-side only)
        const normalizedBreedSize = norm(product.breedSize || '');
        const normalizedSelectedSizes = (selectedBreedSize || []).map(v =>
          norm(v),
        );
        const sizeMatches =
          !normalizedSelectedSizes.length ||
          normalizedSelectedSizes.includes(normalizedBreedSize);

        return (
          brandMatches &&
          breedMatches &&
          lifeStageMatches &&
          typeMatches &&
          sizeMatches
        );
      });

      // Price sorting
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
        backgroundColor="#FFFFFF"
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
        <ProductListShimmer />
      ) : (
        <ScrollView style={styles.screen}>
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
  container: { flex: 1, backgroundColor: '#FFFFFF', overflow: 'visible' },
  headerWrapper: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    overflow: 'visible',
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
    overflow: 'visible',
  },
});
