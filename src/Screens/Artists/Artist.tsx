import React, {useCallback} from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../Constants/colors';
import {LibraryStackParams} from '../../Navigation/Library/LibraryStack';
import {useScreenInitialization} from '../../Utils/Hooks/useScreenInitialization';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  IAllArtistDataResponse,
  getAllArtistData,
} from '../../api/artists/getAllArtistData';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {AnimatedLinearGradient} from '../../Components/Navigation/BottomTabBar';
import PlayButton, {
  AnimatedTouchableOpacity,
} from '../../Components/Utils/PlayButton';
import SongListTileItem from '../../Components/Songs/SongListTileItem';
import AlbumListItem from '../../Components/Artists/AlbumListItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ArtistListItem from '../../Components/Library/ArtistListItem';
import {SearchStackParams} from '../../Navigation/Search/SearchStackNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {followArists} from '../../api/users/followArtists';
import {unfollowArtists} from '../../api/users/unfollowArtists';

type ArtistProps =
  | NativeStackScreenProps<LibraryStackParams, 'Artist'>
  | NativeStackScreenProps<SearchStackParams, 'Artist'>;

function Artist({route, navigation}: ArtistProps) {
  const queryClient = useQueryClient();

  const {artistId} = route.params;

  const safeAreaInsets = useSafeAreaInsets();

  const scrollContentOffsetY = useSharedValue(0);

  const {isContentReady, mainContentAnimatedStyles, setIsContentReady} =
    useScreenInitialization({manuallyAssign: true});

  const getAllArtistDataQuery = useQuery({
    queryKey: [artistId],
    queryFn: async () => {
      const response = await getAllArtistData({artistId});

      setTimeout(() => setIsContentReady(true), 100);

      return response;
    },
  });

  const followArtistMutation = useMutation({
    mutationFn: followArists,
    onMutate: async () => {
      await queryClient.cancelQueries([artistId]);

      const previousClientData: IAllArtistDataResponse | undefined =
        queryClient.getQueryData([artistId])!;

      queryClient.setQueryData([artistId], {
        ...previousClientData,
        isFollowing: true,
      });

      return {previousClientData};
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([artistId], context?.previousClientData);
    },
    onSettled: () => {
      queryClient.invalidateQueries([artistId]);
    },
  });

  const unFollowArtistMutation = useMutation({
    mutationFn: unfollowArtists,
    onMutate: async () => {
      await queryClient.cancelQueries([artistId]);

      const previousClientData: IAllArtistDataResponse | undefined =
        queryClient.getQueryData([artistId])!;

      queryClient.setQueryData([artistId], {
        ...previousClientData,
        isFollowing: false,
      });

      return {previousClientData};
    },
    onError: (error, _, context) => {
      queryClient.setQueryData([artistId], context?.previousClientData);
    },
    onSettled: () => {
      queryClient.invalidateQueries([artistId]);
    },
  });

  const PopularListHeader = useCallback(
    () => <Text style={styles.listHeaderText}>Popular</Text>,
    [],
  );

  const PopularReleasesListHeader = useCallback(
    () => <Text style={styles.listHeaderText}>Popular releases</Text>,
    [],
  );

  const PopularReleasesListFooter = useCallback(
    () => (
      <View style={styles.flexRowJusCenter}>
        <TouchableOpacity style={[styles.listFooterButtonContainer]}>
          <Text style={styles.followingButtonText}>See discography</Text>
        </TouchableOpacity>
      </View>
    ),
    [],
  );

  const AboutHeader = useCallback(
    () => <Text style={[styles.listHeaderText, styles.pb10]}>About</Text>,
    [],
  );

  const FansAlsoLikeHeader = useCallback(
    () => <Text style={styles.listHeaderText}>Fans also like</Text>,
    [],
  );

  const FeaturingListHeader = useCallback(
    () => (
      <Text
        style={
          styles.listHeaderText
        }>{`Featuring ${getAllArtistDataQuery.data?.artist?.name}`}</Text>
    ),
    [getAllArtistDataQuery.data?.artist.name],
  );

  const mainHeaderAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      opacity: interpolate(scrollContentOffsetY.value, [274, 275], [0, 1], {
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
      opacity: interpolate(scrollContentOffsetY.value, [305, 370], [0, 1], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      transform: [
        {
          translateY: interpolate(
            scrollContentOffsetY.value,
            [305, 370],
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

  const listHeaderTitleAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      opacity: interpolate(
        scrollContentOffsetY.value,
        [-130, -50, 275, 310],
        [0, 1, 1, 0.3],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
    };
  });

  const imageAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      height: interpolate(
        scrollContentOffsetY.value,
        [-500, 0],
        [SCREEN_HEIGHT / 1, SCREEN_HEIGHT / 1.8],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
    };
  });

  const headerBackButtonAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      padding: 7,
      borderRadius: 100,
      right: interpolate(scrollContentOffsetY.value, [275, 240], [7, 0], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      backgroundColor: interpolateColor(
        scrollContentOffsetY.value,
        [275, 250],
        ['rgba(100, 100, 100, 0.0)', 'rgba(100, 100, 100, 0.7)'],
      ),
    };
  });

  const handleScrollViewOnScroll = useAnimatedScrollHandler(
    ({contentOffset}) => {
      scrollContentOffsetY.value = contentOffset.y;
    },
  );

  return (
    <View style={styles.screen}>
      {isContentReady && (
        <Animated.View style={[mainContentAnimatedStyles, styles.screen]}>
          <Animated.Image
            source={{
              uri: getAllArtistDataQuery.data?.artist?.images[0].url,
              height: SCREEN_HEIGHT / 1.8,
              width: SCREEN_WIDTH,
            }}
            style={[imageAnimatedStyles, styles.backgroundImageStyle]}
          />
          <AnimatedLinearGradient
            colors={['rgba(40, 40, 40, 1)', 'rgba(25, 25, 25, 1)']}
            style={mainHeaderAnimatedStyles}
          />
          <Animated.View
            style={[
              styles.platlistNameAndBackButton,
              {paddingTop: safeAreaInsets.top + 15},
            ]}>
            <AnimatedTouchableOpacity
              style={headerBackButtonAnimatedStyles}
              onPress={() => navigation.goBack()}>
              <EntypoIcons name="chevron-thin-left" size={20} color="white" />
            </AnimatedTouchableOpacity>
            <Animated.Text numberOfLines={1} style={headerAnimatedTextStyle}>
              {getAllArtistDataQuery.data?.artist.name}
            </Animated.Text>
            <View />
          </Animated.View>
          <Animated.ScrollView
            style={styles.flex1}
            onScroll={handleScrollViewOnScroll}
            contentContainerStyle={{
              paddingBottom: safeAreaInsets.bottom + 120,
            }}
            scrollIndicatorInsets={{bottom: 120}}>
            <LinearGradient
              colors={['rgba(30, 30, 30, 0.0)', Colors.black]}
              style={styles.listHeaderContainer}>
              <Animated.Text
                style={[listHeaderTitleAnimatedStyles, styles.artistNameText]}>
                {getAllArtistDataQuery.data?.artist.name}
              </Animated.Text>
            </LinearGradient>
            <View style={styles.restOfContentContainer}>
              <View style={styles.restOfContentTopInfo}>
                <Text style={styles.monthlyListenersText}>
                  {`${getAllArtistDataQuery.data?.artist.followers.total} monthly listeners`}
                </Text>
                <View style={[styles.rowSpaced, styles.pt10]}>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={styles.followingButtonContainer}
                      onPress={() => {
                        if (!getAllArtistDataQuery.data?.isFollowing) {
                          return followArtistMutation.mutate({
                            ids: [artistId].toString(),
                            type: 'artist',
                          });
                        }

                        return unFollowArtistMutation.mutate({
                          ids: [artistId].toString(),
                          type: 'artist',
                        });
                      }}>
                      <Text style={styles.followingButtonText}>
                        {getAllArtistDataQuery.data?.isFollowing
                          ? 'Following'
                          : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.w25} />
                    <TouchableOpacity style={styles.shuffleAndDotsStyle}>
                      <EntypoIcons
                        name="dots-three-horizontal"
                        color="white"
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity style={styles.shuffleAndDotsStyle}>
                      <EntypoIcons name="shuffle" size={30} color="white" />
                    </TouchableOpacity>
                    <View style={styles.w15} />
                    <PlayButton
                      animatedPosition={scrollContentOffsetY}
                      onPress={() => {}}
                    />
                  </View>
                </View>
              </View>
              <FlatList
                ListHeaderComponent={PopularListHeader}
                data={getAllArtistDataQuery.data?.topTracks?.slice(0, 5) ?? []}
                renderItem={({item, index}) => (
                  <View style={[styles.row, styles.ph15]}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                    <SongListTileItem song={item} />
                  </View>
                )}
                scrollEnabled={false}
              />
              <FlatList
                ListHeaderComponent={PopularReleasesListHeader}
                data={
                  getAllArtistDataQuery.data?.albums?.items
                    ?.filter(
                      album =>
                        album.album_group === 'single' ||
                        album.album_group === 'album',
                    )
                    ?.slice(0, 4) ?? []
                }
                renderItem={({item}) => (
                  <AlbumListItem album={item} fontSize={20} />
                )}
                ListFooterComponent={PopularReleasesListFooter}
                scrollEnabled={false}
              />
              <AboutHeader />
              <Pressable>
                <ImageBackground
                  source={{
                    uri: getAllArtistDataQuery.data?.artist.images[0]?.url,
                    width: SCREEN_WIDTH - 15,
                    height: SCREEN_HEIGHT / 2,
                  }}
                  style={styles.aboutImage}>
                  <LinearGradient
                    colors={['rgba(10, 10, 10, 0.1)', 'rgba(10, 10, 10, 1)']}
                    style={styles.aboutImage}>
                    <View style={[styles.row, styles.verifiedTextContainer]}>
                      <MaterialIcons
                        name="verified"
                        color="#458eff"
                        size={20}
                      />
                      <Text style={styles.verifiedText}>VERIFIED ARTIST</Text>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.artistDescriptionText,
                          styles.artistMonthlyListenerDescriptionContainer,
                        ]}>
                        {`${getAllArtistDataQuery.data?.artist.followers.total} monthly listeners`}
                      </Text>
                      <View style={styles.artistDescriptionContainer}>
                        <Text
                          numberOfLines={3}
                          style={styles.artistDescriptionText}>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged. It was popularised in the 1960s with the
                          release of Letraset sheets containing Lorem Ipsum
                          passages, and more recently with desktop publishing
                          software like Aldus PageMaker including versions of
                          Lorem Ipsum
                        </Text>
                        <EntypoIcons
                          name="chevron-thin-right"
                          size={20}
                          color="white"
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
              <FansAlsoLikeHeader />
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={getAllArtistDataQuery.data?.relatedArtists ?? []}
                renderItem={({item}) => (
                  <ArtistListItem
                    horizontal
                    artist={item}
                    onPressArtist={() =>
                      (navigation as any).push('Artist', {artistId: item.id})
                    }
                  />
                )}
              />
              <FeaturingListHeader />
              <FlatList
                style={styles.pb50}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={
                  getAllArtistDataQuery.data?.albums?.items?.filter(
                    album => album.album_group === 'appears_on',
                  ) ?? []
                }
                renderItem={({item}) => (
                  <AlbumListItem horizontal album={item} />
                )}
              />
            </View>
          </Animated.ScrollView>
        </Animated.View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  artistMonthlyListenerDescriptionContainer: {
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  artistDescriptionContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 35,
  },
  artistDescriptionText: {color: Colors.white, fontSize: 18},
  verifiedTextContainer: {paddingHorizontal: 15, paddingVertical: 15},
  verifiedText: {
    color: Colors.white,
    fontWeight: '700',
    paddingLeft: 5,
  },
  aboutImage: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - 30,
    height: SCREEN_HEIGHT / 2.5,
    justifyContent: 'space-between',
  },
  pb50: {
    paddingBottom: 50,
  },
  flexRowJusCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  numberText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: 20,
  },
  ph15: {paddingHorizontal: 15},
  row: {flexDirection: 'row', alignItems: 'center'},
  pt10: {paddingTop: 10},
  w25: {width: 25},
  w15: {width: 15},
  shuffleAndDotsStyle: {opacity: 0.5},
  rowSpaced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followingButtonContainer: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  listFooterButtonContainer: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  followingButtonText: {
    color: Colors.white,
  },
  monthlyListenersText: {color: Colors.white, opacity: 0.5},
  restOfContentTopInfo: {paddingHorizontal: 15},
  flex1: {flex: 1},
  listHeaderContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2,
    justifyContent: 'flex-end',
    padding: 20,
  },
  restOfContentContainer: {
    shadowOffset: {height: 10, width: 1},
    shadowOpacity: 0.4,
    elevation: 4,
    shadowRadius: 100,
    backgroundColor: Colors.black,
  },
  artistNameText: {
    fontSize: 52,
    color: Colors.white,
    fontWeight: 'bold',
  },
  listHeaderText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  screen: {flex: 1, backgroundColor: Colors.black},
  backgroundImageStyle: {position: 'absolute', top: 0, left: 0, right: 0},
  platlistNameAndBackButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 120,
    paddingHorizontal: 15,
    width: '100%',
  },
  pb10: {paddingBottom: 20},
});

export default Artist;
