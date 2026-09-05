import { Injectable, signal, inject } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { firebaseApp } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = getAuth(firebaseApp as FirebaseApp);
  readonly user = signal<User | null>(this.auth.currentUser);
  readonly isAllowed = signal(this.auth.currentUser?.email === 'alvarocjunq@gmail.com');

  constructor() { this.auth.onAuthStateChanged((user) => { this.user.set(user); this.isAllowed.set(user?.email === 'alvarocjunq@gmail.com'); }); }
  async signInWithGoogle(): Promise<void> {
    const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
    if (result.user.email !== 'alvarocjunq@gmail.com') { await this.signOut(); throw new Error('Access Denied: Personal App Only'); }
  }
  async signOut(): Promise<void> { await signOut(this.auth); }
}