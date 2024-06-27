## Nestjs-Stripe
```
#  latest-nestjs-stripe

 latest-nestjs-stripe is a latest NestJS module for integrating Stripe into your application, and it provides some built-in payment flows for easy implementation.

```

## Instalation

```bash
 npm i latest-nestjs-stripe
```

```bash
 yarn add latest-nestjs-stripe
```
Nest.js and Stripe and express are peer dependencies.

## ENUM USE FOR ENDPOINTS 
stripe.enum.ts
It's not compulsory; you can use your own.
```typescript
export enum PATHSTRIPE {
    ROOT = 'stripe',
    INTENT = 'intent',
    WEBHOOK = 'webhook',
    WEBHOOK_PATH = 'v1/stripe/webhook'
}
```

## INJECT STRIPE MODULE IN YOUR MODULE
```typescript
import { Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StripeEventsExtension, StripeModule } from "latest-nestjs-stripe";
import { StripeController } from "./controllers/stripe.controller";
import { PATHSTRIPE } from "./enums/stripe.enum";

@Module({
    imports: [
        StripeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                apiKey: configService.get('STRIPE_SECRET_KEY'),
                config: { apiVersion: "2024-04-10" }
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [StripeController]
})
export default class Stripe {}
```



## INJECT USE STRIPE CLIENT EXAMPLE.
We can use the client for creating payment intent. Use all Stripe client features with this.
```JS
 constructor(@Inject(StripeService) private readonly stripe: StripeService) { }
 //THIS IS A STTRIPE CLIENT
 this.stripe.client
```

## CONTROLLER FOR CREATE INTENT USING STRIPE CLIENT 

```typescript
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { StripeService } from 'latest-nestjs-stripe';
import { PATHSTRIPE } from '../enums/stripe.enum';

@Controller(PATHSTRIPE.ROOT)
export class StripeController {

    constructor(@Inject(StripeService) private readonly stripe: StripeService) { }

    @Post(PATHSTRIPE.INTENT)
    @HttpCode(HttpStatus.CREATED)
    public create() {
        return this.stripe.client.paymentIntents.create({
            amount: 20 * 100,
            currency: "AED",
            metadata: {
                from: 'sec'
            },
            description: "lorem ipsum"
        })
    }

}
```

## WEBHOOK IMPLEMENTATION ON APPLICATION AND CONTROLLER 
There are two methods for using webhooks: one if you use a single middleware module, and the other if you use more than one middleware module.

**STEP ONE**
go to main.ts and active rawBody
```typescript
    const app = await NestFactory.create(AppModule, {
        rawBody: true
    })
```
**STEP TWO**
go to your module and extend middleware class StripeEventsExtension from "latest-nestjs-stripe"

## FIRST METHOD FOR SINGLE MIDDLEWARE
```typescript
import { Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StripeEventsExtension, StripeModule } from "latest-nestjs-stripe";
import { StripeController } from "./controllers/stripe.controller";
import { PATHSTRIPE } from "./enums/stripe.enum";

@Module({
    imports: [
        StripeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                apiKey: configService.get('STRIPE_SECRET_KEY'),
                config: { apiVersion: "2024-04-10" }
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [StripeController]
})


export default class Stripe extends StripeEventsExtension {
    constructor() {
        const key = process.env.WEBHOOK_KEY //webhook key
        const path = PATHSTRIPE.RAW_WEBHOOK //Webhook path to apply middleware on this path
        //"The RequestMethod.POST parameter applies middleware on this route method."
        super(key, RequestMethod.POST, path) // This parameter is required in the StripeEventsExtension class.
    }
    

}
```
## SECOND METHOD FOR MULTIPLE MIDDLEWARE
```typescript
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RawEventStripeMiddleware, StripeModule } from "latest-nestjs-stripe";
import { StripeController } from "./controllers/stripe.controller";
import { PATHSTRIPE } from "./enums/stripe.enum";

@Module({
    imports: [
        StripeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                apiKey: configService.get('STRIPE_SECRET_KEY'),
                config: { apiVersion: "2024-04-10" }
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [StripeController]

})

export default class Stripe implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const key = process.env.WEBHOOK_KEY
        consumer.apply(RawEventStripeMiddleware(key))
            .forRoutes({
                method: RequestMethod.POST,
                path: PATHSTRIPE.RAW_WEBHOOK
            })
        //MULTIPLE MIDDLEWARES INJECTS
        // consumer.apply(RawEventStripeMiddleware(key))
        //     .forRoutes({
        //         method: RequestMethod.POST,
        //         path: PATHSTRIPE.RAW_WEBHOOK
        //     })
    }
}
```
## HANDLE WEBHOOK IN CONTROLLER

```typescript
import { Controller, HttpCode, HttpStatus, Post, RawBodyRequest, Req } from '@nestjs/common';
import { StripeEventRequestI } from 'latest-nestjs-stripe';
import { PATHSTRIPE } from '../enums/stripe.enum';

@Controller(PATHSTRIPE.ROOT)
export class StripeController {

    // webhook
    @Post(PATHSTRIPE.WEBHOOK)
    @HttpCode(HttpStatus.OK)
    public webhook(@Req() req: RawBodyRequest<StripeEventRequestI>) {
        const event = req.event
        switch (event.type) {
            case 'payment_intent.created':
                console.log(event.data.object.client_secret)
                break;
            case 'payment_intent.succeeded':
                console.log(event.data.object.client_secret)
                break;
            default:
                break;
        }

        return true
    }


}
```


```typescript
  //Stripe Client
  const  client  =  this.stripeService.client
```

## BUILT IN FUNCTIONS FOR FUTURE PAYMENTS
```typescript

__create_customer()
__get_payment_methods()
__get_default_payment_method()
__set_default_payment_method()
__detach_payment_method()
payment_intent() //for futre and non future both
__check_payment_method(payment_method,customer_id)
```

## FUTURE PAYMENTS FLOW DOCS COMING SOON

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
