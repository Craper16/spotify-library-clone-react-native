import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';

export interface GetArtistAlbumsResponse {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: any;
  total: number;
  items: Album[];
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
  album_group: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

interface IGetArtistAlbumsData {
  artistId: string;
  includeGroups?: string;
}

export async function getArtistAlbums(
  getArtistAlbumsData: IGetArtistAlbumsData,
) {
  const tokens = await retrieveTokens();

  const response = await instance.get(
    `${API_KEY}/artists/${getArtistAlbumsData.artistId}/albums?market=LB`,
    {
      params: {limit: 50, include_groups: getArtistAlbumsData.includeGroups},
      headers: {
        Authorization: `Bearer ${tokens?.tokens.accessToken}`,
      },
    },
  );

  queryClient.invalidateQueries(['auth']);

  const data: GetArtistAlbumsResponse = response.data;

  return data;
}
