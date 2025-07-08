// components/ProductBanner/ProductBanner.js

import React from 'react';
import { Image, Text, StyleSheet, View } from 'react-native';

const ProductBanner = ({ source, style }) => {
  return (
    <View style={[styles.container, style]}>
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

    borderRadius: 12,
    overflow: 'hidden',
    height: 130, 
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default ProductBanner;
