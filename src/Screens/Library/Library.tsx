import {View, StyleSheet, FlatList} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import LibraryMainScreenHeader from '../../Components/Library/LibraryMainScreenHeader';
import PlaylistListItem from '../../Components/Library/PlaylistListItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LibraryListFooter from '../../Components/Library/LibraryListFooter';
import LibraryListHeader from '../../Components/Library/LibraryListHeader';
import LibraryRightScrollIndicator from '../../Components/Library/LibraryRightScrollIndicator';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {LibraryStackParams} from '../../Navigation/Library/LibraryStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useScreenInitialization} from '../../Utils/Hooks/useScreenInitialization';
import {useQuery} from '@tanstack/react-query';
import {getCurrentUserPlaylists} from '../../api/playlists/getCurrentUserPlaylists';
import {getUserFollowedArtists} from '../../api/users/getUserFollowedArtists';
import ArtistListItem from '../../Components/Library/ArtistListItem';
import {Colors} from '../../Constants/colors';
import LibraryAddSelectionBottomSheet from '../../Components/Library/LibraryAddSelectionBottomSheet';
import {BottomSheetModal, SCREEN_HEIGHT} from '@gorhom/bottom-sheet';

type LibraryProps = NativeStackScreenProps<LibraryStackParams, 'Library'>;

const Library = ({navigation}: LibraryProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const {isContentReady, setIsContentReady, mainContentAnimatedStyles} =
    useScreenInitialization({
      manuallyAssign: true,
    });

  const contentFlatList = useRef<FlatList>(null);
  const addOptionsBottomSheetRef = useRef<BottomSheetModal>(null);

  const getUserPlaylistsQuery = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await getCurrentUserPlaylists({
        limit: 50,
      });

      setIsContentReady(true);

      return response;
    },
  });

  const getUserFollowedArtistsQuery = useQuery({
    queryKey: ['artists'],
    queryFn: () => getUserFollowedArtists({type: 'artist', limit: 50}),
  });

  const scrollContentOffset = useSharedValue(0);
  const scrollTotalHeight = useSharedValue(0);

  scrollTotalHeight.value =
    (getUserFollowedArtistsQuery?.data?.artists?.items?.length ?? 0) * 80 +
    (getUserPlaylistsQuery?.data?.items?.length ?? 0) * 80 +
    160;

  const handleFlatlistOnScroll = useAnimatedScrollHandler(({contentOffset}) => {
    scrollContentOffset.value = contentOffset.y;
  });

  const [numOfColumns, setNumOfColumns] = useState(1);

  const FlatlistHeader = useCallback(
    () => (
      <LibraryListHeader
        onRightIconPress={() => {
          if (numOfColumns === 1) {
            return setNumOfColumns(2);
          }

          return setNumOfColumns(1);
        }}
      />
    ),
    [numOfColumns],
  );

  const FlatlistFooter = useCallback(
    () => <LibraryListFooter vertical={numOfColumns === 2} />,
    [numOfColumns],
  );

  const libraryFlatlistContent =
    [
      ...(getUserPlaylistsQuery.data?.items ?? []),
      ...(getUserFollowedArtistsQuery.data?.artists?.items ?? []),
    ] ?? [];

  return (
    <View style={styles.screen}>
      {isContentReady && (
        <Animated.View style={[mainContentAnimatedStyles, styles.screen]}>
          <LibraryMainScreenHeader
            onAddPress={() => addOptionsBottomSheetRef.current?.present()}
          />
          <LibraryRightScrollIndicator
            scrollContentOffset={scrollContentOffset}
            scrollTotalHeight={scrollTotalHeight}
            onScrollList={scrollPosition => {
              contentFlatList?.current?.scrollToOffset({
                offset:
                  scrollTotalHeight.value / SCREEN_HEIGHT -
                  safeAreaInsets.bottom -
                  safeAreaInsets.top -
                  300 * scrollPosition.value,
                animated: false,
              });
            }}
          />
          <Animated.FlatList
            ref={contentFlatList as any}
            key={numOfColumns}
            numColumns={numOfColumns}
            data={libraryFlatlistContent}
            indicatorStyle="black"
            onEndReachedThreshold={0.5}
            ListHeaderComponent={FlatlistHeader}
            scrollEventThrottle={10}
            onScroll={handleFlatlistOnScroll}
            scrollIndicatorInsets={{bottom: 120}}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={FlatlistFooter}
            contentContainerStyle={{
              paddingBottom: safeAreaInsets.bottom + 120,
            }}
            renderItem={({item}) => {
              if (item.type === 'artist') {
                return (
                  <ArtistListItem
                    artist={item}
                    vertical={numOfColumns === 2}
                    onPressArtist={() =>
                      navigation.navigate('Artist', {artistId: item.id})
                    }
                  />
                );
              }

              return (
                <PlaylistListItem
                  playlist={item}
                  vertical={numOfColumns === 2}
                  onPressPlaylist={() =>
                    navigation.navigate('Playlist', {playlistId: item.id})
                  }
                />
              );
            }}
          />
          <LibraryAddSelectionBottomSheet
            ref={addOptionsBottomSheetRef}
            onAddPlaylistPress={() => {
              addOptionsBottomSheetRef.current?.dismiss();
              setTimeout(() => navigation.navigate('AddPlaylist'), 200);
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: Colors.black},
});

export default Library;
