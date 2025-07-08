import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Animated, Platform } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const ITEM_WIDTH = windowWidth / 2.4;  

const NewlyLaunchedSlider = ({ products, headingIcon, headingTextOrange, headingTextBlue }) => {
    const [scales, setScales] = useState(products.map(() => new Animated.Value(1)));  
  const handlePressIn = (index) => {
    Animated.spring(scales[index], {
      toValue: 0.95,  
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scales[index], {
      toValue: 1,  
      friction: 4,
      useNativeDriver: true,
    }).start();
  };
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
        showsHorizontalScrollIndicator={false}
        horizontal
        data={products}
        renderItem={({ item ,index}) => (
          <View style={styles.cardContainer}>
          <Animated.View
              style={[styles.card, { transform: [{ scale: scales[index] }] }]}
            >
              <TouchableOpacity
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                style={styles.card}
                activeOpacity={1}
              >
                <Image source={item.image} style={styles.image} />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.label}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: '#FDF4E6',
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
  listContainer: {
    paddingHorizontal: 5,
    
    width: '100%', 
  },
  cardContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 15 : 10, 
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH, 
    backgroundColor: '#E0E0E033',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#FFB84C', 
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,  
    padding: 10, 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
    borderRadius: 8, 
  },
  title: {
    width: ITEM_WIDTH,
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
    marginTop: 5,
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default NewlyLaunchedSlider;
