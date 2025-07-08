import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import ProductCard from '../ProductCard/ProductCard';
import FilterBar from '../FilterBar/FilterBar';
import { getSubCategories } from '../../apis/getSubCategories';
import { getProducts } from '../../apis/getProducts'; 

const windowWidth = Dimensions.get('window').width;

const CategoryCard = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [products, setProducts] = useState([]);

  const fetchSubCategories = async () => {
    try {
      const subCategoriesData = await getSubCategories();
      if (subCategoriesData && subCategoriesData.data && subCategoriesData.data.data && subCategoriesData.data.data.length > 0) {
        setCategories(subCategoriesData.data.data);  
        setSelectedCategory(subCategoriesData.data.data[0]);  
      } else {
        console.error('No categories in the response data');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    } finally {
      setLoading(false);  
    }
  };

  const fetchProducts = async (subCategorySlug) => {
    setLoading(true);   
    try {
      const productsData = await getProducts({ subCategorySlug });
      if (productsData && productsData.data && productsData.data.data.length > 0) {
        setProducts(productsData.data.data); 
      } else {
        setProducts([]);  
        console.log('No products found for this subcategory.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); 
    }
  };
  

  useEffect(() => {
    fetchSubCategories(); 
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory.slug); 
    }
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <FilterBar />
      <ScrollView style={styles.mainContainer}>
        <View style={styles.mainContent}>
          <View style={styles.sidebar}>
            {loading ? (
              <ActivityIndicator size="large" color="#F59A11" style={styles.centeredIndicator}/>
            ) : (
              <FlatList
                data={categories}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSelectedCategory(item)}  
                      style={[
                        styles.categoryItem,
                        item._id === selectedCategory?._id && styles.selectedCategory,
                      ]}
                    >
                      <Image source={{ uri: item.image }} style={styles.categoryImage} />
                      <Text style={styles.categoryName}>{item.name}</Text>
                      {item._id === selectedCategory?._id && <View style={styles.selectedLine} />}
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text>No categories available</Text>} 
              />
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>{selectedCategory?.name}</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#F59A11" style={styles.centeredIndicator}/>
            ) : (
              <FlatList
                data={products}
                renderItem={({ item }) => (
                  <ProductCard
                    images={item.images}
                    title={item.title}
                    price={item.price}
                    discount={item.discount}
                    rating={item.rating}
                    isVeg={item.isVeg}
                    cardWidth={windowWidth * 0.33}
                  />
                )}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={<Text>No products available</Text>}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 60,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 115,
    backgroundColor: '#FFFBF6',
    paddingVertical: 20,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
    position: 'relative',
  },
  categoryImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedCategory: {
    borderRadius: 5,
    paddingRight: 10,
  },
  selectedLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#F59A11',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#FFFBF6',
   
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Gotham-Rounded-Medium',
    marginBottom: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centeredIndicator: {
    flex: 1,
  },
  
});

export default CategoryCard;
