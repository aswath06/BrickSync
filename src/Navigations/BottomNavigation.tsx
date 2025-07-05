import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './types';
import Tabbar from './Tabbar';
import { Truck } from '../Screens/Truck';
import { Orders } from '../Screens/Orders';
import { DashboardScreen } from '../Screens/DashboardScreen';
import { Profile } from '../Screens/Profile';
import { Settings } from '../Screens/Settings';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const renderTabbar = (props: BottomTabBarProps) => <Tabbar {...props} />;

export const BottomNavigation = () => {
  return (
    <BottomTab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={renderTabbar}>
      <BottomTab.Screen
        name="Truck"
        component={Truck}
        options={{tabBarLabel: 'Truck'}}
      />
      <BottomTab.Screen
        name="Orders"
        component={Orders}
        options={{tabBarLabel: 'Orders'}}
      />
      <BottomTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{tabBarLabel: 'Person'}}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{tabBarLabel: 'Settings'}}
      />
    </BottomTab.Navigator>
  );
};
