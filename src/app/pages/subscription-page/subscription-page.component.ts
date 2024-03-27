import { Component } from '@angular/core';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-subscription-page',
  templateUrl: './subscription-page.component.html',
  standalone: true,
})
export class SubscriptionPageComponent {
  constructor(private stripeService: StripeService) {}

  startTrial() {
    this.stripeService.createCheckoutSession().subscribe({
      next: (response) => {
        this.stripeService.redirectToStripeCheckout(response.sessionId);
      },
      error: (err) => {
        console.error('Error creating checkout session:', err);
      },
    });
  }
}
