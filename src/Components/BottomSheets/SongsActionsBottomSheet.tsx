import {Image, Pressable, Text, View} from 'react-native';
import React, {forwardRef} from 'react';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {StyleSheet} from 'react-native';
import {
  BottomSheetMainBackground,
  HandleComponent,
} from '../Navigation/BottomTabBar';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AnimatedBlur} from '../Songs/SongListTileItem';
import {Track} from '../Types/songTypes';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import FeatherIcons from 'react-native-vector-icons/Feather';
import TrackOptionsBottomSheetBottomItem from '../Utils/TrackOptionsBottomSheetBottomItem';
import {Colors} from '../../Constants/colors';

export const AnimatedBottomSheetView =
  Animated.createAnimatedComponent(BottomSheetView);

type SongsActionsBottomSheetProps = {
  onClosePress?: () => void;
  song?: Track;
};

const SongsActionsBottomSheet = forwardRef<
  BottomSheetModal,
  SongsActionsBottomSheetProps
>(({onClosePress, song}, ref) => {
  const safeAreaInsets = useSafeAreaInsets();
  const blurOpacity = useSharedValue(SCREEN_HEIGHT);

  const blurAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        blurOpacity.value ?? 0,
        [0, SCREEN_HEIGHT / 2, SCREEN_HEIGHT],
        [1, 1, 0],
      ),
    };
  });

  const mainViewAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        blurOpacity.value ?? 0,
        [0, SCREEN_HEIGHT / 2, SCREEN_HEIGHT],
        [1, 0.5, 0],
      ),
    };
  });

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['100%']}
      enableDismissOnClose
      enableOverDrag={false}
      handleComponent={HandleComponent}
      animatedPosition={blurOpacity}
      backgroundComponent={BottomSheetMainBackground}>
      <AnimatedBottomSheetView
        style={[
          mainViewAnimatedStyle,
          styles.mainContainer,
          {
            paddingVertical: safeAreaInsets.top + 90,
          },
        ]}>
        <AnimatedBlur
          style={[blurAnimatedStyle, styles.animatedBlurStyle]}
          blurType="dark"
          blurAmount={20}
        />
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <BottomSheetView style={styles.imageAndArtistTitleContainer}>
            <Image
              source={{
                uri: song?.album?.images[0]?.url,
                height: 160,
                width: 160,
              }}
            />
            <Text style={styles.songTitle}>{song?.name}</Text>
            <BottomSheetView style={styles.songArtistAndNameContainer}>
              <Text style={styles.songArtistAndNameText}>
                {song?.artists[0]?.name}
              </Text>
              <EntypoIcons
                name="dot-single"
                style={styles.halfOpacity}
                color="white"
                size={18}
              />
              <Text style={styles.songArtistAndNameText}>
                {song?.album?.name}
              </Text>
            </BottomSheetView>
            <BottomSheetView style={styles.topOptionsContainer}>
              <Pressable style={styles.topOptionsItemContainer}>
                <EntypoIcons name="shuffle" size={30} color="white" />
                <Text style={styles.topOptionsText}>Shuffle</Text>
              </Pressable>
              <Pressable style={styles.topOptionsItemContainer}>
                <FeatherIcons name="repeat" size={30} color="white" />
                <Text style={styles.topOptionsText}>Repeat</Text>
              </Pressable>
              <Pressable style={styles.topOptionsItemContainer}>
                <EntypoIcons name="menu" size={30} color="white" />
                <Text style={styles.topOptionsText}>Queue</Text>
              </Pressable>
            </BottomSheetView>
          </BottomSheetView>
          <BottomSheetView style={styles.bottomOptionsContainer}>
            <TrackOptionsBottomSheetBottomItem
              iconName="add-circle-outline"
              text="Add to playlist"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="remove-circle-outline"
              text="Remove from this playlist"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="albums-outline"
              text="Add to queue"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="share-outline"
              text="Share"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="radio"
              text="Go to radio"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="enter-outline"
              text="View album"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="person-outline"
              text="View artist"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="person-add-outline"
              text="Song credits"
            />
            <TrackOptionsBottomSheetBottomItem
              iconName="timer-outline"
              text="Sleep timer"
            />
          </BottomSheetView>
          <View style={styles.emptyBottomView} />
        </BottomSheetScrollView>
        <BottomSheetView
          style={[
            styles.bottomButtonContainer,
            {
              paddingBottom: safeAreaInsets.bottom + 20,
            },
          ]}>
          <TouchableOpacity onPress={onClosePress}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </AnimatedBottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomOptionsContainer: {paddingTop: 40},
  topOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    paddingTop: 40,
  },
  emptyBottomView: {height: 80},
  topOptionsItemContainer: {alignItems: 'center', justifyContent: 'center'},
  topOptionsText: {color: Colors.white, fontSize: 12, paddingTop: 5},
  songTitle: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 10,
  },
  songArtistAndNameText: {color: Colors.white, opacity: 0.5},
  songArtistAndNameContainer: {flexDirection: 'row'},
  halfOpacity: {opacity: 0.5},
  imageAndArtistTitleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 200,
  },
  animatedBlurStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  mainContainer: {flex: 1, paddingHorizontal: 20},
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {paddingLeft: 15, top: 10, alignItems: 'flex-start'},
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
    height: 70,
  },
  row: {flexDirection: 'row'},
  titleStyle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subTitleStyle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.5,
  },
  closeText: {fontWeight: '700', color: Colors.white, fontSize: 16},
  top20: {top: 20},
});

export default React.memo(SongsActionsBottomSheet);
