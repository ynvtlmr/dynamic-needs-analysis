import { Injectable, inject } from '@angular/core';
import { 
  Auth, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword 
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Credential } from '../models/credential.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);
  readonly authState$ = authState(this.auth);

  constructor(private router: Router) {}

  signUpWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, credential.email, credential.password);
  }

  logInWithEmailAndPassword(credential: Credential): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password);
  }

  async logOut(): Promise<void> {
    try {
      await this.auth.signOut();
      // Navigate to the login page after successful logout
      await this.router.navigate(['/auth']);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  getCurrentUserEmail(): string | null {
    const user = this.auth.currentUser;
    return user ? user.email : null;
  }

}
