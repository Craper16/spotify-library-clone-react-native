import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../Constants/colors';

export const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

type PlayButtonProps = {
  onPress?: () => void;
  animatedPosition: SharedValue<number>;
};

const PlayButton = ({onPress}: PlayButtonProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      // transform: [
      //   {
      //     translateY: interpolate(
      //       animatedPosition.value,
      //       [0, 513, Number.MAX_VALUE],
      //       [0, 0, Number.MAX_VALUE],
      //     ),
      //   },
      // ],
    };
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.9}
      style={[animatedStyles, styles.buttonContainer]}
      onPress={onPress}>
      <MaterialIcons name="play" color="black" size={35} />
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    width: 50,
    backgroundColor: Colors.green,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
});

export default React.memo(PlayButton);
