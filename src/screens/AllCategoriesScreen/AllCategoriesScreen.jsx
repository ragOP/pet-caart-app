import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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
import SearchBar from '../../components/SearchBar/SearchBar';
import { getSubCategories } from '../../apis/getSubCategories';
import { getCollection } from '../../apis/getCollection';
import { getCategories } from '../../apis/getCategories';
import CollectionShimmer from '../../ui/Shimmer/CollectionShimmer';

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
              <Text style={styles.accordionSubtitle}>
                {category.description}
              </Text>
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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeAccordionId, setActiveAccordionId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const underlineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const apiResponse = await getCategories();
        const filteredCats = apiResponse.data.data.categories
          .filter(c => c.name === 'Dogs' || c.name === 'Cats')
          .sort((a, b) => (a.name === 'Dogs' ? -1 : 1));
        setCategories(filteredCats);

        const res = await getSubCategories();
        if (res?.data?.data) {
          setSubCategories(res.data.data);
        }
        const newCollections = {};
        if (res?.data?.data) {
          const allSubcatIds = res.data.data.map(subcat => subcat._id);
          for (const subcatId of allSubcatIds) {
            try {
              const collectionRes = await getCollection();
              newCollections[subcatId] = collectionRes.data.data.filter(
                item => item.subCategoryId === subcatId,
              );
            } catch (error) {
              newCollections[subcatId] = [];
            }
          }
          setCollections(newCollections);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccordionToggle = subCategoryId => {
    if (activeAccordionId === subCategoryId) {
      setActiveAccordionId(null);
    } else {
      setActiveAccordionId(subCategoryId);
    }
  };

  const handleCollectionClick = (
    categorySlug,
    collectionSlug,
    collectionName,
  ) => {
    navigation.navigate('ProductListScreen', {
      categorySlug,
      collectionSlug,
      collectionName,
    });
  };

  const filteredSubcategories =
    categories.length > 0
      ? subcategories.filter(
          subcat => subcat.categoryId === categories[activeTab]?._id,
        )
      : [];

  const TAB_LABELS = categories.map(c => c.name);
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

  const renderRow = items => (
    <View style={styles.row}>
      {items.map(item => (
        <TouchableOpacity
          key={item._id}
          style={styles.foodCardContainer}
          onPress={() =>
            handleCollectionClick(
              filteredSubcategories.find(sub => sub._id === item.subCategoryId)
                ?.slug || '',
              item.slug,
              item.name,
            )
          }
        >
          <FoodCard label={item.name} image={item.image} />
        </TouchableOpacity>
      ))}
      {items.length < 3 && (
        <View style={[styles.foodCardContainer, styles.emptyCard]} />
      )}
    </View>
  );

  const renderRows = items => {
    const rows = [];
    for (let i = 0; i < items.length; i += 3) {
      rows.push(items.slice(i, i + 3));
    }
    return rows.map((row, idx) => <View key={idx}>{renderRow(row)}</View>);
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
            onPress={() => navigation.goBack()}
            style={styles.backButton}
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
                {collections[category._id]?.length > 0 ? (
                  <View style={styles.foodCategories}>
                    {renderRows(collections[category._id])}
                  </View>
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  accordionRoot: { marginVertical: 2 },
  accordionBorder: { padding: 5 },
  accordionHeader: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
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
  foodCategories: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  foodCardContainer: {
    width: '33%',
    paddingHorizontal: 4,
  },
  emptyCard: {
    backgroundColor: 'transparent',
  },
  foodCardOuter: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    borderColor: '#EEE',
    borderWidth: 1,
    width: '100%',
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
