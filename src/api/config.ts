import {
  API_KEY,
  REDIRECT_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from '@env';
import axios from 'axios';
import {retrieveTokens} from '../Helpers/auth';
import dayjs from 'dayjs';
import {refresh} from 'react-native-app-auth';
import {setKeychainData} from '../Storage/Keychain/setKeychainData';
import {formatDateAndTime} from '../Helpers/dateHelpers';
import {queryClient} from '../../App';
import {clearKeychainData} from '../Storage/Keychain/clearKeychainData';

export const instance = axios.create({baseURL: API_KEY});

instance.interceptors.request.use(async req => {
  const tokens = await retrieveTokens();

  const isExpired = dayjs(tokens?.expiryTime).diff(dayjs()) < 1;

  if (!isExpired || !tokens) {
    return req;
  }
  try {
    const refreshResponse = await refresh(
      {
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
      },
      {refreshToken: tokens?.tokens.refreshToken},
    );

    await setKeychainData({
      username: JSON.stringify({
        accessToken: refreshResponse.accessToken,
        refreshToken: refreshResponse.refreshToken,
      }),
      password: formatDateAndTime(
        new Date(refreshResponse.accessTokenExpirationDate),
      ),
    });

    req.headers.Authorization = `Bearer ${refreshResponse.refreshToken}`;
    queryClient.invalidateQueries(['auth']);

    return req;
  } catch (error) {
    await clearKeychainData();
    return req;
  }
});
