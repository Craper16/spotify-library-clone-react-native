import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {LibraryStackParams} from '../../Navigation/Library/LibraryStack';
import SongListTileItem from '../../Components/Songs/SongListTileItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlaylistTopSearchBar from '../../Components/Playlist/PlaylistTopSearchBar';
import SearchContent from '../../Components/Search/SearchContent';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import PlayButton from '../../Components/Utils/PlayButton';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {AnimatedLinearGradient} from '../../Components/Navigation/BottomTabBar';
import {Colors} from '../../Constants/colors';
import PlaylistTopImage from '../../Components/Playlist/PlaylistTopImage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useScreenInitialization} from '../../Utils/Hooks/useScreenInitialization';
import {useQuery} from '@tanstack/react-query';
import {getPlaylist} from '../../api/playlists/getPlaylist';
import {SearchStackParams} from '../../Navigation/Search/SearchStackNavigation';
import {formatTimeFromMilliSeconds} from '../../Helpers/dateHelpers';
import {getRecomendedTracks} from '../../api/tracks/getRecomendedTracks';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';

type PlaylistProps =
  | NativeStackScreenProps<LibraryStackParams, 'Playlist'>
  | NativeStackScreenProps<SearchStackParams, 'Playlist'>;

const Playlist = ({route, navigation}: PlaylistProps) => {
  const {playlistId} = route.params;

  const safeAreaInsets = useSafeAreaInsets();

  const {isContentReady, setIsContentReady, mainContentAnimatedStyles} =
    useScreenInitialization({
      manuallyAssign: true,
    });

  const scrollContentOffsetY = useSharedValue(110);

  const [isSearching, setIsSearching] = useState(false);

  const getPlaylistQuery = useQuery({
    queryKey: [playlistId],
    queryFn: async () => {
      const response = await getPlaylist({playlist_id: playlistId});

      setTimeout(() => setIsContentReady(true), 200);

      getRecomendedTracksQuery.refetch();

      return response;
    },
  });

  const getRecomendedTracksQuery = useQuery({
    queryKey: [`${playlistId}Recomendations`],
    queryFn: () =>
      getRecomendedTracks({
        limit: 5,
        seedArtists: getPlaylistQuery.data?.playlist?.tracks?.items
          ?.map(item => item.track?.artists[0].id)
          ?.slice(0, 5)
          .toString() as string,
        seedTracks: getPlaylistQuery.data?.playlist?.tracks?.items
          ?.map(item => item.track?.id)
          ?.slice(0, 5)
          .toString() as string,
        seedGenres: 'rock,rap',
      }),
    retry: false,
    enabled: false,
  });

  const flatlistRef = useRef<FlatList>(null);
  const searchTextInputRef = useRef<TextInput>(null);

  const scrollHandler = useAnimatedScrollHandler(({contentOffset}) => {
    scrollContentOffsetY.value = contentOffset.y;
  });

  const mainHeaderAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      opacity: interpolate(scrollContentOffsetY.value, [380, 385], [0, 1], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      height: safeAreaInsets.top + 60,
      position: 'absolute',
      zIndex: 15,
      width: '100%',
    };
  });

  const headerAnimatedTextStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      fontSize: 20,
      fontWeight: 'bold',
      paddingRight: 20,
      color: Colors.white,
      opacity: interpolate(scrollContentOffsetY.value, [390, 490], [0, 1], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      transform: [
        {
          translateY: interpolate(
            scrollContentOffsetY.value,
            [390, 490],
            [10, 0],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

  const backgroundLinearGradientAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      height: interpolate(
        scrollContentOffsetY.value,
        [0, 200],
        [SCREEN_HEIGHT / 2, SCREEN_HEIGHT / 3.2],
      ),
      width: SCREEN_WIDTH,
      position: 'absolute',
      zIndex: -1,
    };
  });

  const FlatlistHeader = useCallback(() => {
    return (
      <View>
        <View style={{height: safeAreaInsets.top + 130}} />
        <View
          style={{
            height:
              Platform.OS === 'android'
                ? safeAreaInsets.top + 250
                : safeAreaInsets.top + 230,
          }}
        />
        <View>
          <Text style={styles.playlistNameText}>
            {getPlaylistQuery.data?.playlist?.name}
          </Text>
          <Text style={styles.playlistDescriptionText}>
            {getPlaylistQuery.data?.playlist?.description}
          </Text>
          <Pressable
            style={[styles.rowCentered, styles.pv10]}
            onPress={() => {
              (navigation as any).push('UserDetails', {
                userId: getPlaylistQuery?.data?.playlistOwner?.id,
              });
            }}>
            <Image
              source={{
                uri: getPlaylistQuery.data?.playlistOwner?.images[0].url,
                height: 20,
                width: 20,
              }}
              borderRadius={100}
            />
            <View style={styles.smallWidthSeperator} />
            <Text style={styles.playlistDescriptionText}>
              {getPlaylistQuery.data?.playlistOwner?.display_name}
            </Text>
          </Pressable>
          <View style={styles.actionsContainer}>
            <SimpleLineIcons
              name="globe"
              color={Colors.white}
              style={styles.halfOpacity}
            />
            <View style={styles.smallWidthSeperator} />
            <Text style={styles.playlistSavesAndDurationText}>
              {`${getPlaylistQuery.data?.playlist?.followers?.total} saves`}
            </Text>
            <EntypoIcons
              name="dot-single"
              style={styles.halfOpacity}
              color="white"
              size={18}
            />
            <Text style={styles.playlistSavesAndDurationText}>
              {formatTimeFromMilliSeconds(
                getPlaylistQuery.data?.playlist?.tracks?.items.map(
                  item => item.track.duration_ms,
                )!,
              )}
            </Text>
          </View>
          <View style={styles.playlistActionsContainer}>
            <View style={styles.rowCentered}>
              <TouchableOpacity style={styles.downloadContainer}>
                <AntDesignIcons name="arrowdown" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ph20}>
                <IonIcons name="person-add-outline" color="white" size={20} />
              </TouchableOpacity>
              <TouchableOpacity>
                <EntypoIcons
                  name="dots-three-horizontal"
                  color="white"
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.rowCentered}>
              <TouchableOpacity style={styles.pr15}>
                <EntypoIcons name="shuffle" size={30} color={Colors.green} />
              </TouchableOpacity>
              <PlayButton animatedPosition={scrollContentOffsetY} />
            </View>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.rowCenteredPb10}>
          <View style={styles.addButtonContainer}>
            <AntDesignIcons
              name="plus"
              color="white"
              style={styles.halfOpacity}
              size={30}
            />
          </View>
          <Text style={styles.titleStyle}>Add to playlist</Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    getPlaylistQuery.data?.playlist?.name,
    safeAreaInsets.top,
    scrollContentOffsetY,
    getPlaylistQuery.data?.playlist?.description,
    getPlaylistQuery.data?.playlistOwner?.display_name,
    getPlaylistQuery.data?.playlistOwner?.images,
    getPlaylistQuery.data?.playlist?.followers?.total,
    getPlaylistQuery.data?.playlist?.tracks?.items,
    getPlaylistQuery.data?.playlistOwner?.id,
    navigation,
  ]);

  const FlatlistFooterFooter = useCallback(
    () => (
      <TouchableOpacity
        disabled={getRecomendedTracksQuery.isFetching}
        style={styles.bottomButton}
        onPress={() => getRecomendedTracksQuery.refetch()}>
        <Text>Refresh</Text>
      </TouchableOpacity>
    ),
    [getRecomendedTracksQuery],
  );
  const FlatlistFooter = useCallback(() => {
    return (
      <View>
        <View style={styles.recomendedSongsTextDescriptionContainer}>
          <Text style={styles.recomendedSongsTitle}>Recommended songs</Text>
          <Text style={[styles.basedOnText]}>
            Based on the songs of this playlist
          </Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={getRecomendedTracksQuery.data?.tracks ?? []}
          renderItem={({item}) => <SongListTileItem song={item} />}
          ListFooterComponent={FlatlistFooterFooter}
        />
      </View>
    );
  }, [getRecomendedTracksQuery, FlatlistFooterFooter]);

  function scrollFlatlistToOffset(offset: number, animated: boolean) {
    flatlistRef?.current?.scrollToOffset({offset, animated});
  }

  return (
    <View style={[styles.screen]}>
      <View style={styles.screen}>
        <AnimatedLinearGradient
          colors={[
            getPlaylistQuery.data?.playlist?.primary_color ?? Colors.green,
            Colors.black,
          ]}
          style={mainHeaderAnimatedStyles}
        />
        <View
          style={[
            styles.platlistNameAndBackButton,
            {
              paddingTop: safeAreaInsets.top + 15,
            },
          ]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <EntypoIcons name="chevron-thin-left" size={20} color="white" />
          </TouchableOpacity>
          <Animated.Text numberOfLines={1} style={headerAnimatedTextStyle}>
            {getPlaylistQuery.data?.playlist?.name}
          </Animated.Text>
          <View />
        </View>
        <AnimatedLinearGradient
          style={backgroundLinearGradientAnimatedStyles}
          colors={[
            getPlaylistQuery?.data?.playlist?.primary_color ?? Colors.green,
            Colors.black,
          ]}
        />
        {isContentReady && (
          <Animated.View style={[mainContentAnimatedStyles]}>
            <PlaylistTopSearchBar
              onSearchPress={() => {
                setIsSearching(true);
                searchTextInputRef.current?.focus();
              }}
              animatedPosition={scrollContentOffsetY}
            />
            <PlaylistTopImage
              animatedPosition={scrollContentOffsetY}
              imageUrl={getPlaylistQuery.data?.playlist?.images[0]?.url!}
            />
            <Animated.FlatList
              ref={flatlistRef as any}
              data={getPlaylistQuery?.data?.playlist?.tracks?.items ?? []}
              onScroll={scrollHandler}
              contentOffset={{y: 110, x: 0}}
              renderItem={({item: track}) => (
                <SongListTileItem song={track.track} />
              )}
              onScrollEndDrag={({nativeEvent: {contentOffset}}) => {
                if (contentOffset.y > 0 && contentOffset.y < 55) {
                  scrollFlatlistToOffset(0, true);
                } else if (contentOffset.y >= 55 && contentOffset.y < 110) {
                  scrollFlatlistToOffset(110, true);
                }
              }}
              scrollIndicatorInsets={{bottom: 120}}
              ListHeaderComponent={FlatlistHeader}
              contentContainerStyle={[
                styles.contentStyle,
                {
                  paddingBottom: safeAreaInsets.bottom + 120,
                },
              ]}
              ListFooterComponent={FlatlistFooter}
            />
          </Animated.View>
        )}
      </View>
      {isContentReady && (
        <SearchContent
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          ref={searchTextInputRef}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomButton: {
    marginVertical: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  recomendedSongsTextDescriptionContainer: {paddingVertical: 10},
  basedOnText: {
    color: Colors.white,
    opacity: 0.5,
    fontWeight: '700',
  },
  recomendedSongsTitle: {fontWeight: 'bold', color: Colors.white, fontSize: 18},
  addButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenteredPb10: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  pr15: {paddingRight: 15},
  ph20: {paddingHorizontal: 20},
  downloadContainer: {
    height: 20,
    width: 20,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  rowCentered: {flexDirection: 'row', alignItems: 'center'},
  playlistActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
  pv10: {paddingVertical: 10},
  platlistNameAndBackButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 120,
    paddingHorizontal: 15,
    width: '100%',
  },
  halfOpacity: {opacity: 0.5},
  smallWidthSeperator: {width: 5},
  titleStyle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingLeft: 15,
  },
  playlistNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    paddingTop: 20,
  },
  playlistDescriptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistSavesAndDurationText: {
    color: Colors.white,
    opacity: 0.5,
    fontWeight: '700',
  },
  screen: {flex: 1, backgroundColor: Colors.black},
  contentStyle: {
    width: '94%',
    alignSelf: 'center',
  },
});

export default Playlist;
