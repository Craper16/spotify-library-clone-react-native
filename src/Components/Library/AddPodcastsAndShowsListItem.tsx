import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {SmallWidthSeperator} from './LibraryMainScreenHeader';
import {SmallHeightSeperator} from './AddArtistListItem';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Colors} from '../../Constants/colors';

type AddPodcastsAndShowsListItemProps = {
  vertical?: boolean;
};

const AddPodcastsAndShowsListItem = ({
  vertical,
}: AddPodcastsAndShowsListItemProps) => {
  if (vertical) {
    return (
      <TouchableOpacity style={styles.verticalContainer} activeOpacity={0.7}>
        <View style={styles.verticalAddSignContainer}>
          <IonIcons name="add" color="rgba(255, 255, 255, 0.5)" size={100} />
        </View>
        <SmallHeightSeperator />
        <Text style={styles.addButtonText}>Add artists</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.addSignContainer}>
        <IonIcons name="add" color="rgba(255, 255, 255, 0.5)" size={50} />
      </View>
      <SmallWidthSeperator />
      <Text style={styles.addButtonText}>Add podcasts & shows</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verticalContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  verticalAddSignContainer: {
    height: SCREEN_WIDTH / 2 - 20,
    width: SCREEN_WIDTH / 2 - 20,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  container: {paddingVertical: 10, flexDirection: 'row', alignItems: 'center'},
  addSignContainer: {
    height: 70,
    width: 70,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  addButtonText: {fontSize: 16, color: Colors.white},
});

export default AddPodcastsAndShowsListItem;
