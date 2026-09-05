import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TmdbShow } from '../../core/models/tmdb.models';
import { TmdbService } from '../../core/services/tmdb.service';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  imports: [FormsModule, RouterLink],
  template: `<section class="content"><header class="page-head"><div><p class="eyebrow">Explore the catalogue</p><h1>Find your next<br><em>obsession.</em></h1></div><p class="muted intro">A quieter way to decide what comes next.</p></header><form class="search" (ngSubmit)="search()"><input [(ngModel)]="query" name="query" placeholder="Search TV series..." aria-label="Search TV series"><button class="button" type="submit">Search</button></form><div class="section-heading"><h2>{{ query ? 'Search results' : 'Trending this week' }}</h2><button class="text-button" (click)="loadPopular()">Popular</button></div><div class="show-grid">@for (show of shows(); track show.id) { <article class="show-card"><a [routerLink]="['/show', show.id]"><img [src]="tmdb.image(show.poster_path)" [alt]="show.name + ' poster'"><div class="show-info"><h3>{{ show.name }}</h3><p class="muted">{{ show.first_air_date?.slice(0, 4) || 'TBA' }} · ★ {{ show.vote_average.toFixed(1) }}</p></div></a><button class="watch-toggle" (click)="toggle(show)">{{ isTracked(show.id) ? 'In watchlist' : '+ Watchlist' }}</button></article> } @empty { <p class="muted">No series found yet.</p> }</div></section>`,
  styles: [`.page-head{display:flex;justify-content:space-between;gap:2rem;align-items:end;margin-bottom:2.5rem}.page-head em{color:var(--lime);font-style:normal}.intro{max-width:220px}.search{display:flex;gap:.6rem;margin-bottom:3rem}.search input{flex:1;min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:.8rem 1rem;color:var(--paper)}.section-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.text-button{background:none;border:0;color:var(--lime)}.show-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1.2rem}.show-card{min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:8px;overflow:hidden}.show-card>a{color:inherit;text-decoration:none}.show-card img{display:block;width:100%;aspect-ratio:2/3;object-fit:cover;background:var(--lift)}.show-info{padding:.75rem .75rem .3rem}.show-info h3{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.show-info p{font-size:.75rem;margin-top:.35rem}.watch-toggle{width:100%;border:0;border-top:1px solid var(--line);padding:.65rem;background:transparent;color:var(--lime);font-size:.75rem}@media(max-width:600px){.content{padding-top:2rem}.page-head{display:block}.intro{margin-top:1rem}.show-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}`],
})
export class SearchComponent {
  readonly tmdb = inject(TmdbService); private readonly watchlist = inject(WatchlistService); readonly shows = signal<TmdbShow[]>([]); query = '';
  constructor() { this.loadTrending(); }
  loadTrending(): void { this.tmdb.getTrendingShows().subscribe((page) => this.shows.set(page.results)); }
  loadPopular(): void { this.tmdb.getPopularShows().subscribe((page) => this.shows.set(page.results)); }
  search(): void { const query = this.query.trim(); if (query) this.tmdb.searchShows(query).subscribe((page) => this.shows.set(page.results)); else this.loadTrending(); }
  isTracked(id: number): boolean { return this.watchlist.shows().some((show) => show.showId === id); }
  async toggle(show: TmdbShow): Promise<void> { if (this.isTracked(show.id)) await this.watchlist.removeShow(show.id); else await this.watchlist.addShow({ showId: show.id, showName: show.name, posterPath: show.poster_path ?? '', status: 'not_started', addedAt: new Date().toISOString(), totalEpisodes: show.number_of_episodes ?? 0, watchedEpisodesCount: 0 }); }
}
