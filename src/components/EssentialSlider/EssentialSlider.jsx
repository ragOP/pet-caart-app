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
  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}  // yeh gap add karega items ke beech
  contentContainerStyle={{ paddingHorizontal: 15 }}  // container ke sides me padding
  renderItem={({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={1} onPress={() => {}}>
      <ImageBackground
        source={require('../../assets/images/productbg.png')}
        style={styles.cardBackground}
        imageStyle={styles.cardBgImage}
      >
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text
          style={styles.label}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
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
    backgroundColor: 'white',
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
    fontWeight: 'bold',
  },
  orange: {
    color: '#f39c12',
  },
  blue: {
    color: '#3498db',
  },
  card: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  
  label: {
    marginTop: 6,
    fontWeight: 'bold',
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
    resizeMode: 'cover',
  },
  image: {
    width: 120,   
    height: 120,  
    zIndex: 1,
  },
  
  
});