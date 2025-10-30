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

const { width } = Dimensions.get('window');
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
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <ImageBackground
        source={require('../assets/images/baar.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.tabBar}>
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isSelected = selectedIndex === index;
            if (index === 2) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate(tab.route)}
                  style={styles.centerButton}
                  activeOpacity={1}
                >
                  <View
                    style={[
                      styles.centerCircle,
                      isSelected && { backgroundColor: '#F59A11' },
                    ]}
                  >
                    <Icon size={26} color={isSelected ? '#fff' : '#fff'} />
                  </View>
                </TouchableOpacity>
              );
            }

            const tabStyle = [
              styles.tab,
              index === 1 && { marginRight: 40 },
              index === 3 && { marginLeft: 40 },
            ];

            return (
              <TouchableOpacity
                key={index}
                style={tabStyle}
                onPress={() => navigation.navigate(tab.route)}
                activeOpacity={1}
              >
                <Icon size={28} color={isSelected ? '#0888B1' : '#4B4B4B'} />
                {/* <Text
                  style={[styles.label, isSelected && { color: '#0888B1' }]}
                >
                  {tab.label}
                </Text> */}
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
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    zIndex: 2,
    paddingTop: 5,
    paddingBottom: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 120) / 4,
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
    bottom: 30,
    left: width / 2 - 28,
    zIndex: 99,
  },
  centerCircle: {
    width: 55,
    height: 55,
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
