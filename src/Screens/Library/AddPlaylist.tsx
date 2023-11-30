import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../Constants/colors';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LibraryStackParams} from '../../Navigation/Library/LibraryStack';
import {useMutation} from '@tanstack/react-query';
import {createPlaylist} from '../../api/playlists/createPlaylist';
import {useSession} from '../../Utils/Hooks/auth/useSession';

type AddPlaylistProps = NativeStackScreenProps<
  LibraryStackParams,
  'AddPlaylist'
>;

const AddPlaylist = ({navigation}: AddPlaylistProps) => {
  const {user} = useSession();

  const playlistName = useRef('');

  const createPlaylistMutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: response => {
      navigation.goBack();

      navigation.navigate('Playlist', {playlistId: response.id});
    },
  });

  return (
    <LinearGradient
      style={styles.screen}
      useAngle
      angle={180}
      angleCenter={{x: 1, y: 0.1}}
      colors={['rgba(10, 10, 10, 0.7)', Colors.lightBlack]}>
      <TouchableOpacity
        style={styles.closeIconStyle}
        onPress={() => navigation.goBack()}>
        <AntDesignIcons name="close" color={Colors.lightBlack} size={30} />
      </TouchableOpacity>
      <Text style={styles.givePlaylistNameText}>Give your playlist a name</Text>
      <TextInput
        style={styles.textInputStyle}
        cursorColor={Colors.green}
        selectionColor={Colors.green}
        onChangeText={text => (playlistName.current = text)}
      />
      <TouchableOpacity
        style={styles.createButton}
        activeOpacity={0.8}
        onPress={() =>
          createPlaylistMutation.mutate({
            userId: user?.id!,
            name: playlistName.current,
          })
        }>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  givePlaylistNameText: {color: Colors.white, fontSize: 20, fontWeight: '600'},
  textInputStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white,
    width: '80%',
    paddingTop: 50,
    fontSize: 32,
    textAlign: 'center',
    color: Colors.white,
  },
  closeIconStyle: {
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    top: 10,
    paddingVertical: 5,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.green,
    borderRadius: 100,
    marginTop: 50,
  },
  createButtonText: {fontSize: 18, fontWeight: '600'},
});

export default AddPlaylist;
