import {queryClient} from '../../../App';
import {getArtistData} from './getArtistData';
import {getArtistTopTracks} from './getArtistTopTracks';
import {GetArtistAlbumsResponse, getArtistAlbums} from './getArtistAlbums';
import {getArtistRelatedArtists} from './getArtistRelatedArtists';
import {getIfUserFollowsArtist} from './getIfUserFollowsArtist';
import {Artist} from '../../Components/Types/artistTypes';
import {Track} from '../../Components/Types/songTypes';

interface IGetAllArtistData {
  artistId: string;
  includeGroups?: string;
  type?: 'artist' | 'user';
}

export interface IAllArtistDataResponse {
  artist: Artist;
  topTracks: Track[];
  albums: GetArtistAlbumsResponse;
  relatedArtists: Artist[];
  isFollowing: boolean;
}

export async function getAllArtistData({
  artistId,
  includeGroups,
  type,
}: IGetAllArtistData) {
  const artist = await getArtistData({artistId});
  const topTracks = await getArtistTopTracks({artistId});
  const albums = await getArtistAlbums({artistId, includeGroups});
  const relatedArtists = await getArtistRelatedArtists({artistId});
  const isFollowing = await getIfUserFollowsArtist({artistId, type});

  queryClient.invalidateQueries(['auth']);

  const response: IAllArtistDataResponse = {
    artist,
    topTracks,
    albums,
    relatedArtists,
    isFollowing: isFollowing[0],
  };

  return response;
}
