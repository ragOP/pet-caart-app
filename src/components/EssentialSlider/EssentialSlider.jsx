import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity,ImageBackground } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const ITEM_WIDTH = windowWidth / 4.1;

const EssentialsSlider = ({ products, headingIcon, headingTextOrange, headingTextBlue, onItemPress }) => {
  return (
    <View style={styles.container}>
      {headingIcon && ( 
        <View style={styles.headingContainer}>
          <Image
            source={headingIcon}
            style={styles.iconImage}
            resizeMode="contain"
          />
          <Text style={styles.headingText}>
            <Text style={styles.orange}>{headingTextOrange} </Text>
            <Text style={styles.blue}>{headingTextBlue}</Text>
          </Text>
        </View>
      )}

<FlatList
  horizontal
  showsHorizontalScrollIndicator={false}
  data={products}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }} 
  renderItem={({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
 { marginRight: index === products.length - 1 ? 0 : 28 },      ]}
      activeOpacity={1}
      onPress={() => {}}
    >
      <ImageBackground
        source={require('../../assets/images/productbg.png')}
        style={styles.cardBackground}
        imageStyle={styles.cardBgImage}
      >
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.label} numberOfLines={2} ellipsizeMode="tail">
          {item.label}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  )}
/>


    </View>
  );
};

export default EssentialsSlider;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FDF4E6',
    height: 220, 
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
    fontFamily: 'Gotham-Rounded-Bold',
  },
  orange: {
    color: '#f39c12',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  blue: {
    color: '#3498db',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  card: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  
  label: {
    marginTop: 6,
  fontFamily:'Gotham-Rounded-Bold',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    width: '100%',
  },
  cardBackground: {
    width: 100,       
    height: 100,      
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
  shadowOffset: { width: 2, height: 5 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
              
  },
  cardBgImage: {
    borderRadius: 10,
    resizeMode: 'contain',
  },
  image: {
    width: 120,   
    height: 120,  
    zIndex: 1,
  },
  
  
});