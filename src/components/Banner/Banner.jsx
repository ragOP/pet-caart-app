// components/Banner/Banner.js

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Banner = ({ source }) => {
  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default Banner;
