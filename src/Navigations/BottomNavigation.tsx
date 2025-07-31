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
import { useUserStore } from '../stores/useUserStore';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const renderTabbar = (props: BottomTabBarProps) => <Tabbar {...props} />;

export const BottomNavigation = () => {
    const user = useUserStore((state) => state.user);
    const userRole = user?.userrole;
  return (
    
    <BottomTab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={renderTabbar}>
        <BottomTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      />
     {userRole !== 3 && (
        <BottomTab.Screen
          name="Truck"
          component={Truck}
          options={{ tabBarLabel: 'Truck' }}
        />
      )}
      <BottomTab.Screen
        name="Orders"
        component={Orders}
        options={{tabBarLabel: 'Orders'}}
      />
      {/* <BottomTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarLabel: 'Dashboard'}}
      /> */}
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
