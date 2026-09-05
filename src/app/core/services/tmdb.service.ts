import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TmdbEpisode, TmdbPage, TmdbSeasonDetails, TmdbShow, TmdbShowDetails } from '../models/tmdb.models';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p/';
  private readonly params = new HttpParams().set('api_key', '73ab822a363cf8cd22dbb61c5106148e').set('language', 'pt-BR');

  image(path: string | null, size = 'w500'): string { return path ? `${this.imageBaseUrl}${size}${path}` : 'assets/poster-placeholder.svg'; }
  searchShows(query: string): Observable<TmdbPage<TmdbShow>> { return this.http.get<TmdbPage<TmdbShow>>(`${this.baseUrl}/search/tv`, { params: this.params.set('query', query) }); }
  getTrendingShows(): Observable<TmdbPage<TmdbShow>> { return this.http.get<TmdbPage<TmdbShow>>(`${this.baseUrl}/trending/tv/week`, { params: this.params }); }
  getPopularShows(): Observable<TmdbPage<TmdbShow>> { return this.http.get<TmdbPage<TmdbShow>>(`${this.baseUrl}/tv/popular`, { params: this.params }); }
  getShowDetails(id: number): Observable<TmdbShowDetails> { return this.http.get<TmdbShowDetails>(`${this.baseUrl}/tv/${id}`, { params: this.params.set('append_to_response', 'watch/providers') }); }
  getSeasonDetails(id: number, seasonNumber: number): Observable<TmdbSeasonDetails> { return this.http.get<TmdbSeasonDetails>(`${this.baseUrl}/tv/${id}/season/${seasonNumber}`, { params: this.params }); }
  getEpisodes(id: number, seasonNumber: number): Observable<TmdbEpisode[]> { return this.getSeasonDetails(id, seasonNumber).pipe(map((season) => season.episodes)); }
}