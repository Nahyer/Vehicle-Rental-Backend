import { Context } from "hono";

import { getBookingssService, createBookingsService, getBookingsByIdService, updateBookingsService, DeleteBookingsByIdService, getBookingsByUserIdService } from "./Bookings.service";


export const ListsBookingss = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await getBookingssService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetBookingsById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const Bookings = await getBookingsByUserIdService(id);
    if(!Bookings) return c.json({ message: "Bookings not found"},404);
    return c.json(Bookings);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreateBookings = async(c: Context) => {
  try {
    const Bookings = await c.req.json();
    console.log("🚀 ~ CreateBookings ~ Bookings:", Bookings)
    const newBookings = await createBookingsService(Bookings);
    if(!newBookings) return c.json({ message: "Unable to create"},404);
    return c.json(newBookings, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const UpdateBookings = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const UBookings = await getBookingsByIdService(id);
    if (!UBookings) return c.text("Bookings not found", 404);
    const Bookings = await c.req.json();
    Bookings.updated_at = new Date();
    const upBookings = await updateBookingsService(id, Bookings);
    if (!upBookings) return c.text("Bookings not updated", 404);
    return c.json(upBookings, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeleteBookings = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DBookings = await getBookingsByIdService(id);
  if (!DBookings) return c.text("Bookings not found", 404);
    const delBookings = await DeleteBookingsByIdService(id);
    if (!delBookings) return c.text("Bookings not deleted", 404);
    return c.json(delBookings, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}