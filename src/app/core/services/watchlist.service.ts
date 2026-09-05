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
    this.shows.set(shows.docs.map((item) => item.data() as UserShowWatchlist));
    this.watched.set(watched.docs.map((item) => item.data() as WatchedEpisode));
  }
  async addShow(show: UserShowWatchlist): Promise<void> { const uid = this.auth.user()?.uid; if (!uid) return; await setDoc(doc(this.firestore, `users/${uid}/watchlist/${show.showId}`), show); this.shows.update((items) => [...items.filter((item) => item.showId !== show.showId), show]); }
  async removeShow(showId: number): Promise<void> { const uid = this.auth.user()?.uid; if (!uid) return; await deleteDoc(doc(this.firestore, `users/${uid}/watchlist/${showId}`)); this.shows.update((items) => items.filter((item) => item.showId !== showId)); }
  async toggleEpisode(episode: WatchedEpisode): Promise<void> {
    const uid = this.auth.user()?.uid; if (!uid) return; const id = `${episode.showId}_s${episode.seasonNumber}_e${episode.episodeNumber}`; const exists = this.watched().some((item) => item.showId === episode.showId && item.seasonNumber === episode.seasonNumber && item.episodeNumber === episode.episodeNumber);
    if (exists) { await deleteDoc(doc(this.firestore, `users/${uid}/watched_episodes/${id}`)); this.watched.update((items) => items.filter((item) => `${item.showId}_s${item.seasonNumber}_e${item.episodeNumber}` !== id)); } else { await setDoc(doc(this.firestore, `users/${uid}/watched_episodes/${id}`), episode); this.watched.update((items) => [...items, episode]); }
  }
  async markSeasonWatched(showId: number, seasonNumber: number, episodeNumbers: number[]): Promise<void> {
    const unwatched = episodeNumbers.filter((episodeNumber) => !this.watched().some((episode) => episode.showId === showId && episode.seasonNumber === seasonNumber && episode.episodeNumber === episodeNumber));
    await Promise.all(unwatched.map((episodeNumber) => this.toggleEpisode({ showId, seasonNumber, episodeNumber, watchedAt: new Date().toISOString() })));
  }
}