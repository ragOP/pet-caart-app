import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import EssentialSlider from '../../components/EssentialSlider/EssentialSlider';
import CustomGridLayout from '../../components/CustomGridLayout/CustomGridLayout';
import ShopByAge from '../../components/ShopByAge/ShopByAge';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH <= 360 || SCREEN_HEIGHT <= 640;
const isTablet = SCREEN_WIDTH >= 768;

const banners = [
  {
    label: 'CATEGORIES',
    nav: 'AllCategoriesScreen',
    image: require('../../assets/images/cban1.png'),
  },
  {
    label: 'BRANDS',
    nav: 'BrandScreen',
    image: require('../../assets/images/cban3.png'),
  },
  {
    label: 'SHOP BY STORE',
    nav: 'ProductListScreen',
    image: require('../../assets/images/cban2.png'),
  },
];

const CollectionScreen = ({ navigation }) => {
  const dynamicStyles = useMemo(
    () => makeStyles(isSmallDevice, isTablet),
    [isSmallDevice, isTablet],
  );

  return (
    <View style={dynamicStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={dynamicStyles.headerWrapper}>
        <View style={dynamicStyles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={dynamicStyles.backButton}
            activeOpacity={1}
          >
            <ArrowLeft size={isSmallDevice ? 24 : 30} color="#000" />
          </TouchableOpacity>
          <SearchBar style={dynamicStyles.searchBar} />
        </View>
      </View>
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
        <View style={dynamicStyles.bannersContainer}>
          {banners.map(item => (
            <TouchableOpacity
              key={item.label}
              style={dynamicStyles.banner}
              onPress={() => navigation.navigate(item.nav)}
              activeOpacity={1}
            >
              <Image
                source={item.image}
                style={dynamicStyles.bannerImg}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
        <ShopByAge />
      </ScrollView>
    </View>
  );
};

export default CollectionScreen;

const makeStyles = (small, tablet) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerWrapper: {
      backgroundColor: '#FFFFFF',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: small ? 10 : 15,
      paddingVertical: small ? 6 : 8,
      gap: small ? 6 : 10,
      ...Platform.select({
        ios: {
          paddingVertical: 0,
          paddingTop: 8,
        },
      }),
    },
    backButton: {
      paddingRight: small ? 8 : 15,
    },
    searchBar: {
      flex: 1,
      height: small ? 36 : 44,
    },
    scrollContent: {
      paddingVertical: small ? 6 : 10,
      // paddingHorizontal: tablet ? '10%' : 0,
    },
    bannersContainer: {
      width: '100%',
      maxWidth: tablet ? '100%' : '100%',
      alignSelf: 'center',
    },
    banner: {
      width: '100%',
      height: small ? 80 : tablet ? 200 : 110,
      marginVertical: small ? 6 : tablet ? 12 : 10,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: tablet ? 8 : 0,
    },
    bannerImg: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
  });
