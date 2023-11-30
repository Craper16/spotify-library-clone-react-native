import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  DimensionValue,
} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Colors} from '../../Constants/colors';
import {Artist} from '../Types/artistTypes';

export const DEFAULT_SONG_ICON =
  'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2';

type ArtistListItemProps = {
  artist?: Artist;
  onPressArtist?: () => void;
  vertical?: boolean;
  horizontal?: boolean;
  normalPaddingHorizontal?: DimensionValue;
};

const AritstListItem = ({
  artist,
  onPressArtist,
  vertical,
  horizontal,
  normalPaddingHorizontal,
}: ArtistListItemProps) => {
  if (horizontal) {
    return (
      <TouchableOpacity
        style={styles.horizontalContainer}
        onPress={onPressArtist}
        activeOpacity={0.7}>
        <Image
          source={{
            uri: artist?.images[0]?.url ?? DEFAULT_SONG_ICON,
            height: horizontal ? SCREEN_WIDTH / 2 - 50 : 70,
            width: horizontal ? SCREEN_WIDTH / 2 - 50 : 70,
          }}
          borderRadius={140}
        />
        <View style={styles.horizontalBottomInfoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {artist?.name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.bottomInfoBottomText} numberOfLines={1}>
              {artist?.type}
            </Text>
            <EntypoIcons
              name="dot-single"
              style={styles.halfOpacity}
              color="white"
              size={18}
            />
            <Text style={styles.bottomInfoBottomText} numberOfLines={1}>
              {artist?.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  if (vertical) {
    return (
      <TouchableOpacity
        style={styles.verticalContainer}
        onPress={onPressArtist}
        activeOpacity={0.7}>
        <Image
          source={{
            uri: artist?.images[0]?.url ?? DEFAULT_SONG_ICON,
            height: vertical ? SCREEN_WIDTH / 2 - 20 : 70,
            width: vertical ? SCREEN_WIDTH / 2 - 20 : 70,
          }}
          borderRadius={140}
        />
        <View style={styles.verticalBottomInfoContainer}>
          <Text style={styles.nameText}>{artist?.name}</Text>
          <View style={styles.row}>
            <Text style={styles.bottomInfoBottomText}>{artist?.type}</Text>
            <EntypoIcons
              name="dot-single"
              style={styles.halfOpacity}
              color="white"
              size={18}
            />
            <Text style={styles.bottomInfoBottomText}>{artist?.name}</Text>
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
      onPress={onPressArtist}
      activeOpacity={0.7}>
      <Image
        source={{
          uri: artist?.images[0]?.url ?? DEFAULT_SONG_ICON,
          height: 70,
          width: 70,
        }}
        borderRadius={140}
      />
      <View style={styles.bottomInfoContainer}>
        <Text style={styles.nameText}>{artist?.name}</Text>
        <View style={styles.row}>
          <Text style={styles.bottomInfoBottomText}>{artist?.type}</Text>
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
  },
  horizontalContainer: {
    width: SCREEN_WIDTH / 2 - 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    marginHorizontal: 15,
  },
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

export default React.memo(AritstListItem);
