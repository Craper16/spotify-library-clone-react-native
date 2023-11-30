import React from 'react';
import {Text, StyleSheet, Image, TouchableOpacity, View} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Colors} from '../../Constants/colors';
import {formatDateToYearOnly} from '../../Helpers/dateHelpers';
import {Album} from '../../api/artists/getArtistAlbums';

export const DEFAULT_SONG_ICON =
  'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2';

type AlbumListItemProps = {
  album?: Album;
  onAlbumPress?: () => void;
  vertical?: boolean;
  fontSize?: number;
  horizontal?: boolean;
};

const AlbumListItem = ({
  album,
  onAlbumPress,
  vertical,
  fontSize,
  horizontal,
}: AlbumListItemProps) => {
  if (horizontal) {
    return (
      <TouchableOpacity
        style={styles.horizontalContainer}
        onPress={onAlbumPress}
        activeOpacity={0.7}>
        <Image
          source={{
            uri: album?.images[0]?.url ?? DEFAULT_SONG_ICON,
            height: horizontal ? SCREEN_WIDTH / 2 - 50 : 70,
            width: horizontal ? SCREEN_WIDTH / 2 - 50 : 70,
          }}
        />
        <View style={styles.horizontalBottomInfoContainer}>
          <Text style={styles.nameText}>{album?.name}</Text>
          <View style={styles.row}>
            <Text style={styles.bottomInfoBottomText}>
              {formatDateToYearOnly(new Date(album?.release_date!))}
            </Text>
            <EntypoIcons
              name="dot-single"
              style={styles.halfOpacity}
              color="white"
              size={18}
            />
            <Text style={styles.bottomInfoBottomText}>{album?.album_type}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (vertical) {
    return (
      <TouchableOpacity
        style={styles.verticalContainer}
        onPress={onAlbumPress}
        activeOpacity={0.7}>
        <Image
          source={{
            uri: album?.images[0]?.url ?? DEFAULT_SONG_ICON,
            height: vertical ? SCREEN_WIDTH / 2 - 20 : 70,
            width: vertical ? SCREEN_WIDTH / 2 - 20 : 70,
          }}
        />
        <View style={styles.verticalBottomInfoContainer}>
          <Text style={styles.nameText}>{album?.name}</Text>
          <View style={styles.row}>
            <Text style={styles.bottomInfoBottomText}>
              {formatDateToYearOnly(new Date(album?.release_date!))}
            </Text>
            <EntypoIcons
              name="dot-single"
              style={styles.halfOpacity}
              color="white"
              size={18}
            />
            <Text style={styles.bottomInfoBottomText}>{album?.album_type}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onAlbumPress}
      activeOpacity={0.7}>
      <Image
        source={{
          uri: album?.images[0]?.url ?? DEFAULT_SONG_ICON,
          height: 70,
          width: 70,
        }}
      />
      <View style={styles.bottomInfoContainer}>
        <Text style={[styles.nameText, {fontSize: fontSize ?? 16}]}>
          {album?.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.bottomInfoBottomText}>
            {formatDateToYearOnly(new Date(album?.release_date!))}
          </Text>
          <EntypoIcons
            name="dot-single"
            style={styles.halfOpacity}
            color="white"
            size={18}
          />
          <Text style={styles.bottomInfoBottomText}>{album?.album_type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  horizontalBottomInfoContainer: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH / 2 - 50,
  },
  verticalBottomInfoContainer: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalContainer: {
    paddingHorizontal: 15,
  },
  verticalContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  halfOpacity: {opacity: 0.5},
  bottomInfoBottomText: {color: Colors.white, opacity: 0.5, fontSize: 14},
  bottomInfoContainer: {paddingLeft: 15, flex: 1},
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {flexDirection: 'row'},
  nameText: {color: Colors.white, fontWeight: 'bold'},
});

export default React.memo(AlbumListItem);
