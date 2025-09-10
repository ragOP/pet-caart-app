import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Footer = () => (
  <View style={styles.outerBox}>
    <Image
      source={require('../../assets/images/logo1.png')}
      style={styles.logo}
      resizeMode="contain"
    />

    <Text style={styles.mainText}>
      More Than <Text style={styles.pets}>Pets</Text>
      {'\n'}They’re <Text style={styles.family}>Family.</Text>
    </Text>

    <Text style={styles.subText}>
      Whether it’s food, play, or health{'\n'}
      everything your pet needs, with love{' '}
      <Image
        source={require('../../assets/images/heart.png')}
        style={styles.loveIcon}
        resizeMode="cover"
      />
    </Text>
  </View>
);

const styles = StyleSheet.create({
  outerBox: {
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#0888B166',
    padding: 20,
    margin: 10,
    backgroundColor: '#fff',
    borderStyle: 'dashed',
  },
  logo: {
    width: 140,
    height: 70,
    marginBottom: 12,
  },
  mainText: {
    fontSize: 30,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#000000',
    marginBottom: 10,
    lineHeight: 38,
  },
  pets: {
    color: '#004E6A',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  family: {
    color: '#F59A11',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  subText: {
    fontSize: 16,
    color: '#6A6868',
    marginTop: 8,
    lineHeight: 27,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  loveIcon: {
    height: 18,
    width: 18,
  },
});

export default Footer;
