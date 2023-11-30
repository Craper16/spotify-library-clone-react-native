import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../Constants/colors';

type HorizontalListItemProps = {
  onPress?: () => void;
  title?: string;
};

const HorizontalListItem = ({onPress, title}: HorizontalListItemProps) => {
  return (
    <TouchableOpacity style={styles.secondTopItemsContainer} onPress={onPress}>
      <Text style={styles.secondTopItemsText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  secondTopItemsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: '#1f1f1f',
    borderRadius: 100,
    width: 'auto',
  },
  secondTopItemsText: {color: Colors.white},
});

export default React.memo(HorizontalListItem);
