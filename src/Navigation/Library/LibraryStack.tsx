import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Library from '../../Screens/Library/Library';
import Playlist from '../../Screens/Library/Playlist';
import Artist from '../../Screens/Artists/Artist';
import AddPlaylistScreen from '../../Screens/Library/AddPlaylist';
import UserDetails from '../../Screens/Users/UserDetails';

export type LibraryStackParams = {
  Library: undefined;
  Playlist: {playlistId: string};
  Artist: {artistId: string};
  AddPlaylist: undefined;
  UserDetails: {userId: undefined};
};

const LibraryNavigator = createNativeStackNavigator<LibraryStackParams>();

export default function LibraryNavigation() {
  return (
    <LibraryNavigator.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Library">
      <LibraryNavigator.Screen name="Library" component={Library} />
      <LibraryNavigator.Screen name="Playlist" component={Playlist} />
      <LibraryNavigator.Screen name="Artist" component={Artist} />
      <LibraryNavigator.Screen name="UserDetails" component={UserDetails} />
      <LibraryNavigator.Group>
        <LibraryNavigator.Screen
          name="AddPlaylist"
          component={AddPlaylistScreen}
          options={{presentation: 'modal'}}
        />
      </LibraryNavigator.Group>
    </LibraryNavigator.Navigator>
  );
}
