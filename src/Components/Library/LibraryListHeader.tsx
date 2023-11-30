import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors} from '../../Constants/colors';

type LibraryListHeaderProps = {
  onRightIconPress?: () => void;
};

const LibraryListHeader = ({onRightIconPress}: LibraryListHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} activeOpacity={0.7}>
        <MaterialIcons
          name="compare-arrows"
          size={20}
          color="white"
          style={styles.arrowsStyle}
        />
        <Text style={styles.textStyle}>Recent</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} onPress={onRightIconPress}>
        <MaterialComIcons
          name="view-dashboard-outline"
          color="white"
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  arrowsStyle: {transform: [{rotate: '90deg'}]},
  textStyle: {color: Colors.white},
});

export default LibraryListHeader;
