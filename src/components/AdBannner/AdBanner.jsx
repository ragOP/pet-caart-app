import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Dimensions } from 'react-native';

const slides = [
  require('../../assets/images/main.png'),
  require('../../assets/images/main2.png'),
  require('../../assets/images/main.png'),
];

const INTERVAL_MS = 4000;
const FADE_MS = 1000;

export default function AdBannner() {
  const [index, setIndex] = useState(0);
  const opA = useRef(new Animated.Value(1)).current;
  const opB = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const runFade = () => {
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
      setIndex(i => (i + 1) % slides.length);
      opA.setValue(1);
      opB.setValue(0);
    });
  };

  useEffect(() => {
    timerRef.current = setInterval(runFade, INTERVAL_MS);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  const { width } = Dimensions.get('window');
  const height = Math.round(width * 0.35);

  const current = slides[index];
  const next = slides[(index + 1) % slides.length];

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
});
