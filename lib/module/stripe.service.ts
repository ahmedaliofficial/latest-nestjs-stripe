import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  createStripeClient,
} from '../utils';
import type { DefaultPaymentMethod, DetachPaymentMethod, StripeClient } from '../utils';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
  private readonly stripeSdk: StripeClient;
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: typeof OPTIONS_TYPE,
  ) {
    this.stripeSdk = createStripeClient(this.options)
  }
  public get client(): StripeClient {
    return this.stripeSdk
  }
  // create a customers
  public async __create_customer(params?: Stripe.CustomerCreateParams,
    options?: Stripe.RequestOptions): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.client.customers.create(params, options)
  }
  //get customer payment methods
  public async __get_payment_methods(customer_id: string, type: Stripe.PaymentMethodListParams.Type): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
    return await this.client.paymentMethods.list({
      customer: customer_id,
      type: type
    })
  }
  // get dfault payment method
  public async __get_default_payment_method(customer_id: string): Promise<DefaultPaymentMethod> {
    try {
      const customer: Stripe.Customer = await this.client.customers.retrieve(customer_id) as Stripe.Customer
      if (customer.invoice_settings.default_payment_method == null) return { default_payment_method: null }
      const payment_method = await this.client.paymentMethods.retrieve(
        customer.invoice_settings.default_payment_method.toString()
      )
      return { default_payment_method: payment_method }
    } catch (error: any) {
      throw new HttpException(error.message, error.statusCode)
    }
  }
  // set default payment method
  public async __set_default_payment_method(payment_method: string, customer_id: string): Promise<Stripe.PaymentMethod> {
    try {
      const check_payment_method = await this.__check_payment_method(payment_method, customer_id)
      await this.client.customers.update(customer_id, { invoice_settings: { default_payment_method: payment_method } })
      return check_payment_method
    } catch (error: any) {
      throw new HttpException(error.message, error.statusCode)
    }
  }
  //detach payment methods
  public async __detach_payment_method(payment_method: string, customer_id: string): Promise<DetachPaymentMethod> {
    try {
      await this.__check_payment_method(payment_method, customer_id)
      await this.client.paymentMethods.detach(payment_method)
      return {
        statusCode: HttpStatus.OK,
        message: "payment method detach successfully."
      }
    } catch (error: any) {
      throw new HttpException(error.message, error.statusCode)
    }
  }
  // payment intent
  public async payment_intent(paymentIntentsParams: Stripe.PaymentIntentCreateParams, customer_id: string, payment_method: string | null = null, allow_future_payment: boolean = false): Promise<Stripe.PaymentIntent> {
    try {
      if (payment_method != null) await this.__check_payment_method(payment_method, customer_id)
      paymentIntentsParams.customer = customer_id
      if (payment_method != null && allow_future_payment == false) {
        paymentIntentsParams.payment_method = payment_method
        paymentIntentsParams.off_session = true
        paymentIntentsParams.confirm = true
      }
      if (payment_method == null && allow_future_payment == true) {
        paymentIntentsParams.setup_future_usage = 'off_session'
        paymentIntentsParams.automatic_payment_methods = {
          enabled: true
        }
      }
      return await this.client.paymentIntents.create(paymentIntentsParams)
    }
    catch (error: any) {
      throw new HttpException(error.message, error.statusCode)
    }
  }
  // check payment method is customer
  public async __check_payment_method(payment_method: string, customer_id: string): Promise<Stripe.PaymentMethod> {
    try {
      const pamentMethod: Stripe.PaymentMethod = await this.client.paymentMethods.retrieve(payment_method, {})
      if (pamentMethod.customer == customer_id) return pamentMethod
      throw new HttpException("Payment methods not found in this customer.", HttpStatus.BAD_REQUEST)
    } catch (error: any) {
      throw new HttpException(error.message, error.statusCode)
    }
  }
}
