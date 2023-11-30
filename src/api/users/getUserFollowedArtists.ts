import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';

export interface GetUserFollowedArtistsResponse {
  artists: ArtistsResponse;
}

export interface ArtistsResponse {
  href: string;
  limit: number;
  next: string;
  cursors: Cursors;
  total: number;
  items: Artist[];
}

export interface Cursors {
  after: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: any;
  total: number;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

interface IGetUserFollowedArtistsData {
  type: 'artist';
  after?: string;
  limit?: number;
}

export async function getUserFollowedArtists(
  getUserFollowedArtistsData: IGetUserFollowedArtistsData,
) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/me/following`, {
    params: {
      type: getUserFollowedArtistsData.type,
      after: getUserFollowedArtistsData.after,
      limit: getUserFollowedArtistsData.limit,
    },
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: GetUserFollowedArtistsResponse = response.data;

  return data;
}
