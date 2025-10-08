import React from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GAP = 12; // image ke beech ka gap
const V_PADDING = 16; // left/right screen padding
const ITEM_W = (SCREEN_WIDTH - V_PADDING * 2 - GAP) / 2; // 2 per screen with gap

const IMAGES = [
  { id: '1', src: require('../../assets/images/petSlider.png') },
  { id: '2', src: require('../../assets/images/petSlider2.png') },
  { id: '3', src: require('../../assets/images/petSlider.png') },
  { id: '4', src: require('../../assets/images/petSlider2.png') },
];

export default function PetPromo() {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, { width: ITEM_W }]}
    >
      <Image source={item.src} style={styles.image} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={IMAGES}
      horizontal
      keyExtractor={it => it.id}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
      contentContainerStyle={{ paddingHorizontal: V_PADDING }}
      decelerationRate="fast"
      snapToInterval={ITEM_W + GAP}
      snapToAlignment="start"
      getItemLayout={(_, index) => ({
        length: ITEM_W + GAP,
        offset: (ITEM_W + GAP) * index + V_PADDING,
        index,
      })}
      ListFooterComponent={<View style={{ width: V_PADDING }} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: { width: '100%', height: '100%' },
});
