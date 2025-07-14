import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions,Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import * as LucideIcons from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen/CategoryScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const BreedShopScreen = () => <View style={styles.screen}><Text>Breed Shop</Text></View>;
const CartScreen = () => <View style={styles.screen}><Text>Cart</Text></View>;

const CustomTabBar = ({ state, navigation }) => {
  const selectedIndex = state.index;
  const tabWidth = width / state.routes.length;
  const curveHeight = 32; 
  const curveSpread = tabWidth * 1.1;

  const startX = tabWidth * selectedIndex;
  const midX = startX + tabWidth / 2;
  const endX = tabWidth * (selectedIndex + 1);

  const curvePath = `
    M0 0 
    H${startX}
    C${startX + curveSpread * 0.25} 0, ${midX - curveSpread * 0.25} ${curveHeight}, ${midX} ${curveHeight}
    C${midX + curveSpread * 0.25} ${curveHeight}, ${endX - curveSpread * 0.25} 0, ${endX} 0
    H${width}
    V80
    H0
    Z
  `;

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

  return (
    <View style={styles.tabBarContainer}>
      <Svg width={width} height={80} style={styles.svg}>
      <Path d={curvePath} fill="#0888B1" />
            </Svg>

      {state.routes.map((route, index) => {
        const isFocused = selectedIndex === index;
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
            activeOpacity={1}
            style={[
              styles.tabButton,
              { width: tabWidth, paddingTop: isFocused ? 12 : 0 }
            ]}
          >
            <View style={[styles.iconWrapper, { paddingTop: isFocused ? 10 : 0 }]}>
              {isFocused && (
               <View style={styles.pawWrapper}>
               <Image
                 source={require('../assets/icons/paw.png')} 
                 style={{ width: 26, height: 26 }}
                 resizeMode="contain"
               />
             </View>
              )}
              {LucideIcon && (
                <LucideIcon
                  size={isFocused ? 25 : 24}
                  color="white"
                  style={{ marginTop: isFocused ? 2 : 4, transform: [{ scale: isFocused ? 1.1 : 1 }] }}
                />
              )}
              {!isFocused && <Text style={styles.label}>{route.name}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function BottomTabNavigation() {
  return (
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
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
  },
  svg: {
    position: 'absolute',
    bottom: 0,
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  iconWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  pawWrapper: {
    position: 'absolute',
    top: -30, 
    padding: 6,
    borderRadius: 50,
    zIndex: 10,
  },
  label: {
    fontSize: 12,
    color: 'white',
    marginTop: 4,
  },
});
