import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AddressShimmer = () => {
  const shimmerWidth = new Animated.Value(0);

  // Animation for shimmer effect
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerWidth, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerWidth, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerWidth]);

  return (
    <View style={styles.shimmerWrapper}>
      <View style={styles.addressCard}>
        <View style={styles.shimmerItem}></View>
        <View style={styles.shimmerItem}></View>
        <View style={styles.shimmerItem}></View>
      </View>
      <View style={styles.addressCard}>
        <View style={styles.shimmerItem}></View>
        <View style={styles.shimmerItem}></View>
        <View style={styles.shimmerItem}></View>
      </View>
      <View style={styles.addressCard}>
        <View style={styles.shimmerItem}></View>
        <View style={styles.shimmerItem}></View>
        <View style={styles.shimmerItem}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerWrapper: {
    flex: 1,
    padding: 15,
  },
  addressCard: {
    backgroundColor: '#F59A110D',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    opacity: 0.7,
  },
  shimmerItem: {
    backgroundColor: '#C4C4C4',
    height: 15,
    marginBottom: 8,
    borderRadius: 5,
    width: '99%',
  },
});

export default AddressShimmer;
