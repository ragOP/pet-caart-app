import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SearchBar from '../../components/SearchBar/SearchBar';
import AdBannner from '../../components/AdBannner/AdBanner';
import { getSubCategories } from '../../apis/getSubCategories';
import { getCollection } from '../../apis/getCollection';

// Accordion Section Component
function AccordionSection({ category, children, onToggle }) {
  const [open, setOpen] = useState(false);

  const toggleAccordion = () => {
    const newState = !open;
    setOpen(newState);
    if (newState) {
      onToggle(category._id); // 👈 jab open hoga tab collection load
    }
  };

  return (
    <View style={styles.accordionRoot}>
      <LinearGradient
        colors={['#f9d923', '#00a19d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.accordionBorder}
      >
        <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.8}>
          <View style={styles.accordionHeader}>
            <View style={styles.headerTextWrapper}>
              <View style={styles.rowWithChevron}>
                <Text style={styles.accordionTitle}>{category.name}</Text>
                {open ? (
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
          </View>
        </TouchableOpacity>
      </LinearGradient>
      {open && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
}

// Food Card Component (for collections)
function FoodCard({ label, image }) {
  return (
    <View style={styles.foodCardOuter}>
      <View style={styles.foodCardBackground}>
        <Image source={{ uri: image }} style={styles.foodImg} />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

// Main Screen
export default function AllCategoriesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState({});
  const [loadingCollections, setLoadingCollections] = useState({});

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
              onToggle={fetchCollections}
            >
              {loadingCollections[category._id] ? (
                <ActivityIndicator size="small" color="#F5A500" />
              ) : collections[category._id]?.length > 0 ? (
                <View style={styles.foodCategories}>
                  {collections[category._id].map(item => (
                    <FoodCard
                      key={item._id}
                      label={item.name}
                      image={item.image}
                    />
                  ))}
                </View>
              ) : (
                <Text style={{ textAlign: 'center', color: '#888' }}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  headerTextWrapper: { flex: 1, justifyContent: 'center' },
  rowWithChevron: { flexDirection: 'row', alignItems: 'center' },
  accordionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 6,
  },
  chevronIcon: { marginTop: 2 },
  accordionSubtitle: { fontSize: 12, color: '#666', marginTop: 1 },
  icon: { width: 90, height: 58, resizeMode: 'contain', marginLeft: 8 },
  accordionBody: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 0,
  },
  foodCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  foodCardOuter: { alignItems: 'center', marginVertical: 16, width: 120 },
  foodCardBackground: {
    minWidth: 108,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    alignSelf: 'center',
    position: 'relative',
  },
  foodImg: {
    width: 50,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    top: -40,
  },
  cardLabel: {
    marginTop: 48,
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
});
