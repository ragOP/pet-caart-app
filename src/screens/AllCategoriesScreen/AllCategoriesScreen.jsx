import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import AdBannner from '../../components/AdBannner/AdBanner';
import { getSubCategories } from '../../apis/getSubCategories';
import { getCollection } from '../../apis/getCollection';

function AccordionSection({ category, children, isOpen, onToggle }) {
  const [heightAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 'auto' : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  return (
    <View style={styles.accordionRoot}>
      <LinearGradient
        colors={['#F59A11', '#8B9259', '#0888B1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.accordionBorder}
      >
        <TouchableOpacity
          onPress={() => onToggle(category._id)}
          activeOpacity={1}
        >
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
      <Animated.View style={[styles.accordionBody, { height: heightAnim }]}>
        {isOpen && children}
      </Animated.View>
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
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState({});
  const [loadingCollections, setLoadingCollections] = useState({});
  const [activeAccordionId, setActiveAccordionId] = useState(null);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await getSubCategories();
      if (res?.data?.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching subcategories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async subCategoryId => {
    try {
      setLoadingCollections(prev => ({ ...prev, [subCategoryId]: true }));
      const res = await getCollection();
      if (res?.data?.data) {
        const filtered = res.data.data.filter(
          item => item.subCategoryId === subCategoryId,
        );
        setCollections(prev => ({ ...prev, [subCategoryId]: filtered }));
      }
    } catch (error) {
      console.log('Error fetching collections:', error);
    } finally {
      setLoadingCollections(prev => ({ ...prev, [subCategoryId]: false }));
    }
  };

  const handleAccordionToggle = subCategoryId => {
    if (activeAccordionId === subCategoryId) {
      setActiveAccordionId(null);
    } else {
      setActiveAccordionId(subCategoryId);
      fetchCollections(subCategoryId);
    }
  };
  const handleCollectionClick = (
    categorySlug,
    collectionSlug,
    collectionName,
  ) => {
    console.log('Category Slug:', categorySlug);
    console.log('Collection Slug:', collectionSlug);
    navigation.navigate('ProductListScreen', {
      categorySlug,
      collectionSlug,
      collectionName,
    });
  };
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
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={30} color="#000" />
          </TouchableOpacity>
          <SearchBar />
        </View>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#F5A500" />
        </View>
      ) : (
        <ScrollView style={styles.screen}>
          <AdBannner />

          {categories.map(category => (
            <AccordionSection
              key={category._id}
              category={category}
              isOpen={activeAccordionId === category._id}
              onToggle={handleAccordionToggle}
            >
              {loadingCollections[category._id] ? (
                <ActivityIndicator size="small" color="#F5A500" />
              ) : collections[category._id]?.length > 0 ? (
                <View style={styles.foodCategories}>
                  {collections[category._id].map(item => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() =>
                        handleCollectionClick(
                          category.slug,
                          item.slug,
                          item.name,
                        )
                      }
                    >
                      <FoodCard
                        key={item._id}
                        label={item.name}
                        image={item.image}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#888',
                    marginTop: 20,
                    fontFamily: 'Gotham-Rounded-Medium',
                  }}
                >
                  No collections found
                </Text>
              )}
            </AccordionSection>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF6' },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backButton: { paddingRight: 15 },
  screen: { backgroundColor: '#fff' },
  accordionRoot: { marginVertical: 10 },
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
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 0,
  },
  foodCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 1,
  },
  foodCardOuter: {
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 10,
    width: '90%',
    padding: 5,
  },
  foodImg: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#181818',
    textAlign: 'center',
  },
});
