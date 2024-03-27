import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    // Replace 'YOUR_STRIPE_PUBLIC_KEY' with your actual Stripe public key.
    this.stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');
  }

  createCheckoutSession(): Observable<{ sessionId: string }> {
    // Adjust '/api/create-checkout-session' if necessary to point to your backend endpoint.
    return this.http.post<{ sessionId: string }>(
      '/api/create-checkout-session',
      {
        trialDays: 30,
      },
    );
  }

  async redirectToStripeCheckout(sessionId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe redirectToCheckout error:', error.message);
      }
    } else {
      console.error('Stripe.js library has not been loaded.');
    }
  }
}
