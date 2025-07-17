import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const ITEM_WIDTH = windowWidth / 3.0; 

const NewlyLaunchedSlider = ({ products, headingIcon, headingTextOrange, headingTextBlue }) => {
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {products.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
            <TouchableOpacity style={styles.card} activeOpacity={1}>
              <Image source={item.image} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:15
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
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginRight: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 15 : 10, 
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    backgroundColor: '#E0E0E033',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#FFB84C',
    padding:10
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    width: ITEM_WIDTH,
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default NewlyLaunchedSlider;
