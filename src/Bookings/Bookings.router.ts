import { Hono } from "hono";
  import { ListsBookingss, CreateBookings,
     GetBookingsById, UpdateBookings, DeleteBookings} from "./Bookings.controller";
import { BookingsSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { authorizeAdmin, authorizeCustomer } from "../middleware/authorize";
export const BookingsRouter = new Hono().basePath('/bookings')

BookingsRouter.get("", authorizeCustomer,ListsBookingss);
BookingsRouter.get("/:id",authorizeCustomer,GetBookingsById);
BookingsRouter.post("/add",zValidator('json', BookingsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),authorizeCustomer,CreateBookings);
BookingsRouter.put("/:id",authorizeCustomer, UpdateBookings);
BookingsRouter.delete("/:id",authorizeAdmin,DeleteBookings);