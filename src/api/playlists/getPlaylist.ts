import {API_KEY} from '@env';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';
import {Track} from '../../Components/Types/songTypes';
import {getUserProfile} from '../users/getUserProfile';

export interface GetPlaylistResponse {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
  primary_color: any;
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
  height: any;
  width: any;
}

export interface Owner {
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

export interface Tracks {
  href: string;
  limit: number;
  next: any;
  offset: number;
  previous: any;
  total: number;
  items: Item[];
}

export interface Item {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  track: Track;
  primary_color: any;
  video_thumbnail: VideoThumbnail;
}

export interface AddedBy {
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface ExternalUrls3 {
  spotify: string;
}

export interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  images: Image2[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: Artist[];
}

export interface ExternalUrls4 {
  spotify: string;
}

export interface Image2 {
  url: string;
  height: number;
  width: number;
}

export interface Artist {
  external_urls: ExternalUrls5;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls5 {
  spotify: string;
}

export interface Artist2 {
  external_urls: ExternalUrls6;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls6 {
  spotify: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls7 {
  spotify: string;
}

export interface VideoThumbnail {
  url: any;
}

interface IGetPlaylistData {
  playlist_id: string;
  market?: string;
  fields?: string;
  additional_types?: string;
}

export async function getPlaylist(getPlaylistData?: IGetPlaylistData) {
  const tokens = await retrieveTokens();

  const response = await instance.get(
    `${API_KEY}/playlists/${getPlaylistData?.playlist_id}`,
    {
      params: {
        fields: getPlaylistData?.fields,
        additional_types: getPlaylistData?.additional_types,
        market: getPlaylistData?.market,
      },
      headers: {
        Authorization: `Bearer ${tokens?.tokens.accessToken}`,
      },
    },
  );

  queryClient.invalidateQueries(['auth']);

  const data: GetPlaylistResponse = response.data;

  const playlistOwner = await getUserProfile({userId: data.owner.id});

  return {playlist: data, playlistOwner};
}
