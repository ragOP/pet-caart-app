import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CollectionShimmer() {
  const shimmerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current; // Pulse animation value

  useEffect(() => {
    // Shimmer wave (चमक की लहर)
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: SCREEN_WIDTH,
        duration: 1300,
        useNativeDriver: true,
      }),
    ).start();

    // Pulse effect (चमक-गुम, हल्का-गहरा)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.listContainer}>
      {[...Array(6)].map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.card,
            { opacity: pulseAnim }, // पूरी कार्ड पर पल्स
          ]}
        >
          <View style={styles.textContainer}>
            <Animated.View
              style={[styles.titlePlaceholder, { opacity: pulseAnim }]}
            />
            <Animated.View
              style={[styles.subtitlePlaceholder, { opacity: pulseAnim }]}
            />
          </View>
          <Animated.View
            style={[styles.imagePlaceholderContainer, { opacity: pulseAnim }]}
          >
            <View style={styles.imagePlaceholder} />
            <Animated.View
              style={[
                styles.shimmerWave,
                { transform: [{ translateX: shimmerAnim }] },
              ]}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.shimmerWave,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                transform: [{ translateX: shimmerAnim }],
              },
            ]}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    margin: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  titlePlaceholder: {
    height: 24,
    width: '30%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  subtitlePlaceholder: {
    height: 16,
    width: '40%',
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  imagePlaceholderContainer: {
    width: 100,
    height: 80,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    backgroundColor: '#cccccc',
    borderRadius: 32,
  },
  shimmerWave: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '25deg' }],
  },
});
