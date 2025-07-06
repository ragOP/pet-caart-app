import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import BannerSlider from '../../components/BannerSlider/BannerSlider';
import EssentialsSlider from '../../components/EssentialSlider/EssentialSlider';
import Banner from '../../components/Banner/Banner';
import { getAdBanner } from '../../apis/getAdBanner';
import { getSliders } from '../../apis/getSliders';
import BannerShimmer from '../../ui/Shimmer/BannerShimmer';
import { getProducts } from '../../apis/getProducts';
import BannerSliderShimmer from '../../ui/Shimmer/BannerSliderShimmer';
import EssentialsSliderShimmer from '../../ui/Shimmer/EssentialsSliderShimmer';

const products = [
  {
    id: '1',
    label: 'Dry Food',
    image: require('../../assets/images/catProduct.png'),
  },
  {
    id: '2',
    label: 'Wet Food',
    image: require('../../assets/images/catProduct.png'),
  },
  {
    id: '3',
    label: 'Chicken Gravy',
    image: require('../../assets/images/catProduct.png'),
  },
  {
    id: '4',
    label: 'Dry Food',
    image: require('../../assets/images/catProduct.png'),
  },
  {
    id: '5',
    label: 'Chicken Gravy',
    image: require('../../assets/images/catProduct.png'),
  },
];

const HomeScreen = () => {
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [sliderData, setSliderData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [essentialsData, setEssentialsData] = useState([]);
  const [addToCartData, setAddToCartData] = useState([]);
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getAdBanner();
        console.log('Banner API response:', response);
        const url = response?.data?.data?.[0]?.image;
        if (url) {
          setBannerImageUrl(url);
        } else {
          console.warn('No image URL found');
        }
      } catch (error) {
        console.error('Error fetching banner image:', error);
      } finally {
        setLoadingBanner(false);
      }
    };

    const fetchSliders = async () => {
      try {
        const response = await getSliders();
        console.log('Sliders API response:', response);
        const sliders = response?.data?.data;
        if (sliders && sliders.length > 0) {
          const sliderImages = sliders.map(slider => ({
            image: { uri: slider.image },
            link: slider.link,
            id: slider.id,
            isActive: slider.isActive,
            type: slider.type,
          }));
          setSliderData(sliderImages);
        } else {
          console.warn('No sliders found');
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const allProducts = response?.data?.data;
    
        if (Array.isArray(allProducts)) {
          const essentials = allProducts
            .filter(item => item.isEverydayEssential)
            .map(item => ({
              id: item._id,
              label: item.title,
              image: { uri: item.images?.[0] || item.variants?.[0]?.images?.[0] || '' },
            }));
    
          const addToCart = allProducts
            .filter(item => item.isAddToCart)
            .map(item => ({
              id: item._id,
              label: item.title,
              image: { uri: item.images?.[0] || item.variants?.[0]?.images?.[0] || '' },
            }));
    
          setEssentialsData(essentials);
          setAddToCartData(addToCart);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
    fetchBanner();
    fetchSliders();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5E1" translucent={false} />
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <SearchBar />
            <TouchableOpacity style={styles.locationButton} activeOpacity={1}>
              <MapPin color="#FFA500" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loadingBanner ? (
          <BannerShimmer />
        ) : bannerImageUrl ? (
          <Banner source={{ uri: bannerImageUrl }} />
        ) : null}

{sliderData.length === 0 ? (
  <BannerSliderShimmer />
) : (
  <BannerSlider data={sliderData} />
)}

{essentialsData.length === 0 ? (
  <EssentialsSliderShimmer />
) : (
  <EssentialsSlider
    products={essentialsData}
    headingIcon={require('../../assets/icons/paw2.png')}
    headingTextOrange="Everyday"
    headingTextBlue="Essentials"
  />
)}

{addToCartData.length === 0 ? (
  <EssentialsSliderShimmer />
) : (
  <EssentialsSlider
    products={addToCartData}
    headingIcon={require('../../assets/icons/paw2.png')}
    headingTextOrange="Trending"
    headingTextBlue="Add-To-Carts"
  />
)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    backgroundColor: '#FEF5E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  logo: {
    width: 50,
    height: 40,
    marginRight: 10,
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#F2F2F2',
    marginBottom: 16,
  },
});

export default HomeScreen;
