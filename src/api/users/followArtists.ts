import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';

interface IFollowArtistData {
  type: 'artist' | 'user';
  ids: string;
}

export async function followArists(followArtistData: IFollowArtistData) {
  const tokens = await retrieveTokens();

  const response = await instance.put(
    `${API_KEY}/me/following?type=${followArtistData.type}&ids=${followArtistData.ids}`,
    {},
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
