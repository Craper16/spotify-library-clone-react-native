import {TouchableOpacity} from '@gorhom/bottom-sheet';
import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../Constants/colors';

type TrackOptionsBottomSheetBottomItemProps = {
  iconName: string;
  text: string;
};

const TrackOptionsBottomSheetBottomItem = ({
  iconName,
  text,
}: TrackOptionsBottomSheetBottomItemProps) => {
  return (
    <TouchableOpacity style={styles.container}>
      <IonIcons name={iconName} size={27} color="white" />
      <View style={styles.spacer} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {color: Colors.white, fontSize: 18},
  spacer: {width: 10},
});

export default React.memo(TrackOptionsBottomSheetBottomItem);
