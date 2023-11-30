import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';

interface IGetIfUserFollowsArtist {
  artistId: string;
  type?: 'artist' | 'user';
}

export async function getIfUserFollowsArtist({
  artistId,
  type,
}: IGetIfUserFollowsArtist) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/me/following/contains`, {
    params: {ids: artistId, type: type ?? 'artist'},
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: boolean[] = response.data;

  return data;
}
