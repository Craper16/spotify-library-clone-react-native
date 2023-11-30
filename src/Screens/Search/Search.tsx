import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OctIcons from 'react-native-vector-icons/Octicons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import SearchContent from '../../Components/Search/SearchContent';
import {Colors} from '../../Constants/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParams} from '../../Navigation/Search/SearchStackNavigation';

export const data = [
  'Podcasts',
  'Live events near you',
  'Made for you',
  'New Releases',
  'Ramadan',
  'Podcasts',
  'Live events near you',
  'Made for you',
  'New Releases',
  'Ramadan',
  'Podcasts',
  'Live events near you',
  'Made for you',
  'New Releases',
  'Ramadan',
  'Podcasts',
  'Live events near you',
  'Made for you',
  'New Releases',
  'Ramadan',
  'Podcasts',
  'Live events near you',
  'Made for you',
  'New Releases',
  'Ramadan',
];

function BrowseAllText() {
  return <Text style={styles.browseAllText}>Browse All</Text>;
}

type SearchProps = NativeStackScreenProps<SearchStackParams, 'Search'>;

const Search = ({navigation}: SearchProps) => {
  const safeAreaInsets = useSafeAreaInsets();

  const [isSearching, setIsSearching] = useState(false);

  const topSearchTranslateY = useSharedValue(0);

  const topSearchAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      paddingTop: safeAreaInsets.top + 20,
      zIndex: 1,
      backgroundColor: Colors.black,
      transform: [
        {
          translateY: interpolate(
            topSearchTranslateY.value,
            [0, 50],
            [0, -50],
            {
              extrapolateLeft: Extrapolation.CLAMP,
              extrapolateRight: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

  const handleOnScrollSearch = useAnimatedScrollHandler(({contentOffset}) => {
    topSearchTranslateY.value = contentOffset.y;
  });

  const searchBarTextInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.statusBar,
          {
            height: safeAreaInsets.top,
          },
        ]}
      />
      <Animated.View style={[styles.centeredFull, topSearchAnimatedStyle]}>
        <View style={styles.topHeaderContainer}>
          <Text style={styles.searchText}>Search</Text>
          <MaterialIcons name="camera-outline" color="white" size={30} />
        </View>
        <Pressable
          onPress={() => {
            setIsSearching(true);
            searchBarTextInputRef.current?.focus();
          }}
          style={[styles.topHeaderContainer, styles.searchContainerStyle]}>
          <View style={styles.row}>
            <OctIcons name="search" size={30} />
            <Text style={styles.searchPlaceholder}>
              What do you want to listen to?
            </Text>
          </View>
        </Pressable>
      </Animated.View>
      <Animated.FlatList
        scrollIndicatorInsets={{bottom: 120, top: safeAreaInsets.top + 60}}
        contentContainerStyle={[
          styles.contentStyle,
          {
            paddingBottom: safeAreaInsets.bottom + 120,
            paddingTop: safeAreaInsets.top + 120,
          },
        ]}
        data={data}
        numColumns={2}
        onScroll={handleOnScrollSearch}
        ListHeaderComponent={BrowseAllText}
        renderItem={() => (
          <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.itemContentContainer}>
              <View />
            </View>
          </TouchableOpacity>
        )}
      />
      <SearchContent
        ref={searchBarTextInputRef}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: Colors.black},
  searchText: {color: Colors.white, fontSize: 22, fontWeight: 'bold'},
  blurViewStyle: {width: '100%'},
  browseAllText: {
    color: Colors.white,
    fontSize: 16,
    width: '95%',
    alignSelf: 'center',
    fontWeight: '700',
    paddingVertical: 5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  centeredFull: {width: '100%', alignSelf: 'center'},
  topHeaderContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {width: '50%', padding: 10},
  itemContentContainer: {backgroundColor: '#fff', height: 120, borderRadius: 4},
  searchContainerStyle: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  searchPlaceholder: {color: Colors.black, paddingLeft: 10, fontSize: 16},
  statusBar: {
    backgroundColor: Colors.black,
    zIndex: 2,
    position: 'absolute',
    width: '100%',
  },
  contentStyle: {
    width: '94%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});

export default Search;
