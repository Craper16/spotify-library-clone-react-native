import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Artist} from '../../Components/Types/artistTypes';

interface IGetArtistData {
  artistId: string;
}

export async function getArtistData({artistId}: IGetArtistData) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: Artist = response.data;

  return data;
}
