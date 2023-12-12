export interface IPexels {
  page: number;
  per_page: number;
  photos: IPhoto[];
  total_results: number;
  next_page: string;
}

export interface IPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: ISrc;
  liked: boolean;
  alt: string;
}

export interface ISrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}
