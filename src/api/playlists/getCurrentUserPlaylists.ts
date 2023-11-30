import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Playlist} from '../../Components/Types/libraryTypes';

export interface IGetCurrentUserPlaylistsResponse {
  href: string;
  limit: number;
  items: Playlist[];
  offset: number;
  total: number;
  previous: string | null;
  next: string | null;
}

interface IGetCurrentUserPlaylists {
  limit?: number;
  offset?: number;
}

export async function getCurrentUserPlaylists(
  getCurrentUserPlaylistsData?: IGetCurrentUserPlaylists,
) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/me/playlists`, {
    params: {
      limit: getCurrentUserPlaylistsData?.limit ?? 10,
      offset: getCurrentUserPlaylistsData?.offset ?? 0,
    },
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: IGetCurrentUserPlaylistsResponse = response.data;

  return data;
}
