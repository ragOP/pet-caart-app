import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = 140;
const CARD_MARGIN_RIGHT = 16;

const shimmerItems = [1, 2];

const BannerSliderShimmer = () => {
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

  const renderItem = () => (
    <View style={styles.shimmerCard}>
      <Animated.View
        style={[styles.shimmerOverlay, { transform: [{ translateX }] }]}
      />
    </View>
  );

  return (
    <FlatList
      data={shimmerItems}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  shimmerCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#e4e7ec',
    overflow: 'hidden',
    marginRight: CARD_MARGIN_RIGHT,
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

export default BannerSliderShimmer;
