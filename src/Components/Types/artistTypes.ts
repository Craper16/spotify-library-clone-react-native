export interface ArtistsResponse {
  artists: Artists;
}

export interface Artists {
  href: string;
  items: Artist[];
  limit: number;
  next: string;
  offset: number;
  previous: null;
  total: number;
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
  type: 'artist' | 'track';
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: null;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export enum Type {
  Artist = 'artist',
}
