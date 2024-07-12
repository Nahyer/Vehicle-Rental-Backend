import { eq } from "drizzle-orm";
import db from "../drizzle/db";
  import{ TICustomerSupportTickets, TSCustomerSupportTickets, customerSupportTickets } from "../drizzle/schema";

export const getCustomer_Support_TicketssService = async (limit?: number): Promise<TSCustomerSupportTickets[] | null> => {
  if (limit) {
   return await db.query.customerSupportTickets.findMany({
    limit: limit,
  });
  }
  return await db.query.customerSupportTickets.findMany();
};
export const getCustomer_Support_TicketsByIdService = async (id: number): Promise<TSCustomerSupportTickets | undefined> => {
  return await db.query.customerSupportTickets.findFirst({
   where: eq(customerSupportTickets.user_id,id)
  })
}

export const createCustomer_Support_TicketsService = async (Customer_Support_Ticketss: TICustomerSupportTickets) => {
  await db.insert(customerSupportTickets).values(Customer_Support_Ticketss)
  return `Customer_Support_Tickets, has been created`;
}

export const updateCustomer_Support_TicketsService = async (id: number, Customer_Support_Tickets: TICustomerSupportTickets) => {

  await db.update(customerSupportTickets).set(Customer_Support_Tickets)
  .where(eq(customerSupportTickets.user_id, id))
  return `Customer_Support_Tickets, has been updated successfully`
}

export const DeleteCustomer_Support_TicketsByIdService = async (id: number) =>{
  //query the Customer_Support_Tickets table and delete the Customer_Support_Tickets with the id
  const delCustomer_Support_Tickets = await db.query.customerSupportTickets.findFirst({
  where: eq(customerSupportTickets.user_id, id)
  })
  await db.delete(customerSupportTickets).where(eq(customerSupportTickets.user_id, id))
  return `Customer_Support_Tickets, has been deleted successfully`
}