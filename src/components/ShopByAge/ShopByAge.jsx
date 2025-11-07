import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const isTablet = width >= 768;
const isSmallScreen = width < 375;
const HORIZONTAL_PADDING = isTablet ? 24 : isSmallScreen ? 12 : 16;
const CARD_MARGIN = isTablet ? 16 : isSmallScreen ? 10 : 12;
const AVAILABLE_WIDTH = width - 2 * HORIZONTAL_PADDING - 2 * CARD_MARGIN;
const CARD_WIDTH = AVAILABLE_WIDTH / 3;

const IMAGE_HEIGHT = isTablet ? 140 : isSmallScreen ? 95 : 110;
const BORDER_WIDTH = isTablet ? 4 : 3;

const ageCategories = [
  {
    id: '1',
    label: '0-6 months',
    image: require('../../assets/images/age.png'),
  },
  {
    id: '2',
    label: '6-24 months',
    image: require('../../assets/images/age.png'),
  },
  {
    id: '3',
    label: '2-3 years',
    image: require('../../assets/images/age.png'),
  },
  {
    id: '4',
    label: '3+ years',
    image: require('../../assets/images/age.png'),
  },
  {
    id: '5',
    label: 'Senior',
    image: require('../../assets/images/age.png'),
  },
  {
    id: '6',
    label: 'All Ages',
    image: require('../../assets/images/age.png'),
  },
];

const ShopByAge = () => {
  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.dogImage}
            resizeMode="cover"
          />
          <View style={styles.curvedBottom} />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText} numberOfLines={2}>
            {item.label}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ageCategories}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F0',
    paddingVertical: 16,
  },

  listContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: isTablet ? 12 : 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_MARGIN,
  },
  card: {
    borderRadius: isTablet ? 20 : 6,
    borderBottomEndRadius: isTablet ? 20 : 16,
    borderBottomStartRadius: isTablet ? 20 : 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: BORDER_WIDTH,
    borderColor: '#F5A623',
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  dogImage: {
    width: '100%',
    height: '100%',
  },
  curvedBottom: {
    position: 'absolute',
    bottom: -5,
    left: -10,
    right: -10,
  },
  labelContainer: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    color: '#fff',
    fontSize: isTablet ? 16 : isSmallScreen ? 13 : 14,
    textAlign: 'center',
    fontFamily: 'Gotham-Rounded-Medium',
  },
});

export default ShopByAge;
