import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import ProductCard from '../ProductCard/ProductCard';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3) / 2;

const ProductSlider = ({
  products,
  headingIcon,
  headingTextOrange = 'Bestsellers',
  headingTextBlue = 'Under ₹599',
}) => {
  return (
    <View style={styles.container}>
      {(headingIcon || headingTextOrange || headingTextBlue) && (
        <View style={styles.headingContainer}>
          {headingIcon && (
            <Image
              source={headingIcon}
              style={styles.iconImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.headingText}>
            <Text style={styles.orange}>{headingTextOrange} </Text>
            <Text style={styles.blue}>{headingTextBlue}</Text>
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
       {products.map((item, index) => {
  return (
    <View key={index} style={[styles.cardWrapper, { width: CARD_WIDTH }]}>
      <ProductCard
        images={item.images}  
        title={item.title}
        rating={item.rating}
        price={item.price}
        discount={item.discount}
        isVeg={item.isVeg}
        stock={item.stock}
        cardWidth={CARD_WIDTH}
      />
    </View>
  );
})}
      </ScrollView>
    </View>
  );
};

export default ProductSlider;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconImage: {
    width: 35,
    height: 35,
    marginRight: 8,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },
  orange: {
    color: '#f39c12',
    fontFamily: 'Gotham-Rounded-Bold',

  },
  blue: {
    color: '#3498db',
    fontFamily: 'Gotham-Rounded-Bold',

  },
  scrollContent: {
    paddingRight: 12,
  },
  cardWrapper: {
    marginRight: 12,
  },
});
