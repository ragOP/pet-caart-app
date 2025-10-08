import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.96;
const CARD_HEIGHT = 170;

const BannerShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  return (
    <View style={styles.shimmerCard}>
      <Animated.View
        style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#e4e7ec',
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  shimmerOverlay: {
    width: '40%',
    height: '100%',
    backgroundColor: '#ffffff',
    opacity: 0.3,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default BannerShimmer;
