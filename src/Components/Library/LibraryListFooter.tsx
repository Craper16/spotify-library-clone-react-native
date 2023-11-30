import {StyleProp, View, ViewStyle} from 'react-native';
import React from 'react';
import AddArtistListItem from './AddArtistListItem';
import AddPodcastsAndShowsListItem from './AddPodcastsAndShowsListItem';
type LibraryListFooterProps = {
  vertical?: boolean;
};

const LibraryListFooter = ({vertical}: LibraryListFooterProps) => {
  const mainContainerStyle: StyleProp<ViewStyle> = {
    flexDirection: vertical ? 'row' : 'column',
    paddingHorizontal: vertical ? 0 : 20,
  };

  return (
    <View style={mainContainerStyle}>
      <AddArtistListItem vertical={vertical} />
      <AddPodcastsAndShowsListItem vertical={vertical} />
    </View>
  );
};

export default React.memo(LibraryListFooter);
