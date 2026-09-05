export interface TmdbShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  status?: string;
  number_of_episodes?: number;
  number_of_seasons?: number;
  episode_run_time?: number[];
  seasons?: TmdbSeason[];
  networks?: TmdbNetwork[];
}

export interface TmdbSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string | null;
}

export interface TmdbEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  vote_average: number;
  runtime: number | null;
}

export interface TmdbSeasonDetails extends TmdbSeason {
  episodes: TmdbEpisode[];
}

export interface TmdbNetwork { id: number; name: string; logo_path: string | null; }
export interface TmdbProvider { provider_id: number; provider_name: string; logo_path: string; }
export interface TmdbWatchRegion { flatrate?: TmdbProvider[]; rent?: TmdbProvider[]; buy?: TmdbProvider[]; }
export interface TmdbWatchProviders { results: Record<string, TmdbWatchRegion>; }
export interface TmdbShowDetails extends TmdbShow { 'watch/providers'?: TmdbWatchProviders; }
export interface TmdbPage<T> { page: number; results: T[]; total_pages: number; total_results: number; }