import React, { useEffect, useRef } from 'react';
import { View, Animated, FlatList, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const ITEM_WIDTH = windowWidth / 2.1; 

const shimmerItems = [1, 2, 3]; 

const CategoryProductShimmer = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000, 
        useNativeDriver: true, 
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-ITEM_WIDTH, ITEM_WIDTH], 
  });

  const renderItem = () => (
    <View style={styles.card}>
      <View style={styles.cardBackground}>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            { transform: [{ translateX }] }, 
          ]}
        />
      </View>
      <View style={styles.titlePlaceholder} />
   <View style={styles.buttonPlaceholder} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={shimmerItems} 
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem} 
        showsHorizontalScrollIndicator={false} 
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />} 
        contentContainerStyle={{ paddingHorizontal: 15 }} 
      />
    </View>
  );
};

export default CategoryProductShimmer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FDF4E6',
    height: 220, 
    marginTop: 40,
  },
  card: {
    width: ITEM_WIDTH, 
    alignItems: 'center', 
  },
  cardBackground: {
    width: '100%',
    height: 70, 
    borderRadius: 10,
    backgroundColor: '#e0e0e0', 
    overflow: 'hidden', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, 
  },
  shimmerOverlay: {
    width: '40%', 
    height: '100%', 
    backgroundColor: '#ffffff', 
    opacity: 0.3, 
    position: 'absolute',
    left: 0,
    top: 0, 
  },
  titlePlaceholder: {
    width: '100%', 
    height: 16, 
    borderRadius: 4, 
    backgroundColor: '#e0e0e0', 
    marginBottom: 8, 
  },
 
  buttonPlaceholder: {
    width: '100%', 
    height: 40, 
    borderRadius: 8,
    backgroundColor: '#e0e0e0', 
  },
});
