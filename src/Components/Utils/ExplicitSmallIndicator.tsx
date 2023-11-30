import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../../Constants/colors';

const ExplicitSmallIndicator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.eText}>E</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 15,
    width: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    opacity: 0.5,
    borderRadius: 3,
  },
  eText: {fontSize: 12, color: 'black', fontWeight: 'bold'},
});

export default React.memo(ExplicitSmallIndicator);
