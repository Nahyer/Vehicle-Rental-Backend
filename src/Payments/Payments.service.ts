import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIPayments, TSPayments, payments } from "../drizzle/schema";

export const getPaymentssService = async (limit?: number): Promise<TSPayments[] | null> => {
  if (limit) {
   return await db.query.payments.findMany({
    limit: limit,
  });
  }
  return await db.query.payments.findMany();
};
export const getPaymentsByIdService = async (id: number): Promise<TSPayments | undefined> => {
  return await db.query.payments.findFirst({
   where: eq(payments.payment_id,id)
  })
}

export const createPaymentsService = async (Paymentss: TIPayments) => {
  await db.insert(payments).values(Paymentss)
  return `Payments, has been created`;
}

export const updatePaymentsService = async (id: number, Payment: TIPayments) => {

  await db.update(payments).set(Payment)
  .where(eq(payments.payment_id, id))
  return `Payments, has been updated successfully`
}

export const DeletePaymentsByIdService = async (id: number) =>{
  //query the Payments table and delete the Payments with the id
  const delPayments = await db.query.payments.findFirst({
  where: eq(payments.payment_id, id)
  })
  await db.delete(payments).where(eq(payments.payment_id, id))
  return `Payments, has been deleted successfully`
}
// id: 'cs_test_a1Od45SS7W9sQlVhBwsXEMFOYiLaATITv6bgg594VWrPC04D30pNukLHb4',
//   object: 'checkout.session',
//   after_expiration: null,
//   allow_promotion_codes: null,
//   amount_subtotal: 170000,
//   amount_total: 170000,
//   automatic_tax: { enabled: false, liability: null, status: null },
//   billing_address_collection: null,
//   cancel_url: 'http://localhost:5173/customer/booking-cancelled',
//   client_reference_id: null,
//   client_secret: null,
//   consent: null,
//   consent_collection: null,
//   created: 1720688422,
//   currency: 'usd',
//   currency_conversion: null,
//   custom_fields: [],
//   custom_text: {
//     after_submit: null,
//     shipping_address: null,
//     submit: null,
//     terms_of_service_acceptance: null
//   },
//   customer: null,
//   customer_creation: 'if_required',
//   customer_details: {
//     address: {
//       city: null,
//       country: 'KE',
//       line1: null,
//       line2: null,
//       postal_code: null,
//       state: null
//     },
//     email: 'reyhanmark0@gmail.com',
//     name: 'reyhan',
//     phone: null,
//     tax_exempt: 'none',
//     tax_ids: []
//   },
//   customer_email: null,
//   expires_at: 1720774822,
//   invoice: null,
//   invoice_creation: {
//     enabled: false,
//     invoice_data: {
//       account_tax_ids: null,
//       custom_fields: null,
//       description: null,
//       footer: null,
//       issuer: null,
//       metadata: {},
//       rendering_options: null
//     }
//   },
//   livemode: false,
//   locale: null,
//   metadata: { bookingId: '30' },
//   mode: 'payment',
//   payment_intent: 'pi_3PbIs5AfWaTAZW5W1YqBcV09',
//   payment_link: null,
//   payment_method_collection: 'if_required',
//   payment_method_configuration_details: null,
//   payment_method_options: { card: { request_three_d_secure: 'automatic' } },
//   payment_method_types: [ 'card' ],
//   payment_status: 'paid',
//   phone_number_collection: { enabled: false },
//   recovered_from: null,
//   saved_payment_method_options: null,
//   setup_intent: null,
//   shipping_address_collection: null,
//   shipping_cost: null,
//   shipping_details: null,
//   shipping_options: [],
//   status: 'complete',
//   submit_type: null,
//   subscription: null,
//   success_url: 'http://localhost:5173/customer/booking-successful',
//   total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
//   ui_mode: 'hosted',
//   url: null
// }