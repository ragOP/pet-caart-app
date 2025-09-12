import React from 'react';
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

const CustomGridLayout = ({ gridData, onItemPress }) => {
  const navigation = useNavigation();

  if (!gridData) return null;

  const { grid, title, contentItems, backgroundImage, bannerImage } = gridData;
  const { mobileColumns, mobileRows } = grid || {};
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / mobileColumns;
  const itemHeight =
    (screenWidth / mobileColumns) * (mobileRows / mobileColumns);

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
              <Text style={styles.titleText}>{title}</Text>
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
                justifyContent: 'space-between',
              }}
            >
              {contentItems?.map((item, index) => (
                <TouchableOpacity
                  key={item._id || index}
                  style={[
                    styles.gridItem,
                    {
                      width: itemWidth - 16,
                    },
                  ]}
                  onPress={() => handleItemClick(item)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemImage}
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
    marginBottom: 16,
    width: '100%',
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
    marginBottom: 12,
    marginHorizontal: 16,
  },
  titleWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleImage: {
    width: 40,
    height: 40,
    marginRight: 12,
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
  gridItem: {
    margin: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    aspectRatio: 0.96,
    // borderRadius: 6,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
});

export default CustomGridLayout;
