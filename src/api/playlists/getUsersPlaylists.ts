import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {IGetCurrentUserPlaylistsResponse} from './getCurrentUserPlaylists';

interface IGetCurrentUserPlaylists {
  userId: string;
  limit?: number;
  offset?: number;
}

export async function getUsersPlaylists({
  userId,
  limit,
  offset,
}: IGetCurrentUserPlaylists) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/users/${userId}/playlists`, {
    params: {
      limit: limit ?? 10,
      offset: offset ?? 0,
    },
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: IGetCurrentUserPlaylistsResponse = response.data;

  return data;
}
