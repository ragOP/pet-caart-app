import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  Animated,
  ScrollView,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../../components/SearchBar/SearchBar';

import CollectionShimmer from '../../ui/Shimmer/CollectionShimmer';
import { getCategories } from '../../apis/getCategories';
import { getSubCategories } from '../../apis/getSubCategories';
import { getCollection } from '../../apis/getCollection';

const SCREEN_WIDTH = Dimensions.get('window').width;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function AccordionSection({ category, children, isOpen, onToggle }) {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle(category._id);
  };

  return (
    <View style={styles.accordionRoot}>
      <LinearGradient
        colors={['#F59A11', '#8B9259', '#0888B1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.accordionBorder}
      >
        <TouchableOpacity onPress={handleToggle} activeOpacity={1}>
          <ImageBackground
            source={require('../../assets/images/profilebg.png')}
            style={styles.accordionHeader}
          >
            <View style={styles.headerTextWrapper}>
              <View style={styles.rowWithChevron}>
                <Text style={styles.accordionTitle}>{category.name}</Text>
                {isOpen ? (
                  <ChevronUp
                    size={24}
                    color="#2D2D2D"
                    style={styles.chevronIcon}
                  />
                ) : (
                  <ChevronDown
                    size={24}
                    color="#2D2D2D"
                    style={styles.chevronIcon}
                  />
                )}
              </View>
            </View>
            {category.image && (
              <Image source={{ uri: category.image }} style={styles.icon} />
            )}
          </ImageBackground>
        </TouchableOpacity>
      </LinearGradient>
      {isOpen && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

function FoodCard({ label, image }) {
  return (
    <View style={styles.foodCardOuter}>
      <Image source={{ uri: image }} style={styles.foodImg} />
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function AllCategoriesScreen({ navigation }) {
  const [activeAccordionId, setActiveAccordionId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const underlineAnim = useRef(new Animated.Value(0)).current;

  // Categories Query
  const { data: apiCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      return res.data.data.categories
        .filter(c => c.name === 'Dogs' || c.name === 'Cats')
        .sort((a, b) => (a.name === 'Dogs' ? -1 : 1));
    },
  });

  // Subcategories Query (depends on categories)
  const { data: apiSubcategories, isLoading: isLoadingSubcategories } =
    useQuery({
      queryKey: ['subcategories'],
      queryFn: async () => {
        const res = await getSubCategories();
        return res?.data?.data || [];
      },
      enabled: !!apiCategories,
    });
  const { data: collections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const subcatIds = apiSubcategories?.map(subcat => subcat._id) || [];
      const colls = {};
      for (const subcatId of subcatIds) {
        try {
          const collectionRes = await getCollection();
          colls[subcatId] = collectionRes.data.data.filter(
            item => item.subCategoryId === subcatId,
          );
        } catch (error) {
          colls[subcatId] = [];
        }
      }
      return colls;
    },
    enabled: !!apiSubcategories?.length, // Only fetch if subcategories exist
  });

  // Filter subcategories by active category
  const filteredSubcategories = useMemo(() => {
    if (!apiCategories || !apiSubcategories) return [];
    return apiSubcategories.filter(
      subcat => subcat.categoryId === apiCategories[activeTab]?._id,
    );
  }, [apiCategories, apiSubcategories, activeTab]);

  // Tab labels and width
  const TAB_LABELS = useMemo(
    () => (apiCategories ? apiCategories.map(c => c.name) : []),
    [apiCategories],
  );
  const TAB_COUNT = TAB_LABELS.length;
  const underlineWidth = SCREEN_WIDTH / Math.max(TAB_COUNT, 1);
  const underlineTranslate = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, underlineWidth],
  });

  // Tab press handler
  const handleTabPress = index => {
    if (index < TAB_COUNT) {
      setActiveTab(index);
      setActiveAccordionId(null);
      Animated.timing(underlineAnim, {
        toValue: index,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  };

  // Collection click handler
  const handleCollectionClick = (
    categorySlug,
    collectionSlug,
    collectionName,
    subCategoryId,
  ) => {
    const subcategory =
      filteredSubcategories.find(sub => sub._id === subCategoryId) || {};
    navigation.navigate('ProductCollectionScreeen', {
      categorySlug,
      collectionSlug,
      collectionName,
      subcategoryName: subcategory.name || '',
      subcategoryId: subcategory._id || '',
    });
  };

  // Loading state
  const loading =
    isLoadingCategories || isLoadingSubcategories || isLoadingCollections;

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
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={1}
          >
            <ArrowLeft size={30} color="#000" />
          </TouchableOpacity>
          <SearchBar />
        </View>
      </View>

      {loading ? (
        <View>
          <CollectionShimmer />
        </View>
      ) : (
        <>
          {TAB_COUNT > 0 && (
            <>
              <View style={styles.tabRow}>
                {TAB_LABELS.map((label, index) => (
                  <TouchableOpacity
                    key={`tab-${index}`}
                    style={styles.tab}
                    activeOpacity={0.8}
                    onPress={() => handleTabPress(index)}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === index && styles.tabTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.underlineContainer}>
                <Animated.View
                  style={[
                    styles.underline,
                    {
                      width: underlineWidth,
                      transform: [{ translateX: underlineTranslate }],
                    },
                  ]}
                />
              </View>
            </>
          )}

          <ScrollView
            style={{ flex: 1, backgroundColor: 'transparent' }}
            contentContainerStyle={{ paddingBottom: 0, marginBottom: 0 }}
          >
            {filteredSubcategories.map(category => (
              <AccordionSection
                key={category._id}
                category={category}
                isOpen={activeAccordionId === category._id}
                onToggle={setActiveAccordionId}
              >
                {collections?.[category._id]?.length > 0 ? (
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.foodCardsHorizontal}
                  >
                    {collections[category._id].map(item => (
                      <TouchableOpacity
                        key={item._id}
                        style={styles.foodCardContainer}
                        onPress={() =>
                          handleCollectionClick(
                            filteredSubcategories.find(
                              sub => sub._id === item.subCategoryId,
                            )?.slug || '',
                            item.slug,
                            item.name,
                            item.subCategoryId,
                          )
                        }
                        activeOpacity={1}
                      >
                        <FoodCard label={item.name} image={item.image} />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.noCollectionsText}>
                    No collections found
                  </Text>
                )}
              </AccordionSection>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 10 },
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  accordionRoot: { marginVertical: 2 },
  accordionBorder: { padding: 5, borderRadius: 16 },
  accordionHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  headerTextWrapper: { flex: 1 },
  rowWithChevron: { flexDirection: 'row', alignItems: 'center' },
  accordionTitle: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#181818',
    marginRight: 10,
    marginTop: 10,
    // fontWeight: 'bold',
  },
  chevronIcon: { marginTop: 10 },
  accordionSubtitle: {
    fontSize: 15,
    color: '#181818',
    marginTop: 2,
    fontFamily: 'gotham-rounded-book',
  },
  icon: { width: 100, height: 90, resizeMode: 'contain', marginLeft: 8 },
  accordionBody: {
    backgroundColor: '#FFF',
    marginTop: 0,
    padding: 8,
    overflow: 'hidden',
  },
  foodCardsHorizontal: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  foodCardContainer: {
    width: 120,
    marginRight: 12,
  },
  foodCardOuter: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    borderColor: '#F59A11',
    borderWidth: 1,
  },
  foodImg: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#181818',
    textAlign: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#222',
  },
  underlineContainer: {
    height: 3,
    backgroundColor: '#f6f6f6',
    width: '100%',
    marginBottom: 8,
  },
  underline: {
    height: 3,
    backgroundColor: '#0888B1',
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderRadius: 2,
  },
  noCollectionsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontFamily: 'Gotham-Rounded-Medium',
  },
});
