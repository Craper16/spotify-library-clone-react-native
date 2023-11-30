import {StyleSheet} from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../Constants/colors';
import {DEFAULT_SONG_ICON} from '../Library/ArtistListItem';

type PlaylistTopImageProps = {
  animatedPosition: SharedValue<number>;
  imageUrl: string;
};

const PlaylistTopImage = ({
  animatedPosition,
  imageUrl,
}: PlaylistTopImageProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const playlistImageAnimatedStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      top: safeAreaInsets.top + 130,
      opacity: interpolate(animatedPosition.value, [110, 300], [1, 0], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      width: interpolate(
        animatedPosition.value,
        [-200, 0, 110, 300],
        [SCREEN_WIDTH - 40, 290, 290, 200],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
      height: interpolate(
        animatedPosition.value,
        [-200, 0, 110, 300],
        [SCREEN_WIDTH - 40, 290, 290, 200],
        {
          extrapolateLeft: Extrapolation.CLAMP,
          extrapolateRight: Extrapolation.CLAMP,
        },
      ),
      transform: [
        {
          translateY: interpolate(
            animatedPosition.value,
            [-1000, 0, 0, 110],
            [-animatedPosition.value + 120, 0, 0, -110],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={styles.background}>
      <Animated.Image
        source={{
          uri: imageUrl ?? DEFAULT_SONG_ICON,
          height: 290,
          width: 290,
        }}
        style={[playlistImageAnimatedStyle, styles.imageBackground]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowOffset: {height: 1, width: 1},
    elevation: 4,
    shadowOpacity: 12,
    backgroundColor: Colors.lightBlack,
  },
  imageBackground: {
    position: 'absolute',
    alignSelf: 'center',
    height: 290,
    width: 290,
    backgroundColor: 'black',
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
});

export default React.memo(PlaylistTopImage);
