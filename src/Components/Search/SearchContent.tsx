import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
} from 'react-native';
import React, {Dispatch, SetStateAction, forwardRef, useState} from 'react';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SongListTileItem from '../Songs/SongListTileItem';
import OctIcons from 'react-native-vector-icons/Octicons';
import {Colors} from '../../Constants/colors';
import {useQuery} from '@tanstack/react-query';
import {search} from '../../api/search/search';
import ArtistListItem from '../Library/ArtistListItem';
import PlaylistListItem from '../Library/PlaylistListItem';
import {Playlist} from '../Types/libraryTypes';
import {Track} from '../Types/songTypes';
import {Artist} from '../Types/artistTypes';

type SearchContentProps = {
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  navigation: any;
};

const SearchContent = forwardRef<TextInput, SearchContentProps>(
  ({isSearching, setIsSearching, navigation}, ref) => {
    const safeAreaInsets = useSafeAreaInsets();

    const [searchQ, setSearchQ] = useState('');

    const searchQuery = useQuery({
      queryKey: ['search', searchQ],
      queryFn: async ({queryKey}) => {
        const [_, q] = queryKey;

        return search({q});
      },
      enabled: !!searchQ,
    });

    const searchAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.black,
        position: 'absolute',
        zIndex: 3,
        opacity: withTiming(isSearching ? 1 : 0, {duration: 250}),
      };
    });

    const flatlistSearchData =
      [
        ...(searchQuery.data?.artists?.items ?? []),
        ...(searchQuery.data?.tracks?.items ?? []),
        ...(searchQuery.data?.playlists?.items ?? []),
      ] ?? [];

    return (
      <Animated.View
        pointerEvents={isSearching ? 'auto' : 'none'}
        style={searchAnimatedStyle}>
        <BlurView
          style={[styles.absolute, {height: safeAreaInsets.top + 70}]}
          blurAmount={12}
          blurType="dark"
        />
        <View
          style={[
            styles.searchBarContainer,
            {
              paddingTop: safeAreaInsets.top + 20,
            },
          ]}>
          <TextInput
            ref={ref}
            style={styles.textinputStyle}
            value={searchQ}
            onChangeText={setSearchQ}
          />
          <OctIcons
            name="search"
            color="white"
            size={20}
            style={styles.searchIconStyle}
          />
          <TouchableOpacity
            onPress={() => {
              setIsSearching(false);
              Keyboard.dismiss();
            }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={flatlistSearchData}
          scrollIndicatorInsets={{bottom: 120, top: safeAreaInsets.top}}
          contentContainerStyle={[
            styles.contentStyle,
            {
              paddingBottom: safeAreaInsets.bottom + 120,
              paddingTop: safeAreaInsets.top + 80,
            },
          ]}
          renderItem={({item}) => {
            if (item.type === 'artist') {
              return (
                <ArtistListItem
                  artist={item as Artist}
                  normalPaddingHorizontal={0}
                  onPressArtist={() =>
                    navigation.navigate('Artist', {artistId: item.id})
                  }
                />
              );
            }
            if (item.type === 'playlist') {
              return (
                <PlaylistListItem
                  playlist={item as Playlist}
                  normalPaddingHorizontal={0}
                  onPressPlaylist={() =>
                    navigation.navigate('Playlist', {playlistId: item.id})
                  }
                />
              );
            }
            return <SongListTileItem song={item as Track} />;
          }}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  cancelText: {color: Colors.white, fontSize: 12},
  itemContainer: {width: '50%', padding: 10},
  itemContentContainer: {backgroundColor: '#fff', height: 120, borderRadius: 4},
  contentStyle: {
    width: '94%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  textinputStyle: {
    backgroundColor: '#1f1f1f',
    width: '85%',
    height: 30,
    borderRadius: 6,
    paddingHorizontal: 40,
    fontSize: 12,
  },
  searchBarContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 5,
  },
  searchIconStyle: {position: 'absolute', bottom: 5, left: 10},
});

export default React.memo(SearchContent);
