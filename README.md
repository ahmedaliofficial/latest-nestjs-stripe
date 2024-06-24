## Nestjs-Stripe
```
# nestjs-stripe

nestjs-stripe is a NestJS module for integrating Stripe into your application, and it provides some built-in payment flows for easy implementation.

```

## Instalation

```bash
 npm i @stack-pulse/nestjs-stripe
```

```bash
 yarn add @stack-pulse/nestjs-stripe
```
Nest.js and Stripe are peer dependencies.

## Quick Start



```typescript
import { StripeModule } from  '@stack-pulse/nestjs-stripe';
import { ConfigModule, ConfigService } from  '@nestjs/config';

@Module({
  imports: [
   StripeModule.forRootAsync({
	imports: [ConfigModule],
	useFactory: (configService: ConfigService) => ({
       apiKey: configService.get('STRIPE_SECRET_KEY'),
       config: { apiVersion: "2024-04-10" }
       }),
    inject: [ConfigService]
 })
  ],
  controllers: [YourController],
})
export class YourModule {}
```



Then, use the ervice:

```typescript
import { Controller, Get, Inject } from "@nestjs/common";
import { StripeService } from  '@stack-pulse/nestjs-stripe';

@Controller("your-route-path")
export class YourController {
  constructor(
    @Inject(StripeService)
	private  readonly  stripeService: StripeService
  ) {}

  @Get()
  public async yourRoute() {
  const  client  =  this.stripeService.client
  }
}
```

## Future Payments Flow Docs Coming Soon

## Built In Functions For Future Payments
```typescript
  //Stripe Client
  const  client  =  this.stripeService.client
```
```typescript

__create_customer()
__get_payment_methods()
__get_default_payment_method()
__set_default_payment_method()
__detach_payment_method()
payment_intent() //for futre and non future both
__check_payment_method(payment_method,customer_id)
```


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
```
32
