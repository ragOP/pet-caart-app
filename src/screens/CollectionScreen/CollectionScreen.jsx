import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import SearchBar from '../../components/SearchBar/SearchBar';
import EssentialSlider from '../../components/EssentialSlider/EssentialSlider';
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
    nav: 'BreedScreen',
    image: require('../../assets/images/Breed.png'),
  },
  {
    label: 'NEW LAUNCHES',
    nav: 'LaunchesScreen',
    image: require('../../assets/images/Newlaunch.png'),
  },
];
const CollectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
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
          <SearchBar style={styles.searchBar} />
        </View>
      </View>
      <ScrollView>
        {banners.map((item, idx) => (
          <TouchableOpacity
            key={item.label}
            style={styles.banner}
            onPress={() => navigation.navigate(item.nav)}
            activeOpacity={0.8}
          >
            <Image
              source={item.image}
              style={styles.bannerImg}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
        <EssentialSlider
          headingIcon={require('../../assets/icons/paw2.png')}
          headingTextOrange="Shop"
          headingTextBlue="By Store"
        />
      </ScrollView>
    </View>
  );
};

export default CollectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerWrapper: {
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    paddingRight: 15,
  },
  searchBar: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 110,
    marginVertical: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
