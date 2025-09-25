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

const Stack = createStackNavigator();

export default function NavigationPage() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        options={{ headerShown: false }}
      >
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileDetailScreen"
          component={ProfileDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddressInfoScreen"
          component={AddressInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddAddressScreen"
          component={AddAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyOrderScreen"
          component={MyOrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignupScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InviteScreen"
          component={InviteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllCategoriesScreen"
          component={AllCategoriesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrandScreen"
          component={BrandScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductListScreen"
          component={ProductListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SingleProductScreen"
          component={SingleProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductCollectionScreeen"
          component={ProductCollectionScreeen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContactUsScreen"
          component={ContactUsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
