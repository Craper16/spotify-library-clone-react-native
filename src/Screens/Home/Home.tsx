import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  Button,
} from 'react-native';
import React, {useMemo} from 'react';
import OctIcons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HorizontalListItem from '../../Components/Utils/HorizontalListItem';
import {Colors} from '../../Constants/colors';
import {clearKeychainData} from '../../Storage/Keychain/clearKeychainData';
import {deleteItemFromAsyncStorage} from '../../Storage/Async Storage/deleteItemFromAsyncStorage';
import {Storage} from '../../Constants/storage';
import {queryClient} from '../../../App';

const Home = () => {
  const safeAreaInsets = useSafeAreaInsets();

  const scrollviewMarginTop = useMemo(
    () => ({
      marginTop: safeAreaInsets.top > 0 ? 25 : 15,
    }),
    [safeAreaInsets.top],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={scrollviewMarginTop} stickyHeaderIndices={[1]}>
        <View style={[styles.rowSpaced]}>
          <Text style={styles.topRowText}>Good Afternoon</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.rowItemSpaced}>
              <OctIcons name="bell" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="av-timer" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowItemSpacedLeft}>
              <Feather name="settings" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainContainerContainer}>
          <View style={styles.row}>
            <HorizontalListItem title="Music" />
            <View style={styles.smallWidthSeperator} />
            <HorizontalListItem title="Podcasts & Shows" />
          </View>
        </View>
        <Button
          title="Logout"
          onPress={async () => {
            await deleteItemFromAsyncStorage(Storage.user);
            await clearKeychainData();

            queryClient.invalidateQueries({queryKey: ['auth']});
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: Colors.black},
  rowSpaced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  topRowText: {color: Colors.white, fontSize: 22, fontWeight: 'bold'},
  row: {flexDirection: 'row'},
  rowItemSpaced: {paddingHorizontal: 15},
  rowItemSpacedLeft: {paddingLeft: 15},
  secondTopItemsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: '#1f1f1f',
    borderRadius: 100,
    width: 'auto',
  },
  secondTopItemsText: {color: Colors.white},
  mainContainerContainer: {width: '90%', alignSelf: 'center', paddingTop: 15},
  smallWidthSeperator: {width: 10},
  topPadding: {paddingTop: 15},
});

export default Home;
