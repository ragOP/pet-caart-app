import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

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
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
      <View style={styles.card}>
        <Shimmer style={styles.imageShimmer}>
          <View style={styles.imagePlaceholder} />
        </Shimmer>
        <View style={styles.content}>
          <Shimmer style={styles.textShimmer}>
            <View style={styles.titlePlaceholder} />
          </Shimmer>
          <Shimmer style={styles.textShimmer}>
            <View style={styles.pricePlaceholder} />
          </Shimmer>
        </View>
      </View>
      <View style={styles.card}>
        <Shimmer style={styles.imageShimmer}>
          <View style={styles.imagePlaceholder} />
        </Shimmer>
        <View style={styles.content}>
          <Shimmer style={styles.textShimmer}>
            <View style={styles.titlePlaceholder} />
          </Shimmer>
          <Shimmer style={styles.textShimmer}>
            <View style={styles.pricePlaceholder} />
          </Shimmer>
        </View>
      </View>
      <View style={styles.card}>
        <Shimmer style={styles.imageShimmer}>
          <View style={styles.imagePlaceholder} />
        </Shimmer>
        <View style={styles.content}>
          <Shimmer style={styles.textShimmer}>
            <View style={styles.titlePlaceholder} />
          </Shimmer>
          <Shimmer style={styles.textShimmer}>
            <View style={styles.pricePlaceholder} />
          </Shimmer>
        </View>
      </View>
      <View style={{ marginTop: 30, marginBottom: 10 }}>
        <Shimmer style={{ height: 25, borderRadius: 4 }}>
          <View
            style={{ flex: 1, backgroundColor: '#d0d0d0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Shimmer style={{ height: 15, width: '70%', borderRadius: 4 }}>
          <View
            style={{ flex: 1, backgroundColor: '#c0c0c0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
      <View style={[styles.card, { marginTop: 10 }]}>
        <Shimmer style={styles.imageShimmerSmall}>
          <View style={styles.imagePlaceholderSmall} />
        </Shimmer>
        <View style={styles.content}>
          <Shimmer style={styles.textShimmerSmall}>
            <View style={styles.titlePlaceholderSmall} />
          </Shimmer>
          <Shimmer style={styles.textShimmerSmall}>
            <View style={styles.pricePlaceholderSmall} />
          </Shimmer>
        </View>
      </View>
      <View style={[styles.card, { marginTop: 10 }]}>
        <Shimmer style={styles.imageShimmerSmall}>
          <View style={styles.imagePlaceholderSmall} />
        </Shimmer>
        <View style={styles.content}>
          <Shimmer style={styles.textShimmerSmall}>
            <View style={styles.titlePlaceholderSmall} />
          </Shimmer>
          <Shimmer style={styles.textShimmerSmall}>
            <View style={styles.pricePlaceholderSmall} />
          </Shimmer>
        </View>
      </View>
      <View style={{ marginTop: 30, marginBottom: 10 }}>
        <Shimmer style={{ height: 25, borderRadius: 4 }}>
          <View
            style={{ flex: 1, backgroundColor: '#d0d0d0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Shimmer style={{ height: 15, width: '70%', borderRadius: 4 }}>
          <View
            style={{ flex: 1, backgroundColor: '#c0c0c0', borderRadius: 4 }}
          />
        </Shimmer>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  imageShimmer: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#d0d0d0',
    borderRadius: 6,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  textShimmer: {
    height: 20,
    borderRadius: 4,
    marginBottom: 10,
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
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  imagePlaceholderSmall: {
    flex: 1,
    backgroundColor: '#c0c0c0',
    borderRadius: 6,
  },
  textShimmerSmall: {
    height: 15,
    borderRadius: 2,
    marginBottom: 6,
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
