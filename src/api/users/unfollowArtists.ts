import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';

interface IUnfollowArtists {
  type: 'artist' | 'user';
  ids: string;
}

export async function unfollowArtists(unfollowArtistsData: IUnfollowArtists) {
  const tokens = await retrieveTokens();

  const response = await instance.delete(
    `${API_KEY}/me/following?type=${unfollowArtistsData.type}&ids=${unfollowArtistsData.ids}`,
    {
      headers: {
        Authorization: `Bearer ${tokens?.tokens.accessToken}`,
      },
    },
  );

  queryClient.invalidateQueries(['auth']);
  queryClient.invalidateQueries(['artists']);

  const data: {} = response.data;

  return data;
}
