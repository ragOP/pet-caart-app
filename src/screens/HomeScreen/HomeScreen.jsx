import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  Text,
} from 'react-native';
import { MapPin, Search } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import Banner from '../../components/Banner/Banner';
import AdBannner from '../../components/AdBannner/AdBanner';
import BestSeller from '../../components/BestSeller/BestSeller';
import CustomGridLayout from '../../components/CustomGridLayout/CustomGridLayout';
import CustomGridLayoutShimmer from '../../ui/Shimmer/CustomGridLayoutShimmer';
import { checkDelivery } from '../../apis/checkDelivery';
import { getPageConfig } from '../../apis/getPageConfig';
import EssentialSlider from '../../components/EssentialSlider/EssentialSlider';
import CatLifeScreen from '../../components/CatLife/CatLifeScreen';
import Footer from '../../components/Footer/Footer';
import PinBottomSheet from '../../components/PinBottomSheet/PinBottomSheet';
import BannerSlider from '../../components/BannerSlider/BannerSlider';
import BakedProduct from '../../components/BakedProduct/BakedProduct';

const staticComponents = {
  main_banner: Banner,
  // slider: BannerSlider,
  grid: CustomGridLayout,
  best_sellers: BestSeller,
  day_in_cats_life: CatLifeScreen,
  product_banner_ads: BakedProduct,
};

const sectionProps = {
  best_sellers: {
    headingIcon: require('../../assets/icons/paw2.png'),
  },
  product_banner_ads: {
    headingIcon: require('../../assets/icons/paw2.png'),
  },
  day_in_cats_life: {
    headingIcon: require('../../assets/icons/paw2.png'),
    headingTextOrange: 'A Day in Your',
    headingTextBlue: 'Cat Life...',
  },
};

const HomeScreen = () => {
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingdel, setLoadingdel] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const productId = 'nnn';

  useEffect(() => {
    const fetchPageConfig = async () => {
      try {
        setLoading(true);
        const response = await getPageConfig({ pageKey: 'home' });
        setSections(
          response.data.sections.sort((a, b) => a.position - b.position),
        );
      } catch (error) {
        console.error('Error fetching page config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageConfig();
  }, []);

  const handleCheckDelivery = async submittedPincode => {
    try {
      setLoadingdel(true);
      const response = await checkDelivery({
        pincode: submittedPincode,
        productId,
      });
      setDeliveryDate(response.data || '');
    } catch (error) {
      console.error('Delivery check error:', error);
      setDeliveryDate('');
      alert(error.message || 'Error checking delivery');
    } finally {
      setLoadingdel(false);
    }
  };

  const renderSection = section => {
    const Component = staticComponents[section.key];
    if (!Component) return null;
    if (section.key === 'grid') {
      return <Component gridData={section.id} />;
    }
    return <Component {...sectionProps[section.key]} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerWrapper}>
        <View>
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/images/logo1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <SearchBar style={{ flex: 1, marginRight: 10 }} />
            <TouchableOpacity
              style={styles.locationButton}
              activeOpacity={0.6}
              onPress={() => setShowBottomSheet(true)}
            >
              <MapPin color="#FFA500" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && <CustomGridLayoutShimmer />}
        {!loading && !sections && (
          <Text style={styles.errorText}>
            Failed to load page configuration.
          </Text>
        )}
        {!loading &&
          sections?.map((section, idx) => (
            <React.Fragment key={section._id || idx}>
              {renderSection(section)}
            </React.Fragment>
          ))}
        <Footer />
      </ScrollView>

      <PinBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        onSubmit={handleCheckDelivery}
        loading={loadingdel}
        deliveryDate={deliveryDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
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
        shadowColor: '#404040',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollContent: {
    marginTop: 15,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    padding: 16,
    textAlign: 'center',
    color: 'red',
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default HomeScreen;
