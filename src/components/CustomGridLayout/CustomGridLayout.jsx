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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

  const { grid, title, contentItems, backgroundImage, bannerImage } = gridData;
  const { mobileColumns } = grid || {};
  const GAP = 12;
  const screenWidth = Dimensions.get('window').width;
  const totalGapsWidth = GAP * ((mobileColumns || 1) + 1);
  const itemWidth = (screenWidth - totalGapsWidth) / (mobileColumns || 1);
  const itemHeight = itemWidth * 1.15;

  const handleItemClick = item => {
    if (onItemPress) {
      onItemPress(item);
      return;
    }
    if (item.link) {
      if (item.link.startsWith('http')) {
        Linking.openURL(item.link);
      } else {
        navigation.navigate(item.link);
      }
    } else if (item.itemId?._id) {
      navigation.navigate('Product', { id: item.itemId._id });
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
        {title && (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  sectionContainer: {
    // marginBottom: 100,
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

export default CustomGridLayout;
