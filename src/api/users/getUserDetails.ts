import {getIfUserFollowsArtist} from '../artists/getIfUserFollowsArtist';
import {getUsersPlaylists} from '../playlists/getUsersPlaylists';
import {getUserProfile} from './getUserProfile';

export async function getUserDetails({userId}: {userId: string}) {
  const user = await getUserProfile({userId});
  const playlists = await getUsersPlaylists({userId, limit: 5});
  const isFollowing = await getIfUserFollowsArtist({
    type: 'user',
    artistId: userId,
  });

  return {user, playlists, isFollowing: isFollowing[0]};
}
