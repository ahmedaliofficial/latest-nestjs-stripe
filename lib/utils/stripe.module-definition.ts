import { ConfigurableModuleBuilder } from '@nestjs/common';

import { ExtraConfiguration, StripeModuleOptions } from './stripe.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<StripeModuleOptions>()
  .setExtras<ExtraConfiguration>({ isGlobal: false }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  }))
  .setClassMethodName('forRoot')
  .build();
