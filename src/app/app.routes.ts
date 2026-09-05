import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
	{ path: 'login', loadComponent: () => import('./features/auth/login.component').then((module) => module.LoginComponent) },
	{ path: 'watchlist', canActivate: [authGuard], loadComponent: () => import('./features/watchlist/watchlist.component').then((module) => module.WatchlistComponent) },
	{ path: 'search', canActivate: [authGuard], loadComponent: () => import('./features/search/search.component').then((module) => module.SearchComponent) },
	{ path: 'show/:id', canActivate: [authGuard], loadComponent: () => import('./features/show-details/show-details.component').then((module) => module.ShowDetailsComponent) },
	{ path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then((module) => module.ProfileComponent) },
	{ path: '', pathMatch: 'full', redirectTo: 'watchlist' }, { path: '**', redirectTo: 'watchlist' },
];
