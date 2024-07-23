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