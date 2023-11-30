import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  BottomSheetScrollView,
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TouchableOpacity as BSPressable,
} from '@gorhom/bottom-sheet';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import BottomSheetBackground from '@gorhom/bottom-sheet/src/components/bottomSheetBackground/BottomSheetBackground';
import {BottomSheetBackgroundProps} from '@gorhom/bottom-sheet/src/components/bottomSheetBackground/types';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import {Colors} from '../../Constants/colors';
import {useQuery} from '@tanstack/react-query';
import {getPlaybackState} from '../../api/player/getPlaybackState';

export const AnimatedLinearGradient =
  Animated.createAnimatedComponent(LinearGradient);

export function HandleComponent() {
  return <View />;
}

export function BottomSheetMainBackground(props: BottomSheetBackgroundProps) {
  return <BottomSheetBackground {...props} style={styles.transparent} />;
}

const BottomTabBar = ({navigation}: BottomTabBarProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const [isSongPlaying, setIsSongPlaying] = useState(false);

  const getPlaybackStateQuery = useQuery({
    queryKey: ['playback'],
    queryFn: () => getPlaybackState(),
  });

  const startThreshhold = useMemo(
    () => SCREEN_HEIGHT - safeAreaInsets.bottom - 120,
    [safeAreaInsets.bottom],
  );

  const animatedPosition = useSharedValue(0);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const animatedBottomTabStyle = useAnimatedStyle(() => {
    return {
      paddingTop: 10,
      paddingBottom: safeAreaInsets.bottom + 10,
      bottom:
        safeAreaInsets.bottom !== 0
          ? interpolate(
              animatedPosition.value,
              [startThreshhold, startThreshhold - 600],
              [0, -safeAreaInsets.bottom - 60],
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              },
            )
          : interpolate(
              animatedPosition.value,
              [startThreshhold - 50, startThreshhold - 600],
              [0, -safeAreaInsets.bottom - 60],
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              },
            ),
      position: 'absolute',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      paddingHorizontal: 50,
      zIndex: 15,
    };
  });

  const defaultHeaderAnimatedView = useAnimatedStyle(() => {
    return {
      width: '95%',
      alignSelf: 'center',
      height: 60,
      borderRadius: 8,
      elevation: 4,
      position: 'absolute',
      alignItems: 'center',
      zIndex: 200,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      opacity:
        safeAreaInsets.bottom !== 0
          ? interpolate(
              animatedPosition.value,
              [startThreshhold, startThreshhold - 100],
              [1, 0],
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              },
            )
          : interpolate(
              animatedPosition.value,
              [startThreshhold - 50, startThreshhold - 100],
              [1, 0],
              {
                extrapolateLeft: Extrapolation.CLAMP,
                extrapolateRight: Extrapolation.CLAMP,
              },
            ),
    };
  });

  const mainPlayerContent = useAnimatedStyle(() => {
    return {
      flex: 1,
      backgroundColor: 'blue',
      height: SCREEN_HEIGHT,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      shadowColor: Colors.black,
      opacity:
        safeAreaInsets.bottom !== 0
          ? interpolate(
              animatedPosition.value,
              [startThreshhold, startThreshhold - 100],
              [0, 1],
            )
          : interpolate(
              animatedPosition.value,
              [startThreshhold - 50, startThreshhold - 100],
              [0, 1],
            ),
    };
  });

  const GeneralHeaderTitleTap = Gesture.Tap()
    .onTouchesUp(_ => bottomSheetRef.current?.expand())
    .runOnJS(true);

  const StopOrPlayTap = Gesture.Tap()
    .onEnd(_ => setIsSongPlaying(prevIsSongPlaying => !prevIsSongPlaying))
    .cancelsTouchesInView(true)
    .runOnJS(true);

  return (
    <>
      <AnimatedLinearGradient
        style={animatedBottomTabStyle}
        colors={['rgba(15, 15, 15, 0.9)', 'rgba(15, 15, 15, 1)']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 0.5}}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeStack')}>
          <MaterialIcons name="home" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SearchStack')}>
          <FontistoIcons name="search" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LibraryStack')}>
          <MaterialIcons name="bookshelf" size={35} color="white" />
        </TouchableOpacity>
      </AnimatedLinearGradient>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        handleComponent={HandleComponent}
        enableOverDrag={false}
        animatedPosition={animatedPosition}
        snapPoints={[safeAreaInsets.bottom + 120, '100%']}
        backgroundComponent={BottomSheetMainBackground}>
        <BottomSheetScrollView style={styles.backTransparent}>
          <AnimatedLinearGradient
            style={defaultHeaderAnimatedView}
            colors={['#1f1f1f', 'rgba(25,12,100, 1)']}
            start={{x: 0, y: 0}}
            end={{x: 1.5, y: 1}}>
            <GestureDetector gesture={GeneralHeaderTitleTap}>
              <View style={styles.row}>
                <View style={styles.songImageMini}>
                  <Image
                    source={{
                      uri: getPlaybackStateQuery.data?.item?.album?.images[0]
                        ?.url,
                      height: 40,
                      width: 40,
                    }}
                    borderRadius={4}
                  />
                </View>
                <View style={styles.songTitleAndArtistMini}>
                  <Text style={styles.songTitleMini}>
                    {getPlaybackStateQuery.data?.item?.name}
                  </Text>
                  <Text style={styles.songArtistMini}>
                    {getPlaybackStateQuery.data?.item?.artists[0]?.name}
                  </Text>
                </View>
              </View>
            </GestureDetector>
            <GestureDetector gesture={StopOrPlayTap}>
              <View>
                <MaterialIcons
                  name={isSongPlaying ? 'play' : 'pause'}
                  color="white"
                  size={40}
                />
              </View>
            </GestureDetector>
          </AnimatedLinearGradient>
          <Animated.View style={mainPlayerContent}>
            <LinearGradient colors={['#1f1f1f', 'blue']} angle={180}>
              <BottomSheetView style={{paddingTop: safeAreaInsets.top}}>
                <BottomSheetView style={styles.spacedRow}>
                  <BSPressable
                    onPress={() => bottomSheetRef?.current?.collapse()}>
                    <Text>CLose</Text>
                  </BSPressable>
                  <Text>Liked Songs</Text>
                  <Text>. . . </Text>
                </BottomSheetView>
              </BottomSheetView>
              <Image
                source={{
                  uri: getPlaybackStateQuery.data?.item?.album?.images[0]?.url,
                  width: SCREEN_WIDTH - 50,
                  height: 400,
                }}
                borderRadius={5}
                style={styles.songImage}
              />
              <BottomSheetView>
                <Text style={styles.songTitle}>
                  {getPlaybackStateQuery.data?.item?.name}
                </Text>
                <Text style={styles.songArtist}>
                  {getPlaybackStateQuery.data?.item?.artists?.map(
                    (artist, index) =>
                      index !==
                      getPlaybackStateQuery.data?.item?.artists?.length - 1
                        ? `${artist.name}, `
                        : `${artist.name}`,
                  )}
                </Text>
              </BottomSheetView>
              <BottomSheetView>
                <Slider
                  style={styles.sliderStyle}
                  minimumTrackTintColor="white"
                />
              </BottomSheetView>
            </LinearGradient>
          </Animated.View>
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  mainView: {flex: 1},
  backTransparent: {backgroundColor: 'transparent', borderRadius: 12},
  songImage: {alignSelf: 'center', marginVertical: 75},
  mainFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  sliderStyle: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 25,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insideMusicPlayer: {
    height: 300,
    backgroundColor: 'grey',
    width: '100%',
  },
  songArtist: {
    paddingHorizontal: 25,
    fontSize: 14,
    color: 'grey',
    fontWeight: 'bold',
  },
  songImageMini: {
    height: 40,
    width: 40,
    backgroundColor: 'red',
    borderRadius: 4,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.4,
    elevation: 4,
  },
  songTitle: {
    paddingHorizontal: 25,
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  songTitleAndArtistMini: {paddingLeft: 10},
  songTitleMini: {
    fontSize: 12,
    color: Colors.white,
  },
  songArtistMini: {
    fontSize: 10,
    color: Colors.white,
    opacity: 0.5,
  },
  spacedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  transparent: {backgroundColor: 'transparent'},
});
