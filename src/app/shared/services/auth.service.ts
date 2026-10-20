import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { auth } from '../../firebase.config';

@Service()
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly loading = signal<boolean>(true);
  readonly isLoggedIn = computed<boolean>(() => !!this.currentUser());
  readonly destroyRef = inject(DestroyRef);

  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      const stateChange = onAuthStateChanged(auth, (user) => {
        this.currentUser.set(user);
        this.loading.set(false);
        resolve();
      });

      this.destroyRef.onDestroy(stateChange);
    });
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  signOut() {
    return firebaseSignOut(auth);
  }
}
