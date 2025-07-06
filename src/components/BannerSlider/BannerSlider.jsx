import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = 140;
const CARD_MARGIN_RIGHT = 16;

const BannerSlider = ({ data }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (data.length === 0) return;
      const nextIndex = (currentIndex + 1) % data.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex, data.length]);

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>
      )}
      snapToInterval={CARD_WIDTH + CARD_MARGIN_RIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => {
        const newIndex = Math.round(
          event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN_RIGHT)
        );
        setCurrentIndex(newIndex);
      }}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 14,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: CARD_MARGIN_RIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default BannerSlider;
