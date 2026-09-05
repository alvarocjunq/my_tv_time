export type WatchStatus = 'watching' | 'not_started' | 'completed';

export interface UserShowWatchlist {
  showId: number;
  showName: string;
  posterPath: string;
  status: WatchStatus;
  addedAt: string;
  totalEpisodes: number;
  watchedEpisodesCount: number;
}

export interface WatchedEpisode {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
  watchedAt: string;
}