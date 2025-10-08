// src/navigation/NavigationPage.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigation from './BottomTabNavigation';
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
import Terms from '../screens/Terms&Cond/Terms';
import AllCategoriesScreen from '../screens/AllCategoriesScreen/AllCategoriesScreen';
import BrandScreen from '../screens/BrandScreen/BrandScreen';
import ProductListScreen from '../screens/ProductListScreen/ProductListScreen';
import SingleProductScreen from '../screens/SingleProductScreen/SingleProductScreen';
import ProductCollectionScreeen from '../screens/ProductCollectionScreen/ProductCollectionScreen';
import ContactUsScreen from '../screens/ContactUsScreen/ContactUsScreen';
import { navigationRef } from '../constants/navigationRef';

const Stack = createStackNavigator();

export default function NavigationPage() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabNavigation}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileDetailScreen"
          component={ProfileDetailScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddressInfoScreen"
          component={AddressInfoScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddAddressScreen"
          component={AddAddressScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyOrderScreen"
          component={MyOrderScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignUpScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="InviteScreen"
          component={InviteScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllCategoriesScreen"
          component={AllCategoriesScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrandScreen"
          component={BrandScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="SingleProductScreen"
          component={SingleProductScreen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductCollectionScreeen"
          component={ProductCollectionScreeen}
          screenOptions={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContactUsScreen"
          component={ContactUsScreen}
          screenOptions={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
