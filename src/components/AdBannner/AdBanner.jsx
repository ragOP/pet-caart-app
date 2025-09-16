import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import { getSliders } from '../../apis/getSliders';

const INTERVAL_MS = 4000;
const FADE_MS = 1000;

export default function AdBanner() {
  const [sliderData, setSliderData] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const opA = useRef(new Animated.Value(1)).current;
  const opB = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const fetchSliders = async () => {
    try {
      const response = await getSliders();
      const sliders = response?.data?.data;
      if (sliders && sliders.length > 0) {
        const sliderImages = sliders.map(slider => ({
          image: { uri: slider.image },
          link: slider.link,
          id: slider.id,
          isActive: slider.isActive,
          type: slider.type,
        }));
        setSliderData(sliderImages);
      } else {
        setError('No sliders found');
      }
    } catch (error) {
      setError('Failed to load sliders');
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const runFade = () => {
    if (!sliderData) return;
    Animated.parallel([
      Animated.timing(opA, {
        toValue: 0,
        duration: FADE_MS,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opB, {
        toValue: 1,
        duration: FADE_MS,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(i => (i + 1) % sliderData.length);
      opA.setValue(1);
      opB.setValue(0);
    });
  };
  useEffect(() => {
    if (sliderData && sliderData.length > 0 && !timerRef.current) {
      timerRef.current = setInterval(runFade, INTERVAL_MS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [sliderData]);
  useEffect(() => {
    fetchSliders();
  }, []);

  const { width } = Dimensions.get('window');
  const height = Math.round(width * 0.55);

  if (error || !sliderData || sliderData.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.error}>{error || 'No sliders available'}</Text>
      </View>
    );
  }

  const current = sliderData[index].image;
  const next = sliderData[(index + 1) % sliderData.length].image;

  return (
    <View style={[styles.container, { height }]}>
      <Animated.Image
        source={current}
        style={[styles.image, { opacity: opA }]}
        resizeMode="cover"
        accessibilityLabel="Ad banner"
      />
      <Animated.Image
        source={next}
        style={[styles.image, { opacity: opB }]}
        resizeMode="cover"
        accessibilityLabel="Ad banner"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
