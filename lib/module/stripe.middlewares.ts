import { Response, NextFunction } from "express"
import { BadRequestException, Injectable, MiddlewareConsumer, mixin, NestMiddleware, NestModule, RawBodyRequest, RequestMethod, Type } from "@nestjs/common";
import { StripeService } from "./stripe.service"
import { STRIPE_RESOURCE, StripeEventRequestI } from "../utils"

export function RawEventStripeMiddleware(key: string, signature_error: string = 'signature not found'): Type<NestMiddleware> {

    @Injectable()
    class MRawBody implements NestMiddleware {

        constructor(private readonly stripe: StripeService) { }

        async use(req: RawBodyRequest<StripeEventRequestI>, res: Response, next: NextFunction) {

            const signature = req.header(STRIPE_RESOURCE.SIGNATURE)

            if (!signature)
                throw new BadRequestException(signature_error)

            req.event = await this.stripe.client.webhooks.constructEventAsync(req.rawBody, signature, key)

            next()
        }
    }

    return mixin(MRawBody)
}



export class StripeEventsExtension implements NestModule {

    constructor(private readonly key: string, private readonly method: number, private readonly path: string, private readonly signature_error: string = 'signature not found') { }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RawEventStripeMiddleware(this.key, this.signature_error))
            .forRoutes({
                method: this.method,
                path: this.path
            })
    }
}
