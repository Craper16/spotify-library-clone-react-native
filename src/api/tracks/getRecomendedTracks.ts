import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Track} from '../../Components/Types/songTypes';

interface GetRecomendedTracksResponse {
  tracks: Track[];
  seeds: {
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string;
    id: string;
    initialPoolSize: number;
    type: string;
  };
}

interface IGetRecomendedTracksData {
  limit: number;
  seedArtists?: string;
  seedTracks?: string;
  seedGenres?: string;
}

export async function getRecomendedTracks({
  limit,
  seedArtists,
  seedGenres,
  seedTracks,
}: IGetRecomendedTracksData) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/recommendations`, {
    params: {
      limit,
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      seed_tracks: seedTracks,
    },
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: GetRecomendedTracksResponse = response.data;

  return data;
}
