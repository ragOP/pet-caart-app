import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const WhiskasShimmer = () => {
  const pulseOpacity = useRef(new Animated.Value(0.7)).current;
  const waveTranslateX = useRef(new Animated.Value(-120)).current;
  const waveWidth = 120;

  useEffect(() => {
    // Pulse opacity animation between 0.7 and 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Wave moves from left(-waveWidth) to right(screenWidth)
    Animated.loop(
      Animated.timing(waveTranslateX, {
        toValue: screenWidth,
        duration: 1600,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.subTitlePlaceholder} />

        <View style={styles.titlePlaceholder} />
        <View style={styles.deliveryBoxPlaceholder} />
        <View style={styles.offerPlaceholder} />
        <View style={styles.titlePlaceholder} />

        <View style={styles.pricePlaceholder} />

        <View style={styles.addToCartPlaceholder} />

        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(255,255,255,0.85)',
              opacity: pulseOpacity,
              borderRadius: 10,
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wave,
            { width: waveWidth, transform: [{ translateX: waveTranslateX }] },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: '15%',
    paddingHorizontal: 10,
  },
  imagePlaceholder: {
    height: 340,
    backgroundColor: '#929292',
    marginBottom: 18,
    borderRadius: 12,
  },
  titlePlaceholder: {
    height: 30,
    width: '75%',
    backgroundColor: '#929292',
    borderRadius: 6,
    marginBottom: 10,
  },
  subTitlePlaceholder: {
    height: 20,
    width: '45%',
    backgroundColor: '#929292',
    borderRadius: 6,
    marginBottom: 14,
  },
  deliveryBoxPlaceholder: {
    height: 208,
    width: '100%',
    backgroundColor: '#929292',
    borderRadius: 12,
    marginBottom: 20,
  },
  offerPlaceholder: {
    height: 50,
    width: '100%',
    backgroundColor: '#929292',
    borderRadius: 8,
    marginBottom: 10,
  },
  pricePlaceholder: {
    height: 22,
    width: '35%',
    backgroundColor: '#929292',
    borderRadius: 6,
    marginBottom: 20,
  },
  addToCartPlaceholder: {
    height: 44,
    width: '52%',
    backgroundColor: '#929292',
    borderRadius: 9,
  },
  wave: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    opacity: 0.4,
  },
});

export default WhiskasShimmer;
