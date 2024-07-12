import { Context } from "hono";
import { createCustomer_Support_TicketsService, getCustomer_Support_TicketsByIdService, updateCustomer_Support_TicketsService, DeleteCustomer_Support_TicketsByIdService, getCustomer_Support_TicketssService } from "./Customer_Support_Tickets.service";


export const ListsCustomer_Support_Ticketss = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await getCustomer_Support_TicketssService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetCustomer_Support_TicketsById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const Customer_Support_Tickets = await getCustomer_Support_TicketsByIdService(id);
    if(!Customer_Support_Tickets) return c.json({ message: "Customer_Support_Tickets not found"},404);
    return c.json(Customer_Support_Tickets);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreateCustomer_Support_Tickets = async(c: Context) => {
  try {
    const Customer_Support_Tickets = await c.req.json();
    Customer_Support_Tickets.created_at = new Date();
    const newCustomer_Support_Tickets = await createCustomer_Support_TicketsService(Customer_Support_Tickets);
    if(!newCustomer_Support_Tickets) return c.json({ message: "Unable to create"},404);
    return c.json(newCustomer_Support_Tickets, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const UpdateCustomer_Support_Tickets = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const UCustomer_Support_Tickets = await getCustomer_Support_TicketsByIdService(id);
    if (!UCustomer_Support_Tickets) return c.text("Customer_Support_Tickets not found", 404);
    const Customer_Support_Tickets = await c.req.json();
    Customer_Support_Tickets.updated_at = new Date();
    const upCustomer_Support_Tickets = await updateCustomer_Support_TicketsService(id, Customer_Support_Tickets);
    if (!upCustomer_Support_Tickets) return c.text("Customer_Support_Tickets not updated", 404);
    return c.json(upCustomer_Support_Tickets, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeleteCustomer_Support_Tickets = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DCustomer_Support_Tickets = await getCustomer_Support_TicketsByIdService(id);
  if (!DCustomer_Support_Tickets) return c.text("Customer_Support_Tickets not found", 404);
    const delCustomer_Support_Tickets = await DeleteCustomer_Support_TicketsByIdService(id);
    if (!delCustomer_Support_Tickets) return c.text("Customer_Support_Tickets not deleted", 404);
    return c.json(delCustomer_Support_Tickets, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}