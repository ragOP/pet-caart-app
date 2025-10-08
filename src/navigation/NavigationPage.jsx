// src/navigation/NavigationPage.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigation from './BottomTabNavigation';
import TestBottomNavigation from './TestBottomNavigation';
import ProfileDetailScreen from '../screens/ProfileDetailScreen/ProfileDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import AddressInfoScreen from '../screens/AddressInfoScreen/AddressInfoScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import AddAddressScreen from '../screens/AddAddresScreen/AddAddressScreen';
import MyOrderScreen from '../screens/MyOrderScreen/MyOrderScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen/OrderDetailsScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import SignUpScreen from '../screens/SignupScreen/SignupScreen';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import InviteScreen from '../screens/InviteScreen/InviteScreen';
import ContactUsScreen from '../screens/ContactUsScreen/ContactUsScreen';
import Terms from '../screens/Terms&Cond/Terms';
<<<<<<< HEAD
=======
import AllCategoriesScreen from '../screens/AllCategoriesScreen/AllCategoriesScreen';
import BrandScreen from '../screens/BrandScreen/BrandScreen';
import ProductListScreen from '../screens/ProductListScreen/ProductListScreen';
import SingleProductScreen from '../screens/SingleProductScreen/SingleProductScreen';
import ProductCollectionScreeen from '../screens/ProductCollectionScreen/ProductCollectionScreen';
import ContactUsScreen from '../screens/ContactUsScreen/ContactUsScreen';
import { navigationRef } from '../constants/navigationRef';
>>>>>>> 36a840388ef97837435404a978997059f86e1b4d

const Stack = createStackNavigator();

export default function NavigationPage({ showTestBar = false }) {
  const BottomNavigationComponent = showTestBar ? TestBottomNavigation : BottomTabNavigation;

  return (
<<<<<<< HEAD
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" options={{ headerShown: false }} >
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTabs" component={BottomNavigationComponent} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileDetailScreen" component={ProfileDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddressInfoScreen" component={AddressInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="InviteScreen" component={InviteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Terms" component={Terms} options={{ headerShown: false }} />
=======
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="BottomTabs" component={BottomTabNavigation} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="ProfileDetailScreen"
          component={ProfileDetailScreen}
        />
        <Stack.Screen name="AddressInfoScreen" component={AddressInfoScreen} />
        <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
        <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} />
        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignUpScreen} />
        <Stack.Screen name="InviteScreen" component={InviteScreen} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen
          name="AllCategoriesScreen"
          component={AllCategoriesScreen}
        />
        <Stack.Screen name="BrandScreen" component={BrandScreen} />
        <Stack.Screen name="ProductListScreen" component={ProductListScreen} />
        <Stack.Screen
          name="SingleProductScreen"
          component={SingleProductScreen}
        />
        <Stack.Screen
          name="ProductCollectionScreeen"
          component={ProductCollectionScreeen}
        />
        <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
>>>>>>> 36a840388ef97837435404a978997059f86e1b4d
      </Stack.Navigator>
    </NavigationContainer>
  );
}
