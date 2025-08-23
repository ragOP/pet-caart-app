import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as LucideIcons from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen/CategoryScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import CartScreen from '../screens/CartScreen/CartScreen';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const BreedShopScreen = () => <View style={styles.screen}><Text>Breed Shop</Text></View>;

const TestCustomTabBar = ({ state, navigation }) => {
  const selectedIndex = state.index;

  const getIconName = (routeName) => {
    switch (routeName) {
      case 'Home': return 'Home';
      case 'Categories': return 'Logs';
      case 'BreedShop': return 'Cat';
      case 'Cart': return 'ShoppingCart';
      case 'Profile': return 'User';
      default: return 'Circle';
    }
  };

  const getTabLabel = (routeName) => {
    switch (routeName) {
      case 'Home': return 'Home';
      case 'Categories': return 'Categories';
      case 'BreedShop': return 'Breed Shop';
      case 'Cart': return 'Cart';
      case 'Profile': return 'Profile';
      default: return routeName;
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* Background with shadow */}
      <View style={styles.tabBarBackground} />
      
      {state.routes.map((route, index) => {
        const isFocused = selectedIndex === index;
        const isCenterTab = route.name === 'BreedShop'; // Center tab
        
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = getIconName(route.name);
        const LucideIcon = LucideIcons[iconName];

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={[
              styles.tabButton,
              isCenterTab && styles.centerTabButton
            ]}
          >
            <View style={[
              styles.iconWrapper,
              isCenterTab && styles.centerIconWrapper,
              isFocused && styles.focusedIconWrapper
            ]}>
              {isCenterTab && (
                <View style={styles.centerTabBackground}>
                  <View style={styles.centerTabInner}>
                    {LucideIcon && (
                      <LucideIcon
                        size={28}
                        color={isFocused ? "#0888B1" : "#666"}
                      />
                    )}
                  </View>
                </View>
              )}
              
              {!isCenterTab && LucideIcon && (
                <LucideIcon
                  size={24}
                  color={isFocused ? "#0888B1" : "#666"}
                />
              )}
              
              <Text style={[
                styles.label,
                isFocused && styles.focusedLabel,
                isCenterTab && styles.centerLabel
              ]}>
                {getTabLabel(route.name)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TestBottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TestCustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoryScreen} />
      <Tab.Screen name="BreedShop" component={BreedShopScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  centerTabButton: {
    marginTop: -20, // Move center tab up
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedIconWrapper: {
    // Additional styles for focused state
  },
  centerTabBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  centerTabInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Gotham-Rounded-Medium',
  },
  focusedLabel: {
    color: '#0888B1',
    fontFamily: 'Gotham-Rounded-Bold',
  },
  centerLabel: {
    marginTop: 8,
  },
}); 