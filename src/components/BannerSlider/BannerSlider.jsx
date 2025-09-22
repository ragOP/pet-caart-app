import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import { getSliders } from '../../apis/getSliders';
import BannerSliderShimmer from '../../ui/Shimmer/BannerSliderShimmer';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const CARD_HEIGHT = 140;
const CARD_MARGIN_RIGHT = 10;

const BannerSlider = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSliders = async () => {
    try {
      const response = await getSliders();
      const sliders = response?.data?.data;
      if (sliders && sliders.length > 0) {
        const sliderImages = sliders.map((slider, index) => ({
          image: { uri: slider.image },
          link: slider.link,
          id: slider.id || `slider-${index}`,
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

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderData.length === 0) return;
      const nextIndex = (currentIndex + 1) % sliderData.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex, sliderData.length]);

  if (loading) {
    return (
      <View style={[styles.content, { height: CARD_HEIGHT }]}>
        <BannerSliderShimmer />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.content, { height: CARD_HEIGHT }]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={sliderData}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      snapToInterval={CARD_WIDTH + CARD_MARGIN_RIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={event => {
        const newIndex = Math.round(
          event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN_RIGHT),
        );
        setCurrentIndex(newIndex);
      }}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BannerSlider;
