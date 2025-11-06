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

  const words = category.name.trim().split(/\s+/);
  const shouldSplit = words.length >= 3;

  return (
    <View style={styles.accordionRoot}>
      <View style={styles.accordionBorder}>
        <TouchableOpacity onPress={handleToggle} activeOpacity={1}>
          <ImageBackground
            source={require('../../assets/images/profilebg.png')}
            style={styles.accordionHeader}
          >
            <View style={styles.headerTextWrapper}>
              <View style={styles.rowWithChevron}>
                {shouldSplit ? (
                  <View style={styles.titleContainer}>
                    <Text style={styles.accordionTitleFirstLine}>
                      {words[0]}
                    </Text>
                    <Text style={styles.accordionTitleSecondLine}>
                      {words.slice(1).join(' ')}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.accordionTitle}>{category.name}</Text>
                )}
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
      </View>
      {isOpen && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

function FoodCard({ label, image }) {
  const displayLabel = useMemo(() => {
    const words = label.trim().split(/\s+/);
    if (words.length >= 3) {
      return words.slice(1).join(' ');
    }
    return label;
  }, [label]);

  return (
    <View style={styles.foodCardOuter}>
      <Image source={{ uri: image }} style={styles.foodImg} />
      <Text style={styles.cardLabel}>{displayLabel}</Text>
    </View>
  );
}

export default function AllCategoriesScreen({ navigation }) {
  const [activeAccordionId, setActiveAccordionId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const { data: apiCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      return res.data.data.categories
        .filter(c => c.name === 'Dogs' || c.name === 'Cats')
        .sort((a, b) => (a.name === 'Dogs' ? -1 : 1));
    },
  });

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
    enabled: !!apiSubcategories?.length,
  });

  const filteredSubcategories = useMemo(() => {
    if (!apiCategories || !apiSubcategories) return [];
    return apiSubcategories.filter(
      subcat => subcat.categoryId === apiCategories[activeTab]?._id,
    );
  }, [apiCategories, apiSubcategories, activeTab]);

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

  const handleAccordionToggle = categoryId => {
    if (activeAccordionId === categoryId) {
      setActiveAccordionId(null);
    } else {
      setActiveAccordionId(categoryId);
    }
  };

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
                onToggle={handleAccordionToggle}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 54,
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
  accordionBorder: {
    padding: 5,
    borderRadius: 16,
    borderColor: '#F59A11',
    borderWidth: 1,
  },
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
  titleContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  accordionTitleFirstLine: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#181818',
    marginTop: 5,
  },
  accordionTitleSecondLine: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#181818',
    marginTop: 2,
  },
  accordionTitle: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Medium',
    color: '#181818',
    marginRight: 10,
    marginTop: 10,
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
    paddingVertical: 8,
    gap: 10,
  },
  foodCardContainer: {
    width: 130,
    height: 160,
    marginRight: 0,
  },
  foodCardOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    borderColor: '#F59A11',
    borderWidth: 1,
  },
  foodImg: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#181818',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 15,
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
