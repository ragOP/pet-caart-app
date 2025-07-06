// components/Banner/BannerShimmer.js

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BannerShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.container}>
      <View style={styles.shimmerContainer}>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
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
    backgroundColor: '#e0e0e0',
  },
  shimmerContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
});

export default BannerShimmer;
