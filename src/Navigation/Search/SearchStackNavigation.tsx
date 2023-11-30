import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Search from '../../Screens/Search/Search';
import Artist from '../../Screens/Artists/Artist';
import Playlist from '../../Screens/Library/Playlist';
import UserDetails from '../../Screens/Users/UserDetails';

export type SearchStackParams = {
  Search: undefined;
  Artist: {artistId: string};
  Playlist: {playlistId: string};
  UserDetails: {userId: string};
};

const SearchStackNavigator = createNativeStackNavigator<SearchStackParams>();

export default function SearchStackNavigation() {
  return (
    <SearchStackNavigator.Navigator
      initialRouteName="Search"
      screenOptions={{headerShown: false}}>
      <SearchStackNavigator.Screen name="Search" component={Search} />
      <SearchStackNavigator.Screen name="Artist" component={Artist} />
      <SearchStackNavigator.Screen name="Playlist" component={Playlist} />
      <SearchStackNavigator.Screen name="UserDetails" component={UserDetails} />
    </SearchStackNavigator.Navigator>
  );
}
