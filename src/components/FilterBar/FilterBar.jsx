import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView as RNScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import {
  SlidersHorizontal,
  X,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
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

const FilterFooter = ({ onClear, onApply }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }}>
      <View
        style={[
          styles.stickyActions,
          {
            position: 'relative',
            paddingBottom: Math.max(
              16,
              16 + (Platform.OS === 'ios' ? insets.bottom : 0),
            ),
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.clearButton}
          onPress={onClear}
        >
          <Text style={styles.clearText}>CLEAR ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.applyButton}
          onPress={onApply}
        >
          <Text style={styles.applyText}>APPLY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
  isVeg = false,
  setIsVeg,
  collectionName,
  sortOrder,
  onChangeSort,
}) => {
  const [brands, setBrands] = useState([]);
  const [breeds, setBreeds] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [brandRes, breedRes] = await Promise.all([
          getBrands(),
          getBreeds(),
        ]);
        setBrands(brandRes?.data?.data || []);
        setBreeds(breedRes?.data?.data || []);
      } catch {}
    };
    loadData();
  }, []);

  // temp state
  const [tempBrandSlugs, setTempBrandSlugs] = useState([]);
  const [tempBreedSlugs, setTempBreedSlugs] = useState([]);
  const [tempLifeStages, setTempLifeStages] = useState([]);
  const [tempProductTypes, setTempProductTypes] = useState([]);
  const [tempBreedSizes, setTempBreedSizes] = useState([]);

  useEffect(() => setTempBrandSlugs(selectedBrand || []), [selectedBrand]);
  useEffect(() => setTempBreedSlugs(selectedBreed || []), [selectedBreed]);
  useEffect(
    () => setTempLifeStages(selectedLifeStage || []),
    [selectedLifeStage],
  );
  useEffect(
    () => setTempProductTypes(selectedProductType || []),
    [selectedProductType],
  );
  useEffect(
    () => setTempBreedSizes(selectedBreedSize || []),
    [selectedBreedSize],
  );

  const toggleValue = (prev, v) =>
    prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v];

  const filterSheetRef = useRef(null);
  const sortSheetRef = useRef(null);
  const filterSnapPoints = useMemo(() => ['60%', '92%'], []);
  const sortSnapPoints = useMemo(() => ['30%'], []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const openFilterSheet = () => {
    setTempBrandSlugs(selectedBrand || []);
    setTempBreedSlugs(selectedBreed || []);
    setTempLifeStages(selectedLifeStage || []);
    setTempProductTypes(selectedProductType || []);
    setTempBreedSizes(selectedBreedSize || []);
    filterSheetRef.current?.present?.();
  };
  const openSortSheet = () => sortSheetRef.current?.present?.();

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
    setIsVeg?.(false);
    filterSheetRef.current?.dismiss?.();
  };
  const handleApplyFilters = () => {
    setSelectedBrand?.(tempBrandSlugs);
    setSelectedBreed?.(tempBreedSlugs);
    setSelectedLifeStage?.(tempLifeStages);
    setSelectedProductType?.(tempProductTypes);
    setSelectedBreedSize?.(tempBreedSizes);
    filterSheetRef.current?.dismiss?.();
  };

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
  const handleVegToggle = () => setIsVeg?.(prev => !prev);

  const sortOptions = [
    { label: 'Low to High', value: 'lowToHigh', icon: ArrowDownWideNarrow },
    { label: 'High to Low', value: 'highToLow', icon: ArrowUpNarrowWide },
  ];
  const brandCount = selectedBrand?.length || 0;
  const breedCount = selectedBreed?.length || 0;
  const lifeStageCount = selectedLifeStage?.length || 0;
  const productTypeCount = selectedProductType?.length || 0;
  const breedSizeCount = selectedBreedSize?.length || 0;
  const isSortActive = !!sortOrder;

  const GreenSwitchButton = ({ value, onValueChange }) => (
    <View style={styles.vegbutton}>
      <TouchableOpacity
        onPress={() => onValueChange(!value)}
        activeOpacity={1}
        style={styles.switchWrapper}
      >
        <View
          style={[
            styles.track,
            { backgroundColor: value ? '#0a0' : '#ebebeb' },
          ]}
        />
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
    </View>
  );

  return (
    <View style={styles.container}>
      <RNScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <GreenSwitchButton value={isVeg} onValueChange={handleVegToggle} />

        <TouchableOpacity
          style={[styles.button, brandCount > 0 && styles.activeButton]}
          onPress={openFilterSheet}
          activeOpacity={1}
        >
          <Text
            style={[styles.buttonText, brandCount > 0 && styles.activeText]}
          >
            Brand{brandCount ? `(${brandCount})` : ''}
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
            Breed{breedCount ? `(${breedCount})` : ''}
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
            Life Stage{lifeStageCount ? `(${lifeStageCount})` : ''}
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
            Product Type{productTypeCount ? `(${productTypeCount})` : ''}
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
            Size{breedSizeCount ? `(${breedSizeCount})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
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
      </RNScrollView>

      {/* Filter sheet with footerComponent */}
      <BottomSheetModal
        ref={filterSheetRef}
        index={0}
        snapPoints={filterSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bsBackground}
        handleIndicatorStyle={{ backgroundColor: '#ccc' }}
        containerStyle={{ zIndex: 1000 }}
        footerComponent={props => (
          <BottomSheetFooter {...props} bottomInset={0}>
            <FilterFooter
              onClear={handleClearAll}
              onApply={handleApplyFilters}
            />
          </BottomSheetFooter>
        )}
      >
        {/* IMPORTANT: Use BottomSheetScrollView, avoid flex:1 on contentContainerStyle */}
        <BottomSheetScrollView
          style={{ maxHeight: '100%' }}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20, // footer alag se safe area handle karega
          }}
        >
          <View style={styles.filterHeader}>
            <SlidersHorizontal size={20} color="#333" />
            <Text style={styles.filterTitle}>FILTERS</Text>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Brand</Text>
            <View style={styles.optionRow}>
              {brands.length > 0 ? (
                brands.map(brand => (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={brand._id}
                    style={[
                      styles.optionButton,
                      tempBrandSlugs.includes(brand.slug) &&
                        styles.selectedBrand,
                    ]}
                    onPress={() => handleBrandSelect(brand.slug)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempBrandSlugs.includes(brand.slug) && {
                          color: 'black',
                        },
                      ]}
                    >
                      {brand.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No brands available</Text>
              )}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Breed</Text>
            <View style={styles.optionRow}>
              {breeds.length > 0 ? (
                breeds.map(breed => (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={breed._id}
                    style={[
                      styles.optionButton,
                      tempBreedSlugs.includes(breed.slug) &&
                        styles.selectedBreed,
                    ]}
                    onPress={() => handleBreedSelect(breed.slug)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        tempBreedSlugs.includes(breed.slug) && {
                          color: 'black',
                        },
                      ]}
                    >
                      {breed.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No breeds available</Text>
              )}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Life Stage</Text>
            <View style={styles.optionRow}>
              {LIFE_STAGE_OPTIONS.map(opt => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={opt.value}
                  style={[
                    styles.optionButton,
                    tempLifeStages.includes(opt.value) && styles.selectedBreed,
                  ]}
                  onPress={() => handleLifeStageSelect(opt.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tempLifeStages.includes(opt.value) && {
                        color: 'black',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Product Type</Text>
            <View style={styles.optionRow}>
              {PRODUCT_TYPE_OPTIONS.map(opt => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={opt.value}
                  style={[
                    styles.optionButton,
                    tempProductTypes.includes(opt.value) &&
                      styles.selectedBreed,
                  ]}
                  onPress={() => handleProductTypeSelect(opt.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tempProductTypes.includes(opt.value) && {
                        color: 'black',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 6 }} />

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Breed Size</Text>
            <View style={styles.optionRow}>
              {BREED_SIZE_OPTIONS.map(opt => (
                <TouchableOpacity
                  activeOpacity={1}
                  key={opt.value}
                  style={[
                    styles.optionButton,
                    tempBreedSizes.includes(opt.value) && styles.selectedBreed,
                  ]}
                  onPress={() => handleBreedSizeSelect(opt.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tempBreedSizes.includes(opt.value) && {
                        color: 'black',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 22 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* Sort sheet */}
      <BottomSheetModal
        ref={sortSheetRef}
        index={0}
        snapPoints={sortSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bsBackground}
        handleIndicatorStyle={{ backgroundColor: '#ccc' }}
        containerStyle={{ zIndex: 1000 }}
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 24 }}>
          <View style={styles.sortHeader}>
            <Text style={styles.sortTitle}>Sort By</Text>
            {sortOrder && (
              <TouchableOpacity
                onPress={() => {
                  onChangeSort?.(null);
                  sortSheetRef.current?.dismiss?.();
                }}
                style={styles.sortClearPill}
              >
                <X size={14} color="#000" />
                <Text style={styles.sortClearText}>Clear</Text>
              </TouchableOpacity>
            )}
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
                  sortSheetRef.current?.dismiss?.();
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
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    ...Platform.select({
      ios: { paddingBottom: 12 },
      android: { paddingBottom: 0 },
    }),
  },
  scrollView: { flexDirection: 'row' },
  scrollViewContent: { paddingVertical: 0, marginBottom: 2 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginHorizontal: 4,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
    borderWidth: 2,
  },
  activeButton: {
    backgroundColor: '#F59A111A',
    borderColor: '#F59A11',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'Gotham-Rounded-Medium',
  },
  activeText: { color: '#000', fontFamily: 'Gotham-Rounded-Bold' },

  vegbutton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
    borderWidth: 2,
  },
  switchWrapper: { width: 60, height: 32, marginTop: 3 },
  track: {
    position: 'absolute',
    width: 57,
    height: 14,
    borderRadius: 12,
    backgroundColor: '#ebebeb',
    top: 7.5,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderWidth: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    top: 2.2,
  },
  thumbInner: {
    width: 16,
    height: 16,
    borderRadius: 9,
    backgroundColor: '#0a0',
  },

  bsBackground: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...(Platform.OS === 'android'
      ? { elevation: 12 }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        }),
  },

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 8 },

  filterSection: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  optionButton: {
    backgroundColor: '#e6f5f7',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bcdde9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBrand: { borderColor: '#F59A11', backgroundColor: '#F59A111A' },
  selectedBreed: { borderColor: '#F59A11', backgroundColor: '#F59A111A' },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Gotham-Rounded-Medium',
    width: '100%',
  },

  // footer
  stickyActions: {
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  applyButton: {
    backgroundColor: '#0888B1',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  clearText: { fontSize: 16, color: '#0888B1', fontWeight: 'bold' },
  applyText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },

  // sort sheet
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    borderRadius: 18,
    backgroundColor: '#F6F6F6',
  },
  sortClearText: { fontSize: 13, color: '#000' },
  sortRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
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
    borderColor: '#bbb',
  },
  sortRadioActive: { borderColor: '#F59A11', backgroundColor: '#F59A11' },
});

export default FilterBar;

// export const AppRoot = ({ children }) => (
//   <SafeAreaProvider>{children}</SafeAreaProvider>
// );
