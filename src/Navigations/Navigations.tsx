import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { getToken } from '../services/authStorage';

// Screens
import {
  CartScreen,
  CreateAccountScreen,
  DamageHistory,
  DashboardScreen,
  FirstPage,
  GetStarted,
  HomeScreen,
  LoginScreen,
  OtpScreen,
  ProductDetails,
  RefuelHistory,
} from '../Screens';
import { BottomNavigation } from './BottomNavigation';
import { CustomerListScreen } from '../Screens/CustomerListScreen';
import { VehicleListScreen } from '../Screens/VehicleListScreen';
import { AssignJobScreen } from '../Screens/AssignJobScreen';
import { StatementPage } from '../Screens/StatementPage';
import ExportStatement from '../Screens/ExportStatement';
import { BillScreen } from '../Screens/BillScreen';

const RootStack = createNativeStackNavigator();

export const Navigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setInitialRoute(token ? 'DashboardScreen' : 'FirstPage');
    };
    checkToken();
  }, []);

  // Show loading screen while checking token
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={initialRoute}>
        <RootStack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }} />
        <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="FirstPage" component={FirstPage} options={{ headerShown: false }} />
        <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="Otp" component={OtpScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <RootStack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="CreateAccountScreen" component={CreateAccountScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="DashboardScreen" component={BottomNavigation} options={{ headerShown: false }} />
        <RootStack.Screen name="DamageHistory" component={DamageHistory} options={{ headerShown: false }} />
        <RootStack.Screen name="RefuelHistory" component={RefuelHistory} options={{ headerShown: false }} />
        <RootStack.Screen name="CustomerListScreen" component={CustomerListScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="VehicleListScreen" component={VehicleListScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="AssignJob" component={AssignJobScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="StatementPage" component={StatementPage} options={{ headerShown: false }} />
        <RootStack.Screen name="ExportStatement" component={ExportStatement} options={{ headerShown: false }} />
        <RootStack.Screen name="BillScreen" component={BillScreen} options={{ headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
