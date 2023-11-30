import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {SmallWidthSeperator} from './LibraryMainScreenHeader';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {Colors} from '../../Constants/colors';

type AddArtistListItemProps = {
  vertical?: boolean;
};

export function SmallHeightSeperator() {
  return <View style={styles.smallHeightSeperator} />;
}

const AddArtistListItem = ({vertical}: AddArtistListItemProps) => {
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
      <Text style={styles.addButtonText}>Add artists</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  smallHeightSeperator: {height: 10},
  verticalAddSignContainer: {
    height: SCREEN_WIDTH / 2 - 20,
    width: SCREEN_WIDTH / 2 - 20,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 140,
  },
  verticalContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  container: {paddingVertical: 10, flexDirection: 'row', alignItems: 'center'},
  addSignContainer: {
    height: 70,
    width: 70,
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 140,
  },
  addButtonText: {fontSize: 16, color: Colors.white},
});

export default AddArtistListItem;
