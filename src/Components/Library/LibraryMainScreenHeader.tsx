import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IonIcons from 'react-native-vector-icons/Ionicons';
import HorizontalListItem from '../Utils/HorizontalListItem';
import {Colors} from '../../Constants/colors';
import {useSession} from '../../Utils/Hooks/auth/useSession';

export const DUMMY_FILTERS = [
  {title: 'Playlists', id: '112asdasdwasdasd'},
  {title: 'Podcasts & Shows', id: 'asda2sdasa233'},
  {title: 'Albums', id: 'asdasd123123wd'},
  {title: 'Artists', id: 'sadasd123sdasd'},
  {title: 'Downloaded', id: '1255123fdfasds'},
];

export function SmallWidthSeperator() {
  return <View style={styles.smallWidthSeperator} />;
}

type LibraryMainScreenHeaderProps = {
  onPressFilter?: (filter: {id: string; title: string}) => void;
  onAddPress?: () => void;
  onSearchPress?: () => void;
};

const LibraryMainScreenHeader = ({
  onPressFilter,
  onAddPress,
  onSearchPress,
}: LibraryMainScreenHeaderProps) => {
  const {user} = useSession();

  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, {paddingTop: safeAreaInsets.top + 25}]}>
      <View style={styles.topInfoContainer}>
        <View style={styles.row}>
          <TouchableOpacity>
            <Image
              source={{
                uri:
                  user?.images[0]?.url ??
                  'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX25634104.jpg',
                height: 30,
                width: 30,
              }}
              borderRadius={100}
            />
          </TouchableOpacity>
          <View style={styles.widthSeperator} />
          <Text style={styles.titleText}>Your Library</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={onSearchPress}>
            <IonIcons name="search" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.widthSeperator} />
          <TouchableOpacity onPress={onAddPress}>
            <IonIcons name="add" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        horizontal
        data={DUMMY_FILTERS}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentStyle}
        ItemSeparatorComponent={SmallWidthSeperator}
        renderItem={({item}) => (
          <HorizontalListItem
            title={item?.title}
            onPress={() => {
              if (onPressFilter) {
                onPressFilter(item);
              }
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContentStyle: {paddingTop: 20, paddingBottom: 5, paddingHorizontal: 15},
  mainContainer: {
    width: '100%',
    backgroundColor: Colors.black,
    shadowOffset: {height: 1, width: 1},
    shadowOpacity: 10,
    shadowRadius: 10,
    paddingBottom: 5,
  },
  smallWidthSeperator: {width: 10},
  topInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  widthSeperator: {width: 15},
  titleText: {color: Colors.white, fontWeight: 'bold', fontSize: 22},
});

export default LibraryMainScreenHeader;
