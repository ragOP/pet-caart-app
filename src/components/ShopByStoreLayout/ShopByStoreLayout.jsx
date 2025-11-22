import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getHomeGridConfig } from '../../apis/getHomeGridConfig';

const splitTitle = title => {
  if (!title || typeof title !== 'string') return { first: '', second: '' };
  const index = title.indexOf(' ');
  if (index === -1) return { first: title, second: '' };
  return {
    first: title.substring(0, index),
    second: title.substring(index + 1),
  };
};

const CustomGridLayout = ({ gridData, onItemPress }) => {
  const navigation = useNavigation();

  if (!gridData) return null;

  const {
    grid,
    title,
    contentItems,
    backgroundImage,
    bannerImage,
    isTitleShow,
  } = gridData;
  const { mobileColumns } = grid || {};
  const GAP = 8;
  const screenWidth = Dimensions.get('window').width;
  const totalGapsWidth = GAP * ((mobileColumns || 1) + 1);
  const itemWidth = (screenWidth - totalGapsWidth) / (mobileColumns || 1);
  const itemHeight = itemWidth * 1.15;

  const handleItemClick = item => {
    console.log('Clicked item:', item);

    // Single product: check itemId._id
    if (item.itemId?._id) {
      console.log('This is a product with itemId._id:', item.itemId._id);
      return navigation.navigate('SingleProductScreen', {
        productId: item.itemId._id,
      });
    }
    // API se link mila /product/{id} toh sirf id extract kro
    if (item.link && item.link.startsWith('/product/')) {
      const productId = item.link.replace('/product/', '');
      console.log('This is a product with link:', productId);
      return navigation.navigate('SingleProductScreen', { productId });
    }
    // External link (http)
    if (item.link && item.link.startsWith('http')) {
      return Linking.openURL(item.link);
    }
    // Category
    if (item.categoryId?.slug) {
      return navigation.navigate('ProductListScreen', {
        categorySlug: item.categoryId.slug,
      });
    }
    // Subcategory
    if (item.subCategoryId?.slug) {
      return navigation.navigate('ProductListScreen', {
        subCategorySlug: item.subCategoryId.slug,
      });
    }
    // Brand
    if (item.brandId?.slug) {
      return navigation.navigate('ProductListScreen', {
        brandSlug: item.brandId.slug,
      });
    }
    // Collection
    if (item.slug) {
      return navigation.navigate('ProductListScreen', {
        collectionSlug: item.slug,
      });
    }
  };

  const [firstPart, secondPart] = useMemo(() => {
    const { first, second } = splitTitle(title || '');
    return [first, second];
  }, [title]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        {bannerImage && (
          <Image
            source={{ uri: bannerImage }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        )}
        {title && isTitleShow === true && (
          <View style={styles.titleContainer}>
            <View style={styles.titleWithImage}>
              <Image
                source={require('../../assets/icons/paw2.png')}
                style={styles.titleImage}
                resizeMode="contain"
              />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={[styles.titleText, { color: '#f39c12' }]}>
                  {firstPart}
                </Text>
                <Text style={[styles.titleText, { color: '#3498db' }]}>
                  {secondPart ? ' ' + secondPart : ''}
                </Text>
              </View>
            </View>
          </View>
        )}
        <ScrollView style={styles.scrollView} horizontal={false}>
          <ImageBackground
            source={backgroundImage ? { uri: backgroundImage } : null}
            style={[
              styles.gridContainer,
              { backgroundColor: backgroundImage ? 'transparent' : 'white' },
            ]}
            resizeMode="cover"
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              {contentItems?.map((item, index) => (
                <TouchableOpacity
                  key={item._id || index}
                  style={{
                    width: itemWidth,
                    height: itemHeight,
                    marginLeft: GAP,
                    marginTop: 8,
                    overflow: 'hidden',
                  }}
                  onPress={() => handleItemClick(item)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
    </View>
  );
};

const ShopByStoreLayout = ({ params = {} }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['homeGridConfig', params],
    queryFn: () => getHomeGridConfig({ params }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f39c12" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Error: {error?.message || 'Something went wrong'}
        </Text>
      </View>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.mainContainer}>
      {data.data.map((gridItem, index) => (
        <CustomGridLayout key={gridItem._id || index} gridData={gridItem} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Gotham-Rounded-Bold',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 15,
  },
  scrollView: {
    width: '100%',
  },
  bannerImage: {
    width: '100%',
    height: 120,
    marginTop: 12,
  },
  titleContainer: {
    marginHorizontal: 8,
  },
  titleWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    width: 40,
    height: 40,
    marginRight: 4,
  },
  titleText: {
    fontSize: 20,
    fontFamily: 'Gotham-Rounded-Bold',
    color: '#222',
  },
  gridContainer: {
    overflow: 'hidden',
    width: '100%',
  },
});

export default ShopByStoreLayout;
