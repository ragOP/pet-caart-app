import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const gridItemWidth = (width - 48) / 3;

const CustomGridLayoutShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });
  const renderGrid = count => (
    <View style={styles.gridRow}>
      {[...Array(count)].map((_, i) => (
        <View key={i} style={styles.gridBox} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Animated.View
          style={[
            styles.shimmerWave,
            { transform: [{ translateX: shimmerTranslate }] },
          ]}
        />
      </View>

      <View style={styles.titleBar} />
      <View style={[styles.sectionTitle, { width: 150 }]} />
      {renderGrid(3)}
      {renderGrid(3)}

      <View style={styles.sectionSpacer} />
      <View style={[styles.sectionTitle, { width: 180 }]} />
      <View style={styles.bestsellerRow}>
        <View style={styles.bestsellerBox} />

        <View style={styles.bestsellerBox} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  banner: {
    width: '100%',
    height: 150,
    backgroundColor: '#e4e7ec',
    marginBottom: 16,
    overflow: 'hidden',
  },
  shimmerWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '60%',
    backgroundColor: '#f6f7f9',
    opacity: 0.6,
    borderRadius: 12,
  },
  titleBar: {
    width: 180,
    height: 24,
    backgroundColor: '#ececec',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 6,
  },
  sectionTitle: {
    height: 18,
    backgroundColor: '#ececec',
    borderRadius: 7,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 15,
  },
  gridBox: {
    width: gridItemWidth,
    height: 110,
    backgroundColor: '#e9eaea',
    borderRadius: 10,
  },
  sectionSpacer: {
    height: 24,
  },
  bestsellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  bestsellerBox: {
    width: (width - 48) / 2,
    height: 90,
    backgroundColor: '#ececec',
    borderRadius: 10,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fafafb',
    borderTopWidth: 1,
    borderColor: '#e4e4e4',
  },
  navIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e9eaea',
  },
  centerNavIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    marginBottom: 9,
  },
});

export default CustomGridLayoutShimmer;
