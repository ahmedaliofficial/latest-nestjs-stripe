import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from '../utils';

import { StripeService } from './stripe.service';

@Module({
  providers: [StripeService],
  exports: [StripeService]
})
export class StripeModule extends ConfigurableModuleClass {}
