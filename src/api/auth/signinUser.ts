import {
  API_KEY,
  REDIRECT_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from '@env';
import axios from 'axios';
import {authorize} from 'react-native-app-auth';
import {User} from '../../Types/user';

export async function signinUser() {
  const authState = await authorize({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUrl: REDIRECT_URI,
    scopes: [
      'user-read-email',
      'playlist-modify-public',
      'user-read-private',
      'playlist-read-private',
      'user-top-read',
      'playlist-modify-private',
      'user-follow-read',
      'user-follow-modify',
      'user-library-read',
      'user-library-modify',
      'ugc-image-upload',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-library-read',
      'user-read-playback-position',
    ],
    serviceConfiguration: {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    },
  });

  const response = await axios.get(`${API_KEY}/me`, {
    headers: {
      Authorization: `${authState.tokenType} ${authState.accessToken}`,
    },
  });

  const data: User = response.data;

  return {tokens: authState, user: data};
}
