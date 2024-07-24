import { Hono } from "hono";
  import { ListsBookingss, CreateBookings,
     GetBookingsById, UpdateBookings, DeleteBookings} from "./Bookings.controller";
import { BookingsSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
export const BookingsRouter = new Hono().basePath('/bookings')

BookingsRouter.get("", ListsBookingss);
BookingsRouter.get("/:id", GetBookingsById);
BookingsRouter.post("/add",zValidator('json', BookingsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateBookings);
BookingsRouter.put("/:id", UpdateBookings);
BookingsRouter.delete("/:id", DeleteBookings);