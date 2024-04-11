import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatCard,
    MatError,
    MatIcon,
    MatLabel,
    MatFormField,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatInputModule,
    MatButtonModule,
  ],
})
export class AuthComponent {
  authForm: FormGroup;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async signUp(): Promise<void> {
    if (this.authForm.invalid) {
      return;
    }
    try {
      const { email, password } = this.authForm.value;
      const userCredential: UserCredential =
        await this.authService.signUpWithEmailAndPassword({ email, password });
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        alert(
          'Sign up successful. Please check your email to verify your account.',
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async logIn(): Promise<void> {
    if (this.authForm.invalid) {
      return;
    }
    try {
      const { email, password } = this.authForm.value;
      const userCredential: UserCredential =
        await this.authService.logInWithEmailAndPassword({ email, password });
      if (userCredential.user && !userCredential.user.emailVerified) {
        alert('Please verify your email before logging in.');
      } else {
        await this.router.navigateByUrl('/client');
      }
    } catch (error) {
      console.error(error);
    }
  }

  submitForm(action: 'signUp' | 'logIn'): void {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    if (action === 'signUp') {
      this.signUp().then();
    } else if (action === 'logIn') {
      this.logIn().then();
    }
  }

  toggleVisibility() {
    this.hide = !this.hide;
  }
}
