import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
} from 'react-native';
import React, {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LibraryStackParams} from '../../Navigation/Library/LibraryStack';
import {SearchStackParams} from '../../Navigation/Search/SearchStackNavigation';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getUserDetails} from '../../api/users/getUserDetails';
import {Colors} from '../../Constants/colors';
import {useScreenInitialization} from '../../Utils/Hooks/useScreenInitialization';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {AnimatedLinearGradient} from '../../Components/Navigation/BottomTabBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {useSession} from '../../Utils/Hooks/auth/useSession';
import PlaylistListItem from '../../Components/Library/PlaylistListItem';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {followArists} from '../../api/users/followArtists';
import {unfollowArtists} from '../../api/users/unfollowArtists';

type UserDetailsParams =
  | NativeStackScreenProps<LibraryStackParams, 'UserDetails'>
  | NativeStackScreenProps<SearchStackParams, 'UserDetails'>;

const UserDetails = ({navigation, route}: UserDetailsParams) => {
  const userId = route?.params?.userId!;

  const queryClient = useQueryClient();

  const safeAreaInsets = useSafeAreaInsets();

  const {isContentReady, setIsContentReady, mainContentAnimatedStyles} =
    useScreenInitialization({manuallyAssign: true});

  const {user} = useSession();

  const scrollContentOffsetY = useSharedValue(0);

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const getUserDetailsQuery = useQuery({
    queryKey: [userId],
    queryFn: async () => {
      const response = await getUserDetails({userId});

      setTimeout(() => setIsContentReady(true), 200);

      return response;
    },
  });

  const followUserMutation = useMutation({
    mutationFn: followArists,
    onMutate: async () => {
      await queryClient.cancelQueries([userId]);

      const previousGetUserData: typeof getUserDetailsQuery.data =
        queryClient.getQueryData([userId]);

      queryClient.setQueryData([userId], {
        ...previousGetUserData,
        isFollowing: true,
      });

      return {previousGetUserData};
    },
    onError: (_, __, context) =>
      queryClient.setQueryData([userId], context?.previousGetUserData),
    onSettled: () => queryClient.invalidateQueries([userId]),
  });

  const unFollowUserMutation = useMutation({
    mutationFn: unfollowArtists,
    onMutate: async () => {
      await queryClient.cancelQueries([userId]);

      const previousGetUserData: typeof getUserDetailsQuery.data =
        queryClient.getQueryData([userId]);

      queryClient.setQueryData([userId], {
        ...previousGetUserData,
        isFollowing: false,
      });

      return {previousGetUserData};
    },
    onError: (_, __, context) =>
      queryClient.setQueryData([userId], context?.previousGetUserData),
    onSettled: () => queryClient.invalidateQueries([userId]),
  });

  const handleOnScroll = useAnimatedScrollHandler(({contentOffset}) => {
    scrollContentOffsetY.value = contentOffset.y;
  });

  const mainHeaderAnimatedStyles = useAnimatedStyle(() => {
    'worklet';

    return {
      opacity: interpolate(scrollContentOffsetY.value, [70, 100], [0, 1], {
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
      opacity: interpolate(scrollContentOffsetY.value, [70, 100], [0, 1], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      transform: [
        {
          translateY: interpolate(
            scrollContentOffsetY.value,
            [70, 100],
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

  const imageAndUsernameAndFollowersContainerAnimatedStyles = useAnimatedStyle(
    () => {
      return {
        opacity: interpolate(scrollContentOffsetY.value, [0, 70], [1, 0], {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        }),
        transform: [
          {
            translateY: interpolate(
              scrollContentOffsetY.value,
              [-200, 0, 70],
              [10, 0, -10],
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              },
            ),
          },
        ],
      };
    },
  );
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

  const FlatlistHeader = useCallback(
    () => <Text style={styles.playlistsText}>Playlists</Text>,
    [],
  );

  return (
    <View style={styles.screen}>
      {isContentReady && (
        <Animated.View style={[mainContentAnimatedStyles, styles.screen]}>
          <AnimatedLinearGradient
            colors={['rgba(40, 40, 40, 1)', 'rgba(25, 25, 25, 1)']}
            style={mainHeaderAnimatedStyles}
          />
          <Animated.View
            style={[
              styles.platlistNameAndBackButton,
              {paddingTop: safeAreaInsets.top + 15},
            ]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <EntypoIcons name="chevron-thin-left" size={20} color="white" />
            </TouchableOpacity>
            <Animated.Text numberOfLines={1} style={headerAnimatedTextStyle}>
              {getUserDetailsQuery.data?.user?.display_name}
            </Animated.Text>
            <View />
          </Animated.View>
          <AnimatedLinearGradient
            colors={[Colors.lightBlack, Colors.black]}
            style={backgroundLinearGradientAnimatedStyles}
          />
          <Animated.ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            contentContainerStyle={{
              paddingTop: safeAreaInsets.top + 60,
              paddingBottom: safeAreaInsets.bottom + 200,
            }}>
            <Animated.View
              style={[
                styles.usernameImageAndFollowersDetailsContainer,
                imageAndUsernameAndFollowersContainerAnimatedStyles,
              ]}>
              <Image
                source={{
                  height: 90,
                  uri: getUserDetailsQuery.data?.user?.images[0]?.url,
                  width: 90,
                }}
                borderRadius={100}
              />
              <View style={styles.usernameAndFollowersContainer}>
                <Text style={styles.username}>
                  {getUserDetailsQuery?.data?.user?.display_name}
                </Text>
                <Text style={styles.followersText}>
                  <Text style={styles.followersTotalText}>
                    {getUserDetailsQuery?.data?.user?.followers?.total + ' '}
                  </Text>
                  followers
                </Text>
              </View>
            </Animated.View>
            <View style={[styles.row, styles.userOptionsContainer]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.editButtonContainer}
                onPress={() => {
                  if (userId === user?.id) {
                    return;
                  }

                  if (getUserDetailsQuery.data?.isFollowing) {
                    return unFollowUserMutation.mutate({
                      ids: userId,
                      type: 'user',
                    });
                  }

                  return followUserMutation.mutate({ids: userId, type: 'user'});
                }}>
                <Text style={styles.followersTotalText}>
                  {userId === user?.id
                    ? 'Edit'
                    : getUserDetailsQuery?.data?.isFollowing
                    ? 'Unfollow'
                    : 'Follow'}
                </Text>
              </TouchableOpacity>
              <View style={styles.w25} />
              <TouchableOpacity>
                <EntypoIcons
                  name="share-alternative"
                  color={Colors.gray}
                  size={20}
                />
              </TouchableOpacity>
              <View style={styles.w25} />
              <TouchableOpacity>
                <EntypoIcons
                  name="dots-three-horizontal"
                  color={Colors.gray}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={getUserDetailsQuery.data?.playlists?.items ?? []}
              scrollEnabled={false}
              ListHeaderComponent={FlatlistHeader}
              renderItem={({item}) => (
                <PlaylistListItem
                  playlist={item}
                  onPressPlaylist={() =>
                    (navigation as any).push('Playlist', {
                      playlistId: item.id,
                    })
                  }
                />
              )}
            />
          </Animated.ScrollView>
        </Animated.View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  editButtonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 25,
  },
  playlistsText: {
    fontSize: 18,
    color: Colors.white,
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  userOptionsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  screen: {flex: 1, backgroundColor: Colors.black},
  usernameAndFollowersContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  followersTotalText: {color: Colors.white, fontWeight: '600'},
  followersText: {color: Colors.gray},
  username: {fontSize: 22, color: Colors.white, fontWeight: 'bold'},
  usernameImageAndFollowersDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  w25: {width: 25},
  row: {flexDirection: 'row', alignItems: 'center'},
  platlistNameAndBackButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 120,
    paddingHorizontal: 15,
    width: '100%',
  },
});

export default UserDetails;
