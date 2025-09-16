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
  ActivityIndicator,
  TextInput,
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

const staticComponents = {
  main_banner: Banner,
  slider: AdBannner,
  grid: CustomGridLayout,
  best_sellers: BestSeller,
  product_banner_ads: EssentialSlider,
  day_in_cats_life: CatLifeScreen,
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
  const [locationFocus, setLocationFocus] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
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

  const renderSection = section => {
    const Component = staticComponents[section.key];
    if (!Component) return null;
    if (section.key === 'grid') {
      return <Component key={section._id} gridData={section.id} />;
    }
    return <Component key={section._id} {...sectionProps[section.key]} />;
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
        {loading && <CustomGridLayoutShimmer />}
        {!loading && !sections && (
          <Text style={styles.errorText}>Error loading sections</Text>
        )}
        {!loading && sections?.map(section => renderSection(section))}
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
  },
  errorText: {
    padding: 16,
    textAlign: 'center',
    color: 'red',
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
