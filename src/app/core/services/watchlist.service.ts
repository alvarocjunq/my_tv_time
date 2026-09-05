import { Injectable, inject, signal } from '@angular/core';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { firebaseApp } from './firebase.config';
import { UserShowWatchlist, WatchedEpisode } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly auth = inject(AuthService);
  private readonly firestore = getFirestore(firebaseApp);
  readonly shows = signal<UserShowWatchlist[]>([]);
  readonly watched = signal<WatchedEpisode[]>([]);

  async load(): Promise<void> {
    const uid = this.auth.user()?.uid; if (!uid) return;
    const shows = await getDocs(collection(this.firestore, `users/${uid}/watchlist`));
    const watched = await getDocs(collection(this.firestore, `users/${uid}/watched_episodes`));
    const watchedEpisodes = watched.docs.map((item) => item.data() as WatchedEpisode);
    this.watched.set(watchedEpisodes);
    this.shows.set(shows.docs.map((item) => this.withProgress(item.data() as UserShowWatchlist, watchedEpisodes)));
  }
  async addShow(show: UserShowWatchlist): Promise<void> { const uid = this.auth.user()?.uid; if (!uid) return; await setDoc(doc(this.firestore, `users/${uid}/watchlist/${show.showId}`), show); this.shows.update((items) => [...items.filter((item) => item.showId !== show.showId), show]); }
  async removeShow(showId: number): Promise<void> { const uid = this.auth.user()?.uid; if (!uid) return; await deleteDoc(doc(this.firestore, `users/${uid}/watchlist/${showId}`)); this.shows.update((items) => items.filter((item) => item.showId !== showId)); }
  async toggleEpisode(episode: WatchedEpisode): Promise<void> {
    const uid = this.auth.user()?.uid; if (!uid) return; const id = `${episode.showId}_s${episode.seasonNumber}_e${episode.episodeNumber}`; const exists = this.watched().some((item) => item.showId === episode.showId && item.seasonNumber === episode.seasonNumber && item.episodeNumber === episode.episodeNumber);
    let watchedEpisodes: WatchedEpisode[];
    if (exists) { await deleteDoc(doc(this.firestore, `users/${uid}/watched_episodes/${id}`)); watchedEpisodes = this.watched().filter((item) => `${item.showId}_s${item.seasonNumber}_e${item.episodeNumber}` !== id); } else { await setDoc(doc(this.firestore, `users/${uid}/watched_episodes/${id}`), episode); watchedEpisodes = [...this.watched(), episode]; }
    this.watched.set(watchedEpisodes);
    this.shows.update((items) => items.map((show) => show.showId === episode.showId ? this.withProgress(show, watchedEpisodes) : show));
  }
  async markSeasonWatched(showId: number, seasonNumber: number, episodeNumbers: number[]): Promise<void> {
    const unwatched = episodeNumbers.filter((episodeNumber) => !this.watched().some((episode) => episode.showId === showId && episode.seasonNumber === seasonNumber && episode.episodeNumber === episodeNumber));
    await Promise.all(unwatched.map((episodeNumber) => this.toggleEpisode({ showId, seasonNumber, episodeNumber, watchedAt: new Date().toISOString() })));
  }
  private withProgress(show: UserShowWatchlist, watchedEpisodes: WatchedEpisode[]): UserShowWatchlist {
    const watchedEpisodesCount = watchedEpisodes.filter((episode) => episode.showId === show.showId).length;
    const status = show.totalEpisodes > 0 && watchedEpisodesCount >= show.totalEpisodes ? 'completed' : watchedEpisodesCount > 0 ? 'watching' : show.status;
    return { ...show, watchedEpisodesCount, status };
  }
}