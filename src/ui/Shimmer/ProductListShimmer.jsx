import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const ShimmerPlaceholder = ({ style }) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [shimmerAnim, pulseAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: '#eee',
          overflow: 'hidden',
          borderRadius: style.borderRadius || 8,
          opacity: pulseAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(255,255,255,0.25)',
            width: 120,
            transform: [{ translateX }],
          },
        ]}
      />
    </Animated.View>
  );
};

const CircleRow = () => (
  <View style={styles.circleRow}>
    {[...Array(4)].map((_, i) => (
      <ShimmerPlaceholder key={i} style={styles.circlePlaceholder} />
    ))}
  </View>
);

const CardShimmer = () => (
  <View style={styles.card}>
    <ShimmerPlaceholder style={styles.imagePlaceholder} />
    <View style={styles.textLines}>
      <ShimmerPlaceholder style={styles.line} />
      <ShimmerPlaceholder style={styles.lineShort} />
    </View>
    <ShimmerPlaceholder style={styles.buttonPlaceholder} />
  </View>
);

const TwoRowsOfCircles = () => <View></View>;

const TwoRowsOfCards = () => (
  <View style={styles.cardRows}>
    {[...Array(6)].map((_, i) => (
      <CardShimmer key={i} />
    ))}
  </View>
);

const ProductListShimmer = () => (
  <ScrollView style={styles.container}>
    <TwoRowsOfCircles />
    <TwoRowsOfCards />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: isTablet ? 12 : 8,
  },
  circlePlaceholder: {
    width: isTablet ? 110 : 80,
    height: isTablet ? 110 : 80,
    borderRadius: 50,
  },
  cardRows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    width: isTablet ? '48%' : '45%',
    height: isTablet ? 350 : 280,
    backgroundColor: '#fff',
    borderRadius: isTablet ? 16 : 12,
    marginVertical: isTablet ? 14 : 12,
    padding: isTablet ? 16 : 12,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: isTablet ? 180 : 150,
    height: isTablet ? 180 : 150,
    borderRadius: 12,
    marginBottom: isTablet ? 14 : 10,
  },
  textLines: { width: '100%' },
  line: {
    height: isTablet ? 18 : 16,
    marginBottom: isTablet ? 12 : 10,
    borderRadius: 10,
  },
  lineShort: {
    width: '60%',
    height: isTablet ? 16 : 14,
    borderRadius: 10,
  },
  buttonPlaceholder: {
    width: '100%',
    height: isTablet ? 48 : 42,
    borderRadius: 10,
    marginTop: isTablet ? 12 : 10,
  },
});

export default ProductListShimmer;
