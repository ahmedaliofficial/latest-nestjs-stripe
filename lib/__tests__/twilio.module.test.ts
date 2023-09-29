import { Test } from '@nestjs/testing';


import { OPTIONS_TYPE } from '../utils';
import { StripeModule, StripeService } from '../module';
describe('StripeModule', () => {
  const {
    STRIPE_SECRET_KEY
  } = process.env;

  if (!STRIPE_SECRET_KEY)
    throw new Error('No Stripe Secret Key Found.');


  const config: typeof OPTIONS_TYPE = {
    apiKey: STRIPE_SECRET_KEY,
    config: { apiVersion: "2023-08-16" }

  }

  describe('forRoot', () => {
    let stripeService: StripeService;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [StripeModule.forRoot(config)],
      }).compile();

      stripeService = module.get(StripeService);
    });

    it('should provide sentry client', () => {
      expect(stripeService).toBeDefined();
    });


  });

  describe('forRootAsync with useFactory', () => {
    let stripeService: StripeService;

    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [
          StripeModule.forRootAsync({
            useFactory: () => config,
          }),
        ],
      }).compile();

      stripeService = module.get(StripeModule);
    });

    it('should provide sentry client', () => {
      expect(stripeService).toBeDefined();
    });


  });
});
