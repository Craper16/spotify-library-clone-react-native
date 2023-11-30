import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Colors} from '../../Constants/colors';

type PlaylistTopSearchBarProps = {
  onSearchPress?: () => void;
  onSortPress?: () => void;
  animatedPosition: SharedValue<number>;
};

const PlaylistTopSearchBar = ({
  onSearchPress,
  onSortPress,
  animatedPosition,
}: PlaylistTopSearchBarProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedPosition.value, [12, 60], [1, 0], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
      transform: [
        {
          translateY: interpolate(
            animatedPosition?.value,
            [0, Number.MAX_VALUE],
            [0, -Number.MAX_VALUE],
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
    <Animated.View
      style={[
        animatedStyles,
        styles.topSearchBarContainer,
        {
          paddingTop: safeAreaInsets.top + 50,
        },
      ]}>
      <Pressable style={styles.searchBar} onPress={onSearchPress}>
        <View style={styles.smallWidthSeperator} />
        <FeatherIcons name="search" size={20} color="white" />
        <View style={styles.smallWidthSeperator} />
        <Text style={styles.searchBarText}>Find on this page</Text>
      </Pressable>
      <Pressable style={styles.sortContaine} onPress={onSortPress}>
        <Text style={styles.searchBarText}>Sort</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchBarText: {color: Colors.white, fontWeight: '700'},
  topSearchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    position: 'absolute',
    zIndex: 40,
  },
  smallWidthSeperator: {width: 10},
  sortContaine: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 10,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 4,
  },
  searchBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 35,
    flex: 1,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PlaylistTopSearchBar;
