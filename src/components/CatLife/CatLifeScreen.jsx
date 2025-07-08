import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { getCatLifeBanners } from '../../apis/getCatLifeBanners';

const { width } = Dimensions.get('window');

export default function CatLifeScreen({ headingIcon, headingTextOrange, headingTextBlue }) {
  const [catLifeData, setCatLifeData] = useState([]);
  const [scales, setScales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatLifeBanners = async () => {
      try {
        const response = await getCatLifeBanners();    
        const banners = response?.data?.data;
    
        if (Array.isArray(banners)) {
          setCatLifeData(banners);
          setScales(banners.map(() => new Animated.Value(1)));
        } else {
          console.warn('No Cat Life banners found');
        }
      } catch (error) {
        console.error('Error fetching Cat Life banners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatLifeBanners();
  }, []);

  const handlePressIn = (index) => {
    Animated.spring(scales[index], {
      toValue: 0.96,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scales[index], {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#f39c12" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {headingIcon && (
        <View style={styles.headingContainer}>
          <Image source={headingIcon} style={styles.iconImage} resizeMode="contain" />
          <Text style={styles.headingText}>
            <Text style={styles.orange}>{headingTextOrange} </Text>
            <Text style={styles.blue}>{headingTextBlue}</Text>
          </Text>
        </View>
      )}

      <View style={styles.grid}>
        {catLifeData.map((item, index) => (
          <View key={item._id} style={styles.card}>
            <Animated.View
              style={[styles.imageWrapper, { transform: [{ scale: scales[index] }] }]}
            >
              <TouchableOpacity
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                activeOpacity={1}
                style={styles.imageWrapper}
              >
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.label}>{item.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF4E6',
    padding: 16,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconImage: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  headingText: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  orange: {
    color: '#f39c12',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  blue: {
    color: '#3498db',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 48) / 2,
    marginBottom: 24,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
  },
});
