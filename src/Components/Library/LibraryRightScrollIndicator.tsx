import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EntypoIcons from 'react-native-vector-icons/Entypo';

type LibraryRightScrollIndicatorProps = {
  onScrollList?: (scrollPosition: SharedValue<number>) => void;
  scrollContentOffset: SharedValue<number>;
  scrollTotalHeight: SharedValue<number>;
};

const LibraryRightScrollIndicator = ({
  onScrollList,
  scrollContentOffset,
  scrollTotalHeight,
}: LibraryRightScrollIndicatorProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const currentTranslateY = useSharedValue(0);
  const translationY = useSharedValue(0);

  const animatedIndicatorStyles = useAnimatedStyle(() => {
    console.log(scrollTotalHeight.value);
    return {
      height: 45,
      width: 45,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1f1f1f',
      position: 'absolute',
      top: safeAreaInsets.top + 120,
      zIndex: 20,
      borderRadius: 100,
      right: -10,
      opacity: withTiming(scrollContentOffset.value < 30 ? 0 : 1, {
        duration: 300,
      }),
      pointerEvents: scrollContentOffset.value < 30 ? 'none' : 'auto',
      transform: [
        {
          translateY: interpolate(
            scrollContentOffset.value,
            [0, scrollTotalHeight.value],
            [
              0,
              SCREEN_HEIGHT - safeAreaInsets.bottom - safeAreaInsets.top - 300,
            ],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      'worklet';

      translationY.value = event.translationY + currentTranslateY.value;

      if (onScrollList) {
        onScrollList(translationY);
      }
    })
    .onEnd(_ => {
      currentTranslateY.value = translationY.value;
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedIndicatorStyles}>
        <EntypoIcons name="select-arrows" color="white" size={20} />
      </Animated.View>
    </GestureDetector>
  );
};

export default React.memo(LibraryRightScrollIndicator);
