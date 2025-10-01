import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {
  SlidersHorizontal,
  X,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getBrands } from '../../apis/getBrands';
import { getBreeds } from '../../apis/getBreeds';
const windowWidth = Dimensions.get('window').width;
const LIFE_STAGE_OPTIONS = [
  { label: 'Puppy', value: 'puppy' },
  { label: 'Adult', value: 'adult' },
  { label: 'Starter', value: 'starter' },
  { label: 'Kitten', value: 'kitten' },
];

const PRODUCT_TYPE_OPTIONS = [
  { label: 'Wet Food', value: 'wet food' },
  { label: 'Dry Food', value: 'dry food' },
  { label: 'Food Toppers', value: 'food toppers' },
  { label: 'Treats', value: 'treats' },
];

const BREED_SIZE_OPTIONS = [
  { label: 'Mini', value: 'mini' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Giant', value: 'giant' },
];

const FilterBar = ({
  selectedBrand = [],
  selectedBreed = [],
  selectedLifeStage = [],
  selectedProductType = [],
  selectedBreedSize = [],
  setSelectedBrand,
  setSelectedBreed,
  setSelectedLifeStage,
  setSelectedProductType,
  setSelectedBreedSize,
  collectionName,
  sortOrder,
  onChangeSort,
}) => {
  const filterSheetRef = useRef();
  const sortSheetRef = useRef();
  const [brands, setBrands] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [tempBrandSlugs, setTempBrandSlugs] = useState([]);
  const [tempBreedSlugs, setTempBreedSlugs] = useState([]);
  const [tempLifeStages, setTempLifeStages] = useState([]);
  const [tempProductTypes, setTempProductTypes] = useState([]);
  const [tempBreedSizes, setTempBreedSizes] = useState([]);
  const sortOptions = [
    { label: 'Low to High', value: 'lowToHigh', icon: ArrowDownWideNarrow },
    { label: 'High to Low', value: 'highToLow', icon: ArrowUpNarrowWide },
  ];
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrands();
        setBrands(response?.data?.data || []);
      } catch (e) {
        console.error('Error fetching brands', e);
      }
    };
    const fetchBreeds = async () => {
      try {
        const response = await getBreeds();
        setBreeds(response?.data?.data || []);
      } catch (e) {
        console.error('Error fetching breeds', e);
      }
    };
    fetchBrands();
    fetchBreeds();
  }, []);

  useEffect(() => {
    setTempBrandSlugs(Array.isArray(selectedBrand) ? selectedBrand : []);
  }, [selectedBrand]);

  useEffect(() => {
    setTempBreedSlugs(Array.isArray(selectedBreed) ? selectedBreed : []);
  }, [selectedBreed]);

  useEffect(() => {
    setTempLifeStages(
      Array.isArray(selectedLifeStage) ? selectedLifeStage : [],
    );
  }, [selectedLifeStage]);

  useEffect(() => {
    setTempProductTypes(
      Array.isArray(selectedProductType) ? selectedProductType : [],
    );
  }, [selectedProductType]);

  useEffect(() => {
    setTempBreedSizes(
      Array.isArray(selectedBreedSize) ? selectedBreedSize : [],
    );
  }, [selectedBreedSize]);

  const openFilterSheet = () => {
    setTempBrandSlugs(Array.isArray(selectedBrand) ? selectedBrand : []);
    setTempBreedSlugs(Array.isArray(selectedBreed) ? selectedBreed : []);
    setTempLifeStages(
      Array.isArray(selectedLifeStage) ? selectedLifeStage : [],
    );
    setTempProductTypes(
      Array.isArray(selectedProductType) ? selectedProductType : [],
    );
    setTempBreedSizes(
      Array.isArray(selectedBreedSize) ? selectedBreedSize : [],
    );
    filterSheetRef.current?.open();
  };

  const openSortSheet = () => {
    sortSheetRef.current?.open();
  };

  const handleClearAll = () => {
    setTempBrandSlugs([]);
    setTempBreedSlugs([]);
    setTempLifeStages([]);
    setTempProductTypes([]);
    setTempBreedSizes([]);
    setSelectedBrand?.([]);
    setSelectedBreed?.([]);
    setSelectedLifeStage?.([]);
    setSelectedProductType?.([]);
    setSelectedBreedSize?.([]);
    filterSheetRef.current?.close();
  };

  const handleApplyFilters = () => {
    setSelectedBrand?.(tempBrandSlugs);
    setSelectedBreed?.(tempBreedSlugs);
    setSelectedLifeStage?.(tempLifeStages);
    setSelectedProductType?.(tempProductTypes);
    setSelectedBreedSize?.(tempBreedSizes);
    filterSheetRef.current?.close();
  };

  const toggleValue = (prev, v) =>
    prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v];

  const handleBrandSelect = slug =>
    setTempBrandSlugs(prev => toggleValue(prev, slug));
  const handleBreedSelect = slug =>
    setTempBreedSlugs(prev => toggleValue(prev, slug));
  const handleLifeStageSelect = v =>
    setTempLifeStages(prev => toggleValue(prev, v));
  const handleProductTypeSelect = v =>
    setTempProductTypes(prev => toggleValue(prev, v));
  const handleBreedSizeSelect = v =>
    setTempBreedSizes(prev => toggleValue(prev, v));

  const brandCount = Array.isArray(selectedBrand) ? selectedBrand.length : 0;
  const breedCount = Array.isArray(selectedBreed) ? selectedBreed.length : 0;
  const lifeStageCount = Array.isArray(selectedLifeStage)
    ? selectedLifeStage.length
    : 0;
  const productTypeCount = Array.isArray(selectedProductType)
    ? selectedProductType.length
    : 0;
  const breedSizeCount = Array.isArray(selectedBreedSize)
    ? selectedBreedSize.length
    : 0;
  const isSortActive = Boolean(sortOrder);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingRight: '40%' },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, brandCount > 0 && styles.activeButton]}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text
            style={[styles.buttonText, brandCount > 0 && styles.activeText]}
          >
            {`Brand${brandCount ? `(${brandCount})` : ''}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, breedCount > 0 && styles.activeButton]}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text
            style={[styles.buttonText, breedCount > 0 && styles.activeText]}
          >
            {`Breed${breedCount ? `(${breedCount})` : ''}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, lifeStageCount > 0 && styles.activeButton]}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text
            style={[styles.buttonText, lifeStageCount > 0 && styles.activeText]}
          >
            {`Life Stage${lifeStageCount ? `(${lifeStageCount})` : ''}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, productTypeCount > 0 && styles.activeButton]}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text
            style={[
              styles.buttonText,
              productTypeCount > 0 && styles.activeText,
            ]}
          >
            {`Product Type${productTypeCount ? `(${productTypeCount})` : ''}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, breedSizeCount > 0 && styles.activeButton]}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text
            style={[styles.buttonText, breedSizeCount > 0 && styles.activeText]}
          >
            {`Size${breedSizeCount ? `(${breedSizeCount})` : ''}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}>Rating</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isSortActive && styles.activeButton]}
          onPress={openSortSheet}
          activeOpacity={1}
        >
          <Text style={[styles.buttonText, isSortActive && styles.activeText]}>
            {sortOrder === 'lowToHigh'
              ? 'Price: Low to High'
              : sortOrder === 'highToLow'
              ? 'Price: High to Low'
              : 'Sort'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <RBSheet
        ref={filterSheetRef}
        height={600}
        openDuration={250}
        closeDuration={200}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: '#FFF',
            position: 'absolute',
            bottom: 0,
            width: windowWidth,
          },
        }}
      >
        <ScrollView
          style={{ maxHeight: 600 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator
        >
          <View style={styles.filterHeader}>
            <SlidersHorizontal size={20} color="#333" />
            <Text style={styles.filterTitle}>FILTERS</Text>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Brand</Text>
            <View style={styles.brandContainer}>
              {brands.length > 0 ? (
                brands.map(brand => {
                  const isSelected = tempBrandSlugs.includes(brand.slug);
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={brand._id}
                      style={[
                        styles.brandButton,
                        isSelected && styles.selectedBrand,
                      ]}
                      onPress={() => handleBrandSelect(brand.slug)}
                    >
                      <Image
                        source={{ uri: brand.logo }}
                        style={styles.brandLogo}
                        resizeMode="cover"
                      />
                      <Text
                        style={[
                          styles.brandText,
                          isSelected && { color: 'black' },
                        ]}
                      >
                        {brand.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text>No brands available</Text>
              )}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Breed</Text>
            <View style={styles.optionRow}>
              {breeds.length > 0 ? (
                breeds.map(breed => {
                  const isSelected = tempBreedSlugs.includes(breed.slug);
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={breed._id}
                      style={[
                        styles.optionButton,
                        isSelected && styles.selectedBreed,
                      ]}
                      onPress={() => handleBreedSelect(breed.slug)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && { color: 'black' },
                        ]}
                      >
                        {breed.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text>No breeds available</Text>
              )}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Life Stage</Text>
            <View style={styles.optionRow}>
              {LIFE_STAGE_OPTIONS.map(opt => {
                const isSelected = tempLifeStages.includes(opt.value);
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={opt.value}
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedBreed,
                    ]}
                    onPress={() => handleLifeStageSelect(opt.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && { color: 'black' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Product Type</Text>
            <View style={styles.optionRow}>
              {PRODUCT_TYPE_OPTIONS.map(opt => {
                const isSelected = tempProductTypes.includes(opt.value);
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={opt.value}
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedBreed,
                    ]}
                    onPress={() => handleProductTypeSelect(opt.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && { color: 'black' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Breed Size</Text>
            <View style={styles.optionRow}>
              {BREED_SIZE_OPTIONS.map(opt => {
                const isSelected = tempBreedSizes.includes(opt.value);
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={opt.value}
                    style={[
                      styles.optionButton,
                      isSelected && styles.selectedBreed,
                    ]}
                    onPress={() => handleBreedSizeSelect(opt.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && { color: 'black' },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearText}>CLEAR ALL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>
      <RBSheet
        ref={sortSheetRef}
        height={200}
        openDuration={220}
        closeDuration={180}
        customStyles={{
          container: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: '#FFF',
            position: 'absolute',
            bottom: 0,
            width: windowWidth,
          },
        }}
      >
        <ScrollView
          style={{ maxHeight: 500 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        >
          <View style={styles.sortHeader}>
            <Text style={styles.sortTitle}>Sort By</Text>
            {sortOrder ? (
              <TouchableOpacity
                onPress={() => {
                  onChangeSort?.(null);
                  sortSheetRef.current?.close();
                }}
                style={styles.sortClearPill}
              >
                <X size={14} color="#000" />
                <Text style={styles.sortClearText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {[
            {
              label: 'Low to High',
              value: 'lowToHigh',
              icon: ArrowDownWideNarrow,
            },
            {
              label: 'High to Low',
              value: 'highToLow',
              icon: ArrowUpNarrowWide,
            },
          ].map(({ label, value, icon: Icon }) => {
            const active = sortOrder === value;
            return (
              <TouchableOpacity
                key={value}
                style={[styles.sortRowItem, active && styles.sortRowItemActive]}
                onPress={() => {
                  onChangeSort?.(value);
                  sortSheetRef.current?.close();
                }}
                activeOpacity={0.9}
              >
                <View style={styles.sortRowLeft}>
                  <Icon size={18} color={active ? '#000' : '#666'} />
                  <Text
                    style={[
                      styles.sortRowText,
                      active && styles.sortRowTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
                <View
                  style={[styles.sortRadio, active && styles.sortRadioActive]}
                />
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 8 }} />
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 2, backgroundColor: '#FFFFFF' },
  scrollView: { flexDirection: 'row' },
  scrollViewContent: {},
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 5,
    height: 40,
    borderRadius: 8,
    borderWidth: 0.3,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#4040400D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  activeButton: {
    backgroundColor: '#F59A111A',
    borderColor: '#F59A11',
    borderWidth: 0.8,
    ...Platform.select({
      ios: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      },
      android: { elevation: 0 },
    }),
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
  },
  activeText: { color: '#000' },

  bottomSheetContent: { padding: 20 },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
  filterSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  brandContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brandButton: {
    width: '30%',
    backgroundColor: '#e6f5f7',
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#bcdde9',
    borderWidth: 1,
  },
  brandLogo: { width: 80, height: 80, marginBottom: 5 },
  brandText: { fontSize: 14, color: '#333', fontFamily: 'Gotham-Rounded-Bold' },
  selectedBrand: { borderColor: '#F59A11', backgroundColor: '#F59A111A' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: {
    backgroundColor: '#e6f5f7',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#bcdde9',
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  selectedBreed: { borderColor: '#F59A11', backgroundColor: '#F59A111A' },
  optionText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Gotham-Rounded-Bold',
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  applyButton: {
    backgroundColor: '#0888B1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearText: { fontSize: 16, color: '#0888B1', fontWeight: 'bold' },
  applyText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  sortSheetContent: { padding: 16, paddingBottom: 10 },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sortTitle: { fontSize: 18, fontWeight: 'bold', color: '#111' },
  sortClearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F6F6F6',
  },
  sortClearText: { fontSize: 13, color: '#000' },

  sortRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    marginTop: 8,
  },
  sortRowItemActive: { backgroundColor: '#F59A111A', borderColor: '#F59A11' },
  sortRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sortRowText: { fontSize: 16, color: '#444' },
  sortRowTextActive: { color: '#000', fontFamily: 'Gotham-Rounded-Bold' },
  sortRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#BBB',
  },
  sortRadioActive: { borderColor: '#F59A11', backgroundColor: '#F59A11' },
});

export default FilterBar;
