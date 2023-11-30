import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Playlist} from '../../Components/Types/libraryTypes';

interface ICreatePlaylistData {
  userId: string;
  name: string;
  description?: string;
  public?: boolean;
}

export async function createPlaylist(createPlaylistData?: ICreatePlaylistData) {
  const tokens = await retrieveTokens();

  const response = await instance.post(
    `${API_KEY}/users/${createPlaylistData?.userId}/playlists`,
    {
      name: createPlaylistData?.name,
      description: createPlaylistData?.description,
      public: createPlaylistData?.public,
    },
    {
      headers: {
        Authorization: `Bearer ${tokens?.tokens.accessToken}`,
      },
    },
  );

  queryClient.invalidateQueries(['auth']);
  queryClient.invalidateQueries(['playlists']);

  const data: Playlist = response.data;

  return data;
}
