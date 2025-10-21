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
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH <= 360 || SCREEN_HEIGHT <= 640;
const banners = [
  {
    label: 'CATEGORIES',
    nav: 'AllCategoriesScreen',
    image: require('../../assets/images/Category.png'),
  },
  {
    label: 'BRANDS',
    nav: 'BrandScreen',
    image: require('../../assets/images/Brand.png'),
  },
  {
    label: 'SHOP BY BREED',
    nav: 'Breed',
    image: require('../../assets/images/Breed.png'),
  },
  {
    label: 'NEW LAUNCHES',
    nav: 'LaunchesScreen',
    image: require('../../assets/images/Newlaunch.png'),
  },
];

const CollectionScreen = ({ navigation }) => {
  const dynamicStyles = useMemo(() => makeStyles(isSmallDevice), []);
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
        {/* <EssentialSlider
          headingIcon={require('../../assets/icons/paw2.png')}
          headingTextOrange="Shop"
          headingTextBlue="By Store"
        /> */}
      </ScrollView>
    </View>
  );
};

export default CollectionScreen;

const makeStyles = small =>
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
    },
    banner: {
      width: '100%',
      height: small ? 80 : 110,
      marginVertical: small ? 6 : 10,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 0,
    },
    bannerImg: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
  });
