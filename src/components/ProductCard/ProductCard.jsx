import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ProductCard = ({ images, title, rating, price, discount, isVeg, cardWidth = 110 }) => {
  const originalPrice = Number(price);
  const discountPercent = parseInt(discount);
  const hasDiscount = !isNaN(discountPercent) && discountPercent > 0;

  const discountedPrice = hasDiscount
    ? Math.round(originalPrice * (1 - discountPercent / 100))
    : originalPrice;

  return (
    <TouchableOpacity activeOpacity={1} style={[styles.card, { width: cardWidth }]}>
      <View style={styles.imageSection}>
        <LinearGradient
          colors={['#1C83A8', '#48BDE6', '#2F90B3', '#13789DE6']}
          style={styles.bestsellerContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bestsellerText}>BESTSELLER</Text>
        </LinearGradient>

        <Swiper
          style={styles.swiper}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          paginationStyle={styles.pagination}
          autoplay={false}
          loop={false}
          showsPagination
        >
          {images && images.length > 0 ? (
            images.map((imgSrc, index) => (
              <Image
                key={index}
                source={{ uri: imgSrc }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))
          ) : (
            <Text>No images available</Text>
          )}
        </Swiper>

        <Text style={styles.ratingText}>⭐ {rating}</Text>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.titleText} numberOfLines={2}>{title}</Text>
        <View style={styles.vegWrapper}>
          <Image
            source={require('../../assets/images/vegq.png')}
            style={styles.vegIcon}
            resizeMode='contain'
          />
        </View>
      </View>
      <Text style={styles.priceLabel}>PRICE</Text>
      <View style={styles.priceDiscountRow}>
        <Text style={styles.priceValue}>₹{discountedPrice}</Text>
        {hasDiscount && (
          <>
            <Text style={styles.strikePrice}>₹{originalPrice}</Text>
            <View style={styles.discountContainer}>
              <Text style={styles.discountText}>{discount} OFF</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.cartButtonRow}>
        <TouchableOpacity activeOpacity={0.6} style={styles.cartButton}>
          <Text style={styles.cartButtonText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.64,  
    alignSelf: 'center',
    paddingVertical: 9,  
    paddingHorizontal: 5,  
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 5,  
    position: 'relative',
    backgroundColor:'#F6F6F6',
    borderRadius: 6,
    padding: 3,  
  },
  bestsellerContainer: {
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    top: 0,
    left: 1,
    zIndex: 1,
    height: 22,  
    marginRight: 8,
    ...(Platform.OS === 'ios' && {
      width: "63%",  
      height: 19,
    }),
    ...(Platform.OS === 'android' && {
      width: "53%",  
      height: 16.5,
    }),
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 8,  
    fontFamily:'Gotham-Rounded-Bold',
  },
  swiper: {
    height: screenHeight * 0.12,  
    width: '100%',
  },
  productImage: {
    marginTop: 6,  
    width: '100%',
    height: 64, 
  },
  dot: {
    backgroundColor: '#ccc',
    width: 4,
    height: 4,
    borderRadius: 3,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#333',
    width: 6,
    height: 6,
    borderRadius: 4,
    margin: 3,
  },
  pagination: {
    bottom: -5,
  },
  ratingText: {
    fontSize: 9,  
    color: '#333',
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,  
  },
  titleText: {
    fontSize: 14, 
    fontWeight: '600',
    color: '̀',
    flex: 1,
    flexWrap: 'wrap',
    fontFamily:'Gotham-Rounded-Light',
  },
  vegWrapper: {
    alignItems: 'center',
    marginLeft: 4,  
    width: 22,  
  },
  vegIcon: {
    width: 14,  
    height: 16, 
    marginRight: 3, 
  },
  priceLabel: {
    fontSize: 10,  
    color: '#6A6868',
    marginTop: 6, 
    fontFamily: "Gotham-Rounded-Light",
  },
  priceDiscountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 3,
  },
  priceValue: {
    fontSize: 12,  
    color: '#218032',
    fontFamily: "Gotham-Rounded-Bold",
  },
  strikePrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 10,  
    marginLeft: 5,  
    fontFamily: "Gotham-Rounded-Bold",
  },
  discountContainer: {
    backgroundColor: '#004E6A',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginLeft: 6,  
  },
  discountText: {
    color: '#fff',
    fontSize: 8,  
    fontWeight: '600',
    fontFamily: "Gotham-Rounded-Bold",
  },
  cartButtonRow: {
    marginTop: 6,  
  },
  cartButton: {
    backgroundColor: '#F59A11',
    paddingVertical: 6,  
    borderRadius: 8,
    width: '100%',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 9,  
    textAlign: 'center',
    fontFamily: "Gotham-Rounded-Bold",
  },
});
