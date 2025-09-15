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
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { MapPin, Search } from 'lucide-react-native';
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
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import ProductSliderShimmer from '../../ui/Shimmer/ProductSliderShimmer';
import NewlyLaunchedSlider from '../../components/NewlyLaunchedSlider/NewlyLaunchedSlider';
import CatLifeScreen from '../../components/CatLife/CatLifeScreen';
import BakedProduct from '../../components/BakedProduct/BakedProduct';
import Footer from '../../components/Footer/Footer';
import AdBannner from '../../components/AdBannner/AdBanner';
import PetPromosList from '../../components/PetPromos/PetPromos';
import CustomGridLayout from '../../components/CustomGridLayout/CustomGridLayout';
import { checkDelivery } from '../../apis/checkDelivery';
import CustomGridLayoutShimmer from '../../ui/Shimmer/CustomGridLayoutShimmer';

const HomeScreen = () => {
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [sliderData, setSliderData] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [essentialsData, setEssentialsData] = useState([]);
  const [addToCartData, setAddToCartData] = useState([]);
  const [bestSellerData, setBestSellerData] = useState([]);
  const [newlyLaunchedData, setNewlyLaunchedData] = useState([]);
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingdel, setLoadingdel] = useState(false);
  const [locationFocus, setLocationFocus] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const productId = 'some-product-id';

  useEffect(() => {
    const fetchGrids = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://pet-caart-be.onrender.com/api/home-config/get-all-grid?keyword=home',
        );
        const data = await res.json();
        if (data?.data) {
          console.log('sss', data);
          setGrids(data.data);
        }
      } catch (error) {
        console.error('Error fetching home grids:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchBanner = async () => {
      try {
        const response = await getAdBanner();
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
              image: {
                uri: item.images?.[0] || item.variants?.[0]?.images?.[0] || '',
              },
            }));
          const addToCart = allProducts
            .filter(item => item.isAddToCart)
            .map(item => ({
              id: item._id,
              label: item.title,
              image: {
                uri: item.images?.[0] || item.variants?.[0]?.images?.[0] || '',
              },
            }));
          const bestSellers = allProducts
            .filter(item => item.isBestSeller && Number(item.salePrice) < 599)
            .map(item => {
              const discountPercent = item.salePrice
                ? Math.round(((item.price - item.salePrice) / item.price) * 100)
                : 0;

              return {
                _id: item._id,
                title: item.title,
                rating: item.ratings?.average || 0,
                price: item.price,
                discount: discountPercent > 0 ? discountPercent + '%' : '0%',
                images: item.images || item.variants?.[0]?.images || [],
                isVeg: item.isVeg || false,
                brandId: item.brandId,
                variants: item.variants || [],
              };
            });

          const newlyLaunched = allProducts
            .filter(item => (item.newleyLaunced = true))
            .map(item => {
              return {
                id: item._id,
                label: item.title,
                image: {
                  uri:
                    item.images?.[0] || item.variants?.[0]?.images?.[0] || '',
                },
                isBestSeller: item.isBestSeller || false,
              };
            });

          setBestSellerData(bestSellers);
          setEssentialsData(essentials);
          setAddToCartData(addToCart);
          setNewlyLaunchedData(newlyLaunched);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchGrids();
    fetchProducts();
    fetchBanner();
    fetchSliders();
  }, []);
  const handleCheckDelivery = async () => {
    try {
      setLoadingdel(true);
      const response = await checkDelivery({ pincode, productId });
      console.log('Delivery check response:', response);
      setDeliveryDate(response.data || '');
    } catch (error) {
      console.error('Delivery check error:', error);
      alert(error.message || 'Error checking delivery');
      setDeliveryDate('');
    } finally {
      setLoadingdel(false);
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
        <SafeAreaView>
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/images/logo1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            {!locationFocus ? (
              <>
                <SearchBar style={{ flex: 1, marginRight: 10 }} />
                <TouchableOpacity
                  style={styles.locationButton}
                  activeOpacity={0.6}
                  onPress={() => setLocationFocus(true)}
                >
                  <MapPin color="#FFA500" size={24} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => setLocationFocus(false)}
                  activeOpacity={1}
                >
                  <Search color="#165174" size={24} />
                </TouchableOpacity>
                <View style={styles.pincodeContainer}>
                  <View style={styles.iconWithSeparator}>
                    <MapPin
                      color="#FFA500"
                      size={24}
                      style={styles.mapPinIcon}
                    />
                    <View style={styles.divider} />
                  </View>
                  <TextInput
                    style={[
                      styles.pincodeInput,
                      { fontSize: 9.5, fontWeight: 'bold' },
                    ]}
                    placeholder="Enter PINCODE"
                    keyboardType="default"
                    maxLength={deliveryDate ? undefined : 6}
                    value={
                      deliveryDate
                        ? `Expected delivery: ${deliveryDate}`
                        : pincode
                    }
                    onChangeText={text => {
                      setDeliveryDate('');
                      setPincode(text);
                    }}
                    autoFocus={!deliveryDate}
                    editable={true}
                  />

                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleCheckDelivery}
                    disabled={loadingdel}
                    activeOpacity={1}
                  >
                    {loadingdel ? (
                      <ActivityIndicator size="small" color="#165174" />
                    ) : (
                      <Search color="#165174" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loadingBanner ? (
          <BannerShimmer />
        ) : bannerImageUrl ? (
          <Banner source={{ uri: bannerImageUrl }} />
        ) : null}

        {/* {sliderData.length === 0 ? (
          <BannerSliderShimmer />
        ) : (
          <BannerSlider data={sliderData} />
        )} */}

        {/* {essentialsData.length === 0 ? (
  <EssentialsSliderShimmer />
) : (
  <EssentialsSlider
    products={essentialsData}
    headingIcon={require('../../assets/icons/paw2.png')}
      headingTextOrange="Everyday"
    headingTextBlue="Essentials"
 
  />
)} */}
        <AdBannner />
        {loading ? (
          <CustomGridLayoutShimmer />
        ) : grids.length > 0 ? (
          grids.map(grid => (
            <CustomGridLayout
              key={grid._id}
              gridData={grid}
              isLoading={loading}
            />
          ))
        ) : (
          <Text style={styles.errorText}>No grids available</Text>
        )}

        {/* <EssentialsSlider
          headingIcon={require('../../assets/icons/paw2.png')}
          headingTextOrange="Everyday"
          headingTextBlue="Essentials"
        /> */}
        {/* {loading ? (
          <CustomGridLayoutShimmer />
        ) : grids.length > 0 && grids[3] ? (
          <CustomGridLayout
            key={grids[3]._id}
            gridData={grids[3]}
            isLoading={loading}
          />
        ) : (
          <Text style={styles.errorText}>No grids available</Text>
        )} */}
        {/* {loading ? (
          <CustomGridLayoutShimmer />
        ) : grids.length > 0 && grids[0] ? (
          <CustomGridLayout
            key={grids[0]._id}
            gridData={grids[0]}
            isLoading={loading}
          />
        ) : (
          <Text style={styles.errorText}>No grids available</Text>
        )} */}
        {/* {loading ? (
          <CustomGridLayoutShimmer />
        ) : grids.length > 0 && grids[2] ? (
          <CustomGridLayout
            key={grids[2]._id}
            gridData={grids[2]}
            isLoading={loading}
          />
        ) : (
          <Text style={styles.errorText}>No grids available</Text>
        )} */}
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
        {/* <AdBannner /> */}

        {/* {newlyLaunchedData.length === 0 ? (
          <ProductSliderShimmer />
        ) : (
          <NewlyLaunchedSlider
            products={newlyLaunchedData}
            headingIcon={require('../../assets/icons/paw2.png')}
            headingTextOrange="Newly"
            headingTextBlue="Launched"
          />
        )} */}
        {bestSellerData.length === 0 ? (
          <ProductSliderShimmer />
        ) : (
          <ProductSlider
            headingIcon={require('../../assets/icons/paw2.png')}
            headingTextOrange="Bestsellers"
            headingTextBlue="Under ₹599"
            products={bestSellerData}
          />
        )}
        {/* {loading ? (
          <CustomGridLayoutShimmer />
        ) : grids.length > 0 && grids[1] ? (
          <CustomGridLayout
            key={grids[1]._id}
            gridData={grids[1]}
            isLoading={loading}
          />
        ) : (
          <Text style={styles.errorText}>No grids available</Text>
        )} */}

        {/* <CatLifeScreen
          headingIcon={require('../../assets/icons/paw2.png')}
          headingTextOrange="A Day in Your"
          headingTextBlue="Cat’s Life..."
        />
        <BakedProduct style={styles.baked} /> */}
        <PetPromosList />
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  logo: {
    width: 70,
    height: 50,
    marginRight: 10,
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#4040400D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
    // marginBottom: 16,
  },
  baked: {
    width: '93%',
    alignSelf: 'center',
    paddingTop: 20,
  },
  pincodeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginLeft: 10,
    paddingHorizontal: 10,
    elevation: 2,
    height: 50,
  },
  mapPinIcon: {
    marginRight: 8,
  },
  pincodeInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'gotham-rounded-book',
  },
  searchButton: {
    padding: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  locationButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#4040400D',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconWithSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#ccc',
    marginLeft: 1,
  },
});

export default HomeScreen;
