import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

// Ensure the environment variables are loaded.
const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
if (!stripeSecretKey) {
  throw new Error('The Stripe secret key is not defined in the environment variables.');
}

const firebaseAdminSdk = process.env['FIREBASE_ADMIN_SDK'];
if (!firebaseAdminSdk) {
  throw new Error('The Firebase Admin SDK is not defined in the environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Ensure this matches your Stripe dashboard's API version
});

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(Buffer.from(firebaseAdminSdk, 'base64').toString('ascii'))),
  });
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'POST') {
    const { uid } = req.body;

    try {
      // Authenticate the Firebase user
      const userRecord = await admin.auth().getUser(uid);
      if (!userRecord) {
        return res.status(401).send({ error: 'User not found' });
      }

      // Create the Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          price: 'price_YOUR_PRICE_ID', // Replace this with your actual price ID
          quantity: 1,
        }],
        success_url: 'http://localhost:4200/success',
        cancel_url: 'http://localhost:4200/cancel',
      });

      return res.status(200).json({ sessionId: session.id });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
      } else {
        console.error('An unexpected error occurred', error);
        return res.status(500).send({ error: 'An unexpected error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
};
