import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { getAdBanner } from '../../apis/getAdBanner';
import BannerShimmer from '../../ui/Shimmer/BannerShimmer';
import BannerSliderShimmer from '../../ui/Shimmer/BannerSliderShimmer';

const Banner = () => {
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanner = async () => {
    try {
      const response = await getAdBanner();
      const url = response?.data?.data?.[0]?.image;
      if (url) {
        setBannerImageUrl(url);
      } else {
        console.warn('No image URL found');
        setError('No image URL found');
      }
    } catch (error) {
      console.error('Error fetching banner image:', error);
      setError('Failed to load banner');
    } finally {
      setLoadingBanner(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  if (loadingBanner) {
    return (
      <View style={styles.container}>
        <BannerSliderShimmer />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!bannerImageUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No banner image available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: bannerImageUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 180,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Banner;
