import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  DimensionValue,
} from 'react-native';
import {Playlist} from '../Types/libraryTypes';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Colors} from '../../Constants/colors';

export const DEFAULT_SONG_ICON =
  'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2';

type PlaylistListItemProps = {
  playlist?: Playlist;
  onPressPlaylist?: () => void;
  vertical?: boolean;
  normalPaddingHorizontal?: DimensionValue;
};

const PlaylistListItem = ({
  playlist,
  onPressPlaylist,
  vertical,
  normalPaddingHorizontal,
}: PlaylistListItemProps) => {
  if (vertical) {
    return (
      <TouchableOpacity
        style={styles.verticalContainer}
        onPress={onPressPlaylist}
        activeOpacity={0.7}>
        <Image
          source={{
            uri: playlist?.images[0]?.url ?? DEFAULT_SONG_ICON,
            height: vertical ? SCREEN_WIDTH / 2 - 20 : 70,
            width: vertical ? SCREEN_WIDTH / 2 - 20 : 70,
          }}
        />
        <View style={styles.verticalBottomInfoContainer}>
          <Text style={styles.nameText}>{playlist?.name}</Text>
          <View style={styles.row}>
            <Text style={styles.bottomInfoBottomText}>{playlist?.type}</Text>
            <EntypoIcons
              name="dot-single"
              style={styles.halfOpacity}
              color="white"
              size={18}
            />
            <Text style={styles.bottomInfoBottomText}>
              {playlist?.owner?.display_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {paddingHorizontal: normalPaddingHorizontal ?? 20},
      ]}
      onPress={onPressPlaylist}
      activeOpacity={0.7}>
      <Image
        source={{
          uri: playlist?.images[0]?.url ?? DEFAULT_SONG_ICON,
          height: 70,
          width: 70,
        }}
      />
      <View style={styles.bottomInfoContainer}>
        <Text style={styles.nameText}>{playlist?.name}</Text>
        <View style={styles.row}>
          <Text style={styles.bottomInfoBottomText}>{playlist?.type}</Text>
          <EntypoIcons
            name="dot-single"
            style={styles.halfOpacity}
            color="white"
            size={18}
          />
          <Text style={styles.bottomInfoBottomText}>
            {playlist?.owner?.display_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verticalBottomInfoContainer: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  halfOpacity: {opacity: 0.5},
  bottomInfoBottomText: {color: Colors.white, opacity: 0.5, fontSize: 14},
  bottomInfoContainer: {paddingLeft: 15},
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {flexDirection: 'row'},
  nameText: {color: Colors.white, fontSize: 16},
});

export default React.memo(PlaylistListItem);
