import { DestroyRef, Service, inject, signal } from '@angular/core';
import {
  User,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase.config';

@Service()
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const unsubscribe = onAuthStateChanged(auth, (user) => this.currentUser.set(user));
    this.destroyRef.onDestroy(unsubscribe);
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  signOut() {
    return firebaseSignOut(auth);
  }
}
