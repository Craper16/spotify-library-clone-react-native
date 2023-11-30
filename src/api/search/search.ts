import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Tracks} from '../../Components/Types/songTypes';
import {Artists} from '../../Components/Types/artistTypes';
import {PlaylistResponse} from '../../Components/Types/libraryTypes';

interface ISearch {
  q: string;
}

export async function search({q}: ISearch) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/search`, {
    params: {q, type: 'artist,track,playlist'},
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: {tracks: Tracks; artists: Artists; playlists: PlaylistResponse} =
    response.data;

  return data;
}
