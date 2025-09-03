// EssentialSlider.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const data = [
  [
    {
      id: '1',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
    {
      id: '2',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
    {
      id: '3',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
    {
      id: '4',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
  ],
  [
    {
      id: '5',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
    {
      id: '6',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
    {
      id: '7',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
    {
      id: '8',
      name: 'Chicken Gravy',
      image: require('../../assets/images/dog.png'),
    },
  ],
];

const EssentialSlider = ({
  headingIcon,
  headingTextOrange = '',
  headingTextBlue = '',
}) => {
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

      {data.map((row, index) => (
        <FlatList
          key={index}
          horizontal
          data={row}
          style={styles.sliderRow}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.text}>{item.name}</Text>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: { width: 35, height: 35, marginRight: 8 },
  headingText: { fontSize: 20, fontFamily: 'Gotham-Rounded-Bold' },
  orange: { color: '#f39c12', fontFamily: 'Gotham-Rounded-Bold' },
  blue: { color: '#3498db', fontFamily: 'Gotham-Rounded-Bold' },
  sliderRow: {
    marginVertical: 10,
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  image: {
    width: 120,
    height: 130,
    resizeMode: 'contain',
  },
  text: {
    marginTop: 8,
    fontSize: 15,
    fontFamily: 'Gotham-Rounded-Bold',
  },
});

export default EssentialSlider;
