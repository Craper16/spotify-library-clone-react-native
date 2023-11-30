import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Track} from '../../Components/Types/songTypes';

interface IGetArtistTopTracksData {
  artistId: string;
}

export async function getArtistTopTracks({artistId}: IGetArtistTopTracksData) {
  const tokens = await retrieveTokens();

  const response = await instance.get(
    `${API_KEY}/artists/${artistId}/top-tracks?market=LB`,
    {
      headers: {
        Authorization: `Bearer ${tokens?.tokens.accessToken}`,
      },
    },
  );

  queryClient.invalidateQueries(['auth']);

  const data: Track[] = response.data.tracks;

  return data;
}
