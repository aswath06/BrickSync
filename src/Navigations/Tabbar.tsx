import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  ClockIcon,
  Homeicon,
  MenuIcon,
  PersonIcon,
  SettingsIcon,
  TruckIcon,
} from '../assets/icons';

const getIcons = (routeName: string, isFocused: boolean) => {
  const color = isFocused ? '#1577EA' : 'grey';
  switch (routeName) {
    case 'Truck':
      return <TruckIcon color={color} width={24} height={24} />;
    case 'Orders':
      return <ClockIcon color={color} width={24} height={24} />;
    case 'Dashboard':
      return <Homeicon color={color} width={24} height={24} />;
    case 'Profile':
      return <PersonIcon color={color} width={24} height={24} />;
    case 'Settings':
      return <SettingsIcon color={color} width={24} height={24} />;
    default:
      return null;
  }
};

export default function Tabbar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
            ? options.title
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityState={isFocused ? {selected: true} : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.pressable}>
            <View style={styles.tabContainer}>
              <View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.iconWrapperFocused,
                ]}>
                {getIcons(route.name, isFocused)}
              </View>
              <Text
                style={{
                  color: isFocused ? '#1577EA' : 'grey',
                  fontSize: 12,
                  marginTop: 4,
                }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const useStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    pressable: {
      flex: 1,
    },
    tabContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconWrapperFocused: {
      backgroundColor: '#E5F0FF', // light blue background when focused
      borderRadius:30,
    },
  });
