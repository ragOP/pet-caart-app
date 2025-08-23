import React from 'react';
import { ScrollView, TouchableOpacity, Text, Image, StyleSheet, Platform, View } from 'react-native';

const CustomCategoryTabBar = ({ navigationState, jumpTo }) => (
  <View style={styles.tabBarWrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBar}
      style={styles.scrollBar}
    >
      {navigationState.routes.map((route, i) => {
        const focused = navigationState.index === i;
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, focused && styles.tabItemActive]}
            onPress={() => jumpTo(route.key)}
            activeOpacity={0.8}
          >
            <View style={styles.tabContentRow}>
              {route.icon ? (
                <Image
                  source={{ uri: route.icon }}
                  style={[
                    styles.tabIcon,
                    {
                      opacity: focused ? 1 : 0.7,
                      borderColor: 'transparent',
                    },
                  ]}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.tabIcon, { backgroundColor: '#ccc' }]} />
              )}
              <Text
                style={[
                  styles.tabText,
                  { color: focused ? '#F4A300' : '#222', fontWeight: focused ? 'bold' : '600' },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {route.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: 'transparent',
    // No border, no shadow
  },
  scrollBar: {
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: 'transparent',
    transitionDuration: '150ms',
    // No border, no shadow
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#F4A300',
    // No background, no shadow, no border elsewhere
  },
  tabContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 0,
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 13,
    textAlign: 'left',
    fontFamily:
      Platform.OS === 'ios'
        ? 'Arial'
        : Platform.OS === 'android'
        ? 'sans-serif'
        : 'Arial, Helvetica, sans-serif',
    paddingRight: 0,
    lineHeight: 18,
  },
});

export default CustomCategoryTabBar; 