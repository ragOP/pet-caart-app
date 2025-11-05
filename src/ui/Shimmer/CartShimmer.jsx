import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const Shimmer = ({ children, style }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerValue]);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, style]}>
      {children}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const CartShimmer = () => {
  const IMAGE_SIZE = isTablet ? 120 : 80;
  const IMAGE_SIZE_SMALL = isTablet ? 90 : 60;
  const PADDING = isTablet ? 20 : 15;
  const MARGIN_LEFT = isTablet ? 20 : 15;

  return (
    <ScrollView style={[styles.scrollView, { padding: PADDING }]}>
      {/* Large Cards - Main Products */}
      {[1, 2, 3].map(i => (
        <View key={`main-${i}`} style={styles.card}>
          <Shimmer
            style={[
              styles.imageShimmer,
              { width: IMAGE_SIZE, height: IMAGE_SIZE },
            ]}
          >
            <View style={[styles.imagePlaceholder, { borderRadius: 6 }]} />
          </Shimmer>
          <View style={[styles.content, { marginLeft: MARGIN_LEFT }]}>
            <Shimmer style={styles.textShimmer}>
              <View style={styles.titlePlaceholder} />
            </Shimmer>
            <Shimmer style={styles.textShimmer}>
              <View style={styles.pricePlaceholder} />
            </Shimmer>
          </View>
        </View>
      ))}

      {/* Summary Section */}
      <View style={{ marginTop: isTablet ? 40 : 30, marginBottom: 10 }}>
        <Shimmer style={{ height: isTablet ? 30 : 25, borderRadius: 4 }}>
          <View
            style={{ flex: 1, backgroundColor: '#d0d0d0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Shimmer
          style={{ height: isTablet ? 18 : 15, width: '70%', borderRadius: 4 }}
        >
          <View
            style={{ flex: 1, backgroundColor: '#c0c0c0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>

      {/* Small Cards - Recommendations */}
      {[1, 2].map(i => (
        <View key={`small-${i}`} style={[styles.card, { marginTop: 10 }]}>
          <Shimmer
            style={[
              styles.imageShimmerSmall,
              { width: IMAGE_SIZE_SMALL, height: IMAGE_SIZE_SMALL },
            ]}
          >
            <View style={[styles.imagePlaceholderSmall, { borderRadius: 6 }]} />
          </Shimmer>
          <View style={[styles.content, { marginLeft: MARGIN_LEFT }]}>
            <Shimmer
              style={[styles.textShimmerSmall, { height: isTablet ? 18 : 15 }]}
            >
              <View style={styles.titlePlaceholderSmall} />
            </Shimmer>
            <Shimmer
              style={[
                styles.textShimmerSmall,
                { height: isTablet ? 16 : 15, marginBottom: isTablet ? 8 : 6 },
              ]}
            >
              <View style={styles.pricePlaceholderSmall} />
            </Shimmer>
          </View>
        </View>
      ))}

      {/* Final Summary */}
      <View style={{ marginTop: isTablet ? 40 : 30, marginBottom: 10 }}>
        <Shimmer style={{ height: isTablet ? 30 : 25, borderRadius: 4 }}>
          <View
            style={{ flex: 1, backgroundColor: '#d0d0d0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
      <View style={{ marginBottom: isTablet ? 30 : 20 }}>
        <Shimmer
          style={{ height: isTablet ? 18 : 15, width: '70%', borderRadius: 4 }}
        >
          <View
            style={{ flex: 1, backgroundColor: '#c0c0c0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    opacity: 0.6,
  },
  card: {
    flexDirection: 'row',
    padding: isTablet ? 20 : 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  imageShimmer: {
    borderRadius: 6,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#d0d0d0',
  },
  content: {
    flex: 1,
  },
  textShimmer: {
    height: isTablet ? 22 : 20,
    borderRadius: 4,
    marginBottom: isTablet ? 12 : 10,
  },
  titlePlaceholder: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
  },
  pricePlaceholder: {
    flex: 0.3,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
  },
  imageShimmerSmall: {
    borderRadius: 6,
  },
  imagePlaceholderSmall: {
    flex: 1,
    backgroundColor: '#c0c0c0',
  },
  textShimmerSmall: {
    borderRadius: 2,
    marginBottom: isTablet ? 8 : 6,
  },
  titlePlaceholderSmall: {
    flex: 1,
    backgroundColor: '#c0c0c0',
    borderRadius: 2,
  },
  pricePlaceholderSmall: {
    flex: 0.4,
    backgroundColor: '#c0c0c0',
    borderRadius: 2,
  },
});

export default CartShimmer;
