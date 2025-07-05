import React from 'react';
// Packages
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { CartScreen, CreateAccountScreen, DashboardScreen, FirstPage, GetStarted, HomeScreen, LoginScreen, OtpScreen, ProductDetails } from '../Screens';
import { BottomNavigation } from './BottomNavigation';
// Screens

const RootStack = createNativeStackNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="DashboardScreen">
        <RootStack.Screen name="GetStarted" component={GetStarted} options={{headerShown: false}}/>
        <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="FirstPage" component={FirstPage} options={{headerShown: false}}/>
        <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
        <RootStack.Screen name="Otp" component={OtpScreen} options={{headerShown:false}} />
        <RootStack.Screen name="ProductDetails" component={ProductDetails} options={{headerShown:false}} />
        <RootStack.Screen name="Cart" component={CartScreen} options={{headerShown:false}} />
        <RootStack.Screen name="CreateAccountScreen" component={CreateAccountScreen} options={{headerShown:false}} />
        <RootStack.Screen
  name="DashboardScreen"
  component={BottomNavigation} // <-- NOT DashboardScreen
  options={{headerShown: false}}
/>


      </RootStack.Navigator>
    </NavigationContainer>
  );
};