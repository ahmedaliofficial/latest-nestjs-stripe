import Stripe from 'stripe';
import { StripeClient } from './stripe.interface';
import { OPTIONS_TYPE } from './stripe.module-definition';



export function createStripeClient({
  apiKey,
  config
}: typeof OPTIONS_TYPE): StripeClient {
  const client = new Stripe(apiKey, config);
  return client;
}
