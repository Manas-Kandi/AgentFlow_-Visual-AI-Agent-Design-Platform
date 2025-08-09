import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    // Throw only when actually invoked at runtime, not at module import
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  stripeInstance = new Stripe(apiKey, {
    // Match installed Stripe SDK's expected latest API version type
    apiVersion: '2025-07-30.basil' as Stripe.LatestApiVersion,
    typescript: true,
  });
  return stripeInstance;
}

