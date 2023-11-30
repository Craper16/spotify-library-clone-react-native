import React, {useCallback} from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Home from '../../Screens/Home/Home';
import BottomTabBar from '../../Components/Navigation/BottomTabBar';
import LibraryNavigation from '../Library/LibraryStack';
import SearchStackNavigation from '../Search/SearchStackNavigation';

type BottomNavigationParams = {
  HomeStack: undefined;
  SearchStack: undefined;
  LibraryStack: undefined;
};

const BottomTabNavigator = createBottomTabNavigator<BottomNavigationParams>();

export default function RootBottomTabNavigation() {
  const BottomBar = useCallback(function (tabBarProps: BottomTabBarProps) {
    return <BottomTabBar {...tabBarProps} />;
  }, []);

  return (
    <BottomTabNavigator.Navigator
      tabBar={BottomBar}
      screenOptions={{headerShown: false}}>
      <BottomTabNavigator.Screen name="HomeStack" component={Home} />
      <BottomTabNavigator.Screen
        name="SearchStack"
        component={SearchStackNavigation}
      />
      <BottomTabNavigator.Screen
        name="LibraryStack"
        component={LibraryNavigation}
      />
    </BottomTabNavigator.Navigator>
  );
}
