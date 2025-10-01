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

// canonical normalization for keys sent to server and used for comparison
const normKey = v =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

// used for search text normalization
const normText = v =>
  String(v ?? '')
    .trim()
    .toLowerCase();

export default function ProductListScreeen({ route, navigation }) {
  const {
    categorySlug,
    collectionSlug,
    collectionName,
    searchQuery = '',
    subcategoryName,
    subcategoryId,
    initialBrandSlugs = [],
    brandSlug = null,
  } = route.params;

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
  const [selectedLifeStage, setSelectedLifeStage] = useState([]); // expects keys like 'puppy', 'adult', ...
  const [selectedProductType, setSelectedProductType] = useState([]); // expects keys like 'wet_food'
  const [selectedBreedSize, setSelectedBreedSize] = useState([]); // expects keys like 'mini'

  const [isGreenSwitchOn, setIsGreenSwitchOn] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [
    categorySlug,
    collectionSlug,
    JSON.stringify(selectedBrand),
    JSON.stringify(selectedBreed),
    JSON.stringify(selectedLifeStage),
    JSON.stringify(selectedProductType),
    JSON.stringify(selectedBreedSize),
    searchQuery,
    isGreenSwitchOn,
    sortOrder,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { categorySlug, collectionSlug };

      if (selectedBrand?.length) params.brandSlug = selectedBrand.join(',');
      if (selectedBreed?.length) params.breedSlug = selectedBreed.join(',');
      if (selectedLifeStage?.length)
        params.lifeStage = selectedLifeStage.map(normKey).join(',');
      if (selectedProductType?.length)
        params.productType = selectedProductType.map(normKey).join(',');
      if (selectedBreedSize?.length)
        params.breedSize = selectedBreedSize.map(normKey).join(',');

      const res = await getProducts(params);
      const fetchedProducts = res?.data?.data || [];
      setAllCollectionProducts(fetchedProducts);
      let filtered = fetchedProducts;
      if (searchQuery && String(searchQuery).trim() !== '') {
        const searchTerm = normText(searchQuery);
        filtered = filtered.filter(product => {
          const matchesTitle = normText(product.title).includes(searchTerm);
          const matchesDesc = normText(product.description).includes(
            searchTerm,
          );
          const matchesBrand = normText(product.brandId?.name).includes(
            searchTerm,
          );
          const matchesCategory = normText(product.categoryId?.name).includes(
            searchTerm,
          );
          const matchesSubCategory = normText(
            product.subCategoryId?.name,
          ).includes(searchTerm);
          const matchesBreed = (product.breedId || []).some(b =>
            normText(b.name).includes(searchTerm),
          );

          const productLifeStages = Array.isArray(product.lifeStage)
            ? product.lifeStage
            : product.lifeStage
            ? [product.lifeStage]
            : [];
          const matchesLifeStageField = productLifeStages
            .map(ls => normText(ls))
            .some(ls => ls.includes(searchTerm));

          const matchesType = normText(product.productType).includes(
            searchTerm,
          );
          const matchesSize = normText(product.breedSize).includes(searchTerm);

          return (
            matchesTitle ||
            matchesDesc ||
            matchesBrand ||
            matchesCategory ||
            matchesSubCategory ||
            matchesBreed ||
            matchesLifeStageField ||
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

        // breed
        const breedMatches =
          !selectedBreed?.length ||
          (product.breedId || []).some(b => selectedBreed.includes(b.slug));

        const productLifeStages = Array.isArray(product.lifeStage)
          ? product.lifeStage
          : product.lifeStage
          ? [product.lifeStage]
          : [];
        const normalizedProductStages = productLifeStages.map(v => normKey(v));
        const normalizedSelectedStages = (selectedLifeStage || []).map(v =>
          normKey(v),
        );
        const lifeStageMatches =
          !normalizedSelectedStages.length ||
          normalizedProductStages.some(ls =>
            normalizedSelectedStages.includes(ls),
          );

        // productType (string)
        const typeVal = normKey(product.productType);
        const normalizedSelectedTypes = (selectedProductType || []).map(v =>
          normKey(v),
        );
        const typeMatches =
          !normalizedSelectedTypes.length ||
          normalizedSelectedTypes.includes(typeVal);

        // breedSize (string)
        const sizeVal = normKey(product.breedSize);
        const normalizedSelectedSizes = (selectedBreedSize || []).map(v =>
          normKey(v),
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

      // veg toggle
      if (isGreenSwitchOn) {
        filtered = filtered.filter(product => product.isVeg === true);
      }

      // sorting
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

  // Controlled handlers
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
        <GreenSwitchButton
          value={isGreenSwitchOn}
          onValueChange={setIsGreenSwitchOn}
        />
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
  productCardWrapper: { width: '48%' },
  filterBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  switchWrapper: {
    width: 64,
    height: 30,
    justifyContent: 'center',
    marginBottom: 9,
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
});
