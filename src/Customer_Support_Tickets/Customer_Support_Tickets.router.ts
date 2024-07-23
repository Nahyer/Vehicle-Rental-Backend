import { Hono } from "hono";
import{ CreateCustomer_Support_Tickets,
   GetCustomer_Support_TicketsById, UpdateCustomer_Support_Tickets, DeleteCustomer_Support_Tickets,
   ListsCustomer_Support_Ticketss} from "./Customer_Support_Tickets.controller";
import { CustomerSupportTicketSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { authorizeAdmin, authorizeCustomer } from "../middleware/authorize";
export const Customer_Support_TicketsRouter = new Hono().basePath('/tickets')

Customer_Support_TicketsRouter.get("",authorizeCustomer, ListsCustomer_Support_Ticketss);
Customer_Support_TicketsRouter.get("/:id",authorizeCustomer, GetCustomer_Support_TicketsById);
Customer_Support_TicketsRouter.post("/create",authorizeCustomer,zValidator('json', CustomerSupportTicketSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateCustomer_Support_Tickets);
Customer_Support_TicketsRouter.put("/:id",authorizeAdmin, UpdateCustomer_Support_Tickets);
Customer_Support_TicketsRouter.delete("/:id",authorizeAdmin, DeleteCustomer_Support_Tickets);