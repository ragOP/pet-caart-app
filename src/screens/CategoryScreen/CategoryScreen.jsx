import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, SafeAreaView, Platform, Text } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import Banner from '../../components/Banner/Banner';
import { getProductBanner } from '../../apis/getProductBanner';
import ProductBanner from '../../components/ProductBanner/ProductBanner';
import CategoryCard from '../../components/CategoryCard/CategoryCard';

const CategoryScreen = ({ navigation }) => {
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [loadingBanner, setLoadingBanner] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getProductBanner({ params: {} });
        const imageUrl = response?.data?.data?.image;
       if (imageUrl) {
          setBannerImageUrl(imageUrl);
        } else {
          throw new Error("No image URL found");
        }
      } catch (error) {
        console.error("Error fetching banner image:", error.message);
        console.error("Full error object:", error);
      } finally {
        setLoadingBanner(false);
      }
    };
    fetchBanner();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" translucent={false} />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={30} color="#000" />
            </TouchableOpacity>
            <SearchBar style={styles.searchBar} />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        {loadingBanner ? (
          <Text>Loading banner...</Text>
        ) : bannerImageUrl ? (
         <ProductBanner source={{ uri: bannerImageUrl }}  style={{ paddingLeft: 20, paddingRight: 20 }} />

        ) : (
          <Text>No banner image found</Text>
        )}
      </View>
      <CategoryCard/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 ,
    backgroundColor: '#FFFBF6',

  },
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
  backButton: {
    paddingRight: 15,
  },
  searchBar: {
    flex: 1,
  },
  content: {
paddingTop:10
  },
});

export default CategoryScreen;
