import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Artist} from '../../Components/Types/artistTypes';

interface IGetArtistRelatedArtists {
  artistId: string;
}

export async function getArtistRelatedArtists({
  artistId,
}: IGetArtistRelatedArtists) {
  const tokens = await retrieveTokens();

  const response = await instance.get(
    `${API_KEY}/artists/${artistId}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${tokens?.tokens.accessToken}`,
      },
    },
  );

  queryClient.invalidateQueries(['auth']);

  const data: Artist[] = response.data.artists;

  return data;
}
