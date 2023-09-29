

import Stripe from 'stripe';

export type StripeClient = Stripe;

export interface ExtraConfiguration {
  isGlobal?: boolean;
}

export interface StripeModuleOptions extends ExtraConfiguration {
  apiKey: string;
  config: Stripe.StripeConfig;
}


export interface DefaultPaymentMethod {
  default_payment_method: Stripe.PaymentMethod | any
}


export type DetachPaymentMethod = {
  statusCode: number,
  message: string
}
