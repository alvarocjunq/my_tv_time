import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  template: `<main class="login"><div class="login-grid"><div class="login-copy"><span class="brand-mark">MT</span><p class="eyebrow">Personal TV diary</p><h1>Your shows,<br><em>your rhythm.</em></h1><p class="muted">Keep the stories you love close. Track every episode without the noise.</p></div><section class="login-card"><p class="eyebrow">Private by design</p><h2>Welcome back, Alvaro.</h2><p class="muted">Sign in with the approved Google account to continue.</p><button class="button" (click)="login()" [disabled]="loading()">{{ loading() ? 'Connecting...' : 'Continue with Google' }}</button>@if (error()) { <p class="error" role="alert">{{ error() }}</p> }</section></div></main>`,
  styles: [`.login{min-height:100dvh;display:grid;place-items:center;padding:1.5rem;background:radial-gradient(circle at 80% 10%,#2b3330 0,transparent 35%),var(--ink)}.login-grid{width:min(980px,100%);display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(2rem,8vw,7rem);align-items:center}.login-copy{display:grid;gap:1.2rem}.login-copy .brand-mark{display:grid;place-items:center;width:3rem;height:3rem;background:var(--lime);color:var(--ink);border-radius:10px;font-weight:700}.login-copy h1{font-size:clamp(3.5rem,8vw,7rem)}.login-copy em{color:var(--lime);font-style:normal}.login-card{background:var(--panel);border:1px solid var(--line);padding:2rem;border-radius:10px;display:grid;gap:1rem}.login-card .button{width:100%;margin-top:1rem}.error{color:var(--coral);font-size:.85rem}@media(max-width:700px){.login-grid{grid-template-columns:1fr}.login-copy h1{font-size:3.3rem}}`],
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly error = signal('');
  async login(): Promise<void> { this.loading.set(true); this.error.set(''); try { await this.auth.signInWithGoogle(); await this.router.navigateByUrl('/watchlist'); } catch (error) { this.error.set(error instanceof Error ? error.message : 'Unable to sign in.'); } finally { this.loading.set(false); } }
}
