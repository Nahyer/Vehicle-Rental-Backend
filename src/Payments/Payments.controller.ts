import { Context } from "hono";
import { HTTPException } from 'hono/http-exception';
import { getPaymentssService, createPaymentsService, getPaymentsByIdService, updatePaymentsService, DeletePaymentsByIdService } from "./Payments.service";
import Stripe from "stripe";
import { updateBookingsService } from "../Bookings/Bookings.service";
import { TIPayments } from "../drizzle/schema";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const ListsPaymentss = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await getPaymentssService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetPaymentsById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const Payments = await getPaymentsByIdService(id);
    if(!Payments) return c.json({ message: "Payments not found"},404);
    return c.json(Payments);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreatePayments = async(c: Context) => {
  try {
    const Payments = await c.req.json();
    Payments.created_at = new Date();
    const newPayments = await createPaymentsService(Payments);
    if(!newPayments) return c.json({ message: "Unable to create"},404);
    return c.json(newPayments, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const UpdatePayments = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const UPayments = await getPaymentsByIdService(id);
    if (!UPayments) return c.text("Payments not found", 404);
    const Payments = await c.req.json();
    Payments.updated_at = new Date();
    const upPayments = await updatePaymentsService(id, Payments);
    if (!upPayments) return c.text("Payments not updated", 404);
    return c.json(upPayments, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeletePayments = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DPayments = await getPaymentsByIdService(id);
  if (!DPayments) return c.text("Payments not found", 404);
    const delPayments = await DeletePaymentsByIdService(id);
    if (!delPayments) return c.text("Payments not deleted", 404);
    return c.json(delPayments, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CheckOut = async(c: Context) => {
  try {
    const referrer = c.req.header('referer');
    const paymentDetails = await c.req.json();
    const { amount, bookingId, vehicleSpecs} = paymentDetails;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${vehicleSpecs}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${referrer}customer/booking-successful`,
      cancel_url: `${referrer}customer/booking-cancelled`,
      metadata: {
        bookingId: bookingId as number,
      },
    });
    return c.json({ id: session.id });
  } catch (error:any) {
    console.error(error);
    return c.json({ message: error.message }, { status: 500 });
  }
  
 
}

export const HandleWebhook = async(c: Context) => {
  const payload = await c.req.text();
  const signature = c.req.header('Stripe-Signature');
  let event
  try {
    event = stripe.webhooks.constructEvent(payload, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error:any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return c.json({ message: 'Webhook signature verification failed' }, { status: 400 });
  }
  //handle if successful
  if (event.type === 'checkout.session.completed') {
    const session:Stripe.Checkout.Session = event.data.object;
    console.log(session)
    
    const booking_id = session.metadata?.bookingId;
    const bookingStatus = 'completed';

    const paymentIntent:any = {
      booking_id: Number(booking_id),
      // amount: (session.amount_total! / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      amount: Number((session.amount_total! / 100).toFixed(2)),
      payment_status: session.payment_status,
      payment_method: session.payment_method_types![0],
      transaction_id: session.payment_intent as string,
      created_at: new Date(),
      payment_date: new Date(session.created * 1000)
    };
    
    const payment = await createPaymentsService(paymentIntent);
    console.log("🚀 ~ succeful ~ payment:", payment)
    const booking = await updateBookingsService(Number(booking_id),{booking_status:bookingStatus})
    console.log(`Payment Intent: ${session.payment_intent}`);
    return c.text( booking );
  }
  return c.text('Success');
}

