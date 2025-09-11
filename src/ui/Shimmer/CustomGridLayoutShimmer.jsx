// CustomGridLayoutShimmer.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const CustomGridLayoutShimmer = () => {
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const shimmerEffect = () => {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    };

    shimmerEffect();
  }, [shimmerAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.shimmerPlaceholder} />
      <View style={styles.shimmerTitle}>
        <Animated.View
          style={[
            styles.shimmerAnimated,
            {
              transform: [
                {
                  translateX: shimmerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 200],
                  }),
                },
              ],
            },
          ]}
        />
        <View style={styles.shimmerItemContainer}>
          {Array(6)
            .fill()
            .map((_, index) => (
              <View key={index} style={styles.shimmerItem} />
            ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 0,
  },
  //   shimmerPlaceholder: {
  //     width: '100%',
  //     height: 120,
  //     backgroundColor: '#e0e0e0',
  //   },
  shimmerTitle: {
    marginBottom: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shimmerAnimated: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 12,
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  shimmerItemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shimmerItem: {
    width: '30%',
    height: 120,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
});

export default CustomGridLayoutShimmer;
