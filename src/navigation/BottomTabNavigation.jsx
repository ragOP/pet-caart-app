import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  ShoppingBasket,
  UserRound,
  LayoutDashboard,
  Logs,
  Dog,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen/CategoryScreen';
import CartScreen from '../screens/CartScreen/CartScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import CollectionScreen from '../screens/CollectionScreen/CollectionScreen';
import BreedScreen from '../screens/BreedScreen/BreedScreen';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const Tab = createBottomTabNavigator();

const TABS = [
  { label: 'Home', icon: Home, route: 'Home' },
  { label: 'Breed Shop', icon: Dog, route: 'Breed' },
  { label: '', icon: LayoutDashboard, route: 'CollectionScreen' },
  { label: 'Cart', icon: ShoppingBasket, route: 'Cart' },
  { label: 'Profile', icon: UserRound, route: 'Profile' },
];

const CustomTabBar = ({ state, navigation }) => {
  const selectedIndex = state.index;
  const tabWidth = isTablet ? (width - 160) / 4 : (width - 120) / 4;
  const centerButtonSize = isTablet ? 65 : 55;
  const tabBarHeight = isTablet ? 90 : 80;
  const centerButtonBottom = isTablet ? 35 : 30;

  return (
    <View
      style={[
        styles.wrapper,
        { height: tabBarHeight + (Platform.OS === 'ios' ? 20 : 0) },
      ]}
    >
      <ImageBackground
        source={require('../assets/images/baar.png')}
        style={[styles.backgroundImage, { height: tabBarHeight }]}
      >
        <View style={[styles.tabBar, { height: tabBarHeight }]}>
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isSelected = selectedIndex === index;

            if (index === 2) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate(tab.route)}
                  style={[
                    styles.centerButton,
                    {
                      bottom: centerButtonBottom,
                      left: width / 2 - centerButtonSize / 2,
                    },
                  ]}
                  activeOpacity={1}
                >
                  <View
                    style={[
                      styles.centerCircle,
                      {
                        width: centerButtonSize,
                        height: centerButtonSize,
                        borderRadius: centerButtonSize / 2,
                      },
                      isSelected && { backgroundColor: '#F59A11' },
                    ]}
                  >
                    <Icon
                      size={isTablet ? 32 : 26}
                      color={isSelected ? '#fff' : '#fff'}
                    />
                  </View>
                </TouchableOpacity>
              );
            }

            const tabStyle = [
              styles.tab,
              { width: tabWidth },
              index === 1 && { marginRight: isTablet ? 50 : 40 },
              index === 3 && { marginLeft: isTablet ? 50 : 40 },
            ];

            return (
              <TouchableOpacity
                key={index}
                style={tabStyle}
                onPress={() => navigation.navigate(tab.route)}
                activeOpacity={1}
              >
                <Icon
                  size={isTablet ? 32 : 28}
                  color={isSelected ? '#0888B1' : '#4B4B4B'}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ImageBackground>
    </View>
  );
};

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Breed" component={BreedScreen} />
      <Tab.Screen name="CollectionScreen" component={CollectionScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    width: '100%',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 2,
    paddingTop: 5,
    paddingBottom: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    paddingTop: 10,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    color: '#4B4B4B',
  },
  centerButton: {
    position: 'absolute',
    zIndex: 99,
  },
  centerCircle: {
    borderRadius: 30,
    backgroundColor: '#0888B1',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
