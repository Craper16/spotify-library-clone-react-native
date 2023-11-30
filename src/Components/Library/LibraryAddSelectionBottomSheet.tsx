import {StyleSheet, Text, View} from 'react-native';
import React, {forwardRef} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {Colors} from '../../Constants/colors';
import BottomSheetAppBackdrop from '../BottomSheets/BottomSheetAppBackdrop';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type LibraryAddSelectionBottomSheetProps = {
  onAddPlaylistPress?: () => void;
  onBlendPlaylistPress?: () => void;
};

const LibraryAddSelectionBottomSheet = forwardRef<
  BottomSheetModal,
  LibraryAddSelectionBottomSheetProps
>(({onAddPlaylistPress, onBlendPlaylistPress}, ref) => {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <BottomSheetModal
      index={0}
      ref={ref}
      enableDynamicSizing
      maxDynamicContentSize={safeAreaInsets.bottom + 150}
      enableOverDrag={false}
      enableDismissOnClose
      handleIndicatorStyle={styles.indicatorStyle}
      backdropComponent={BottomSheetAppBackdrop}
      backgroundStyle={{backgroundColor: Colors.lightBlack}}>
      <BottomSheetView style={styles.mainContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.itemContainer}
          onPress={onAddPlaylistPress}>
          <FeatherIcons
            name="music"
            size={30}
            color={Colors.white}
            style={styles.opacityHalf}
          />
          <View style={styles.w15} />
          <BottomSheetView>
            <Text style={styles.itemTitle}>Playlist</Text>
            <Text style={styles.itemDescription}>
              Build a playlist with songs, or episodes
            </Text>
          </BottomSheetView>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemContainer}
          activeOpacity={0.8}
          onPress={onBlendPlaylistPress}>
          <FontAwesomeIcons
            name="group"
            size={30}
            color={Colors.white}
            style={styles.opacityHalf}
          />
          <View style={styles.w15} />
          <BottomSheetView>
            <Text style={styles.itemTitle}>Blend</Text>
            <Text style={styles.itemDescription}>
              Combined tastes in a shared playlist with friends
            </Text>
          </BottomSheetView>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  indicatorStyle: {backgroundColor: 'white', opacity: 0.2, width: 45},
  opacityHalf: {opacity: 0.5},
  mainContainer: {paddingHorizontal: 15, flex: 1},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    top: -2,
  },
  itemDescription: {
    color: Colors.white,
    opacity: 0.5,
    fontSize: 12,
    fontWeight: '600',
  },
  w15: {width: 15},
});

export default LibraryAddSelectionBottomSheet;
