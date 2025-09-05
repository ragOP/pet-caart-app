import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getBrands } from '../../apis/getBrands';
import { getBreeds } from '../../apis/getBreeds';

const windowWidth = Dimensions.get('window').width;

const FilterBar = ({
  selectedBrand, // brandSlug | null
  selectedBreed, // breedSlug | null
  setSelectedBrand, // (slug|null)=>void
  setSelectedBreed, // (slug|null)=>void
  collectionName, // string | undefined
}) => {
  const bottomSheetRef = useRef();

  // list data
  const [brands, setBrands] = useState([]);
  const [breeds, setBreeds] = useState([]);

  // bottom sheet ke liye temp selection
  const [tempBrandSlug, setTempBrandSlug] = useState(selectedBrand);
  const [tempBreedSlug, setTempBreedSlug] = useState(selectedBreed);

  // optional: collection chip ko hide/show karne ke liye UI-only flag
  const [showCollectionChip, setShowCollectionChip] = useState(true);

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

  useEffect(() => setTempBrandSlug(selectedBrand || null), [selectedBrand]);
  useEffect(() => setTempBreedSlug(selectedBreed || null), [selectedBreed]);

  const filterOptions = [
    { label: 'BRAND', isActive: true },
    { label: 'BREED', isActive: true },
    { label: 'RATING', isActive: true },
  ];

  const openBottomSheet = () => {
    setTempBrandSlug(selectedBrand || null);
    setTempBreedSlug(selectedBreed || null);
    bottomSheetRef.current?.open();
  };

  const handleClearAll = () => {
    setTempBrandSlug(null);
    setTempBreedSlug(null);
  };

  const handleApplyFilters = () => {
    setSelectedBrand(tempBrandSlug || null);
    setSelectedBreed(tempBreedSlug || null);
    bottomSheetRef.current?.close();
  };

  const handleBrandSelect = brandSlug => setTempBrandSlug(brandSlug);
  const handleBreedSelect = breedSlug =>
    setTempBreedSlug(prev => (prev === breedSlug ? null : breedSlug));

  const selectedFilters = [];
  if (selectedBrand) {
    const b = brands.find(x => x.slug === selectedBrand);
    selectedFilters.push({
      label: `Brand: ${b?.name || selectedBrand}`,
      type: 'brand',
    });
  }
  if (selectedBreed) {
    const br = breeds.find(x => x.slug === selectedBreed);
    selectedFilters.push({
      label: `Breed: ${br?.name || selectedBreed}`,
      type: 'breed',
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <TouchableOpacity style={[styles.button]} onPress={openBottomSheet}>
          <SlidersHorizontal size={20} color="#333" />
          <Text style={[styles.buttonText, styles.activeText]}>FILTERS</Text>
        </TouchableOpacity>

        {/* Collection chip: "Collection:CatFood x" */}
        {!!collectionName && showCollectionChip && (
          <View style={styles.chip}>
            <Text
              style={styles.chipText}
            >{`Collection:${collectionName}`}</Text>
            <TouchableOpacity
              onPress={() => {
                // Pure UI hide:
                setShowCollectionChip(false);

                // Agar logical collection filter bhi hatana ho:
                // 1) Parent me collectionSlug ko state bana ke null set karo yahan se
                // 2) fetchProducts se params.collectionSlug hata do
              }}
            >
              <Text style={styles.chipRemoveText}>x</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedFilters.map((filter, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{filter.label}</Text>
            <TouchableOpacity
              onPress={() => {
                if (filter.type === 'brand') setSelectedBrand(null);
                if (filter.type === 'breed') setSelectedBreed(null);
              }}
            >
              <Text style={styles.chipRemoveText}>x</Text>
            </TouchableOpacity>
          </View>
        ))}

        {filterOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, option.isActive && styles.activeButton]}
            onPress={openBottomSheet}
          >
            <Text
              style={[styles.buttonText, option.isActive && styles.activeText]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <RBSheet
        ref={bottomSheetRef}
        height={'auto'}
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
            paddingBottom: 0,
          },
        }}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.filterHeader}>
            <SlidersHorizontal size={20} color="#333" />
            <Text style={styles.filterTitle}>FILTERS</Text>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Brand</Text>
            <View style={styles.brandContainer}>
              {brands.length > 0 ? (
                brands.map(brand => (
                  <TouchableOpacity
                    key={brand._id}
                    style={[
                      styles.brandButton,
                      tempBrandSlug === brand.slug && styles.selectedBrand,
                    ]}
                    onPress={() => handleBrandSelect(brand.slug)}
                  >
                    <Image
                      source={{ uri: brand.logo }}
                      style={styles.brandLogo}
                    />
                    <Text style={styles.brandText}>{brand.name}</Text>
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
                    key={breed._id}
                    style={[
                      styles.optionButton,
                      tempBreedSlug === breed.slug && styles.selectedBreed,
                    ]}
                    onPress={() => handleBreedSelect(breed.slug)}
                  >
                    <Text style={styles.optionText}>{breed.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No breeds available</Text>
              )}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Text style={styles.clearText}>CLEAR ALL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    backgroundColor: '#FFFBF6',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingRight: 20,
  },
  scrollView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#6A68681A',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#333',
    marginLeft: 5,
  },
  activeText: {
    color: '#000',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 9,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderColor: 'black',
    borderWidth: 0.5,
  },
  chipText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  chipRemoveText: {
    color: '#000',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    padding: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  filterSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
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
  },
  brandLogo: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  brandText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  selectedBrand: {
    backgroundColor: '#0888B1',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#e6f5f7',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedBreed: {
    backgroundColor: '#0888B1',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  applyButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  clearText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  applyText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FilterBar;
