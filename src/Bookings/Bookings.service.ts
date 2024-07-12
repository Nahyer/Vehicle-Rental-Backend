import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIBookings, TSBookings, bookings } from "../drizzle/schema";

export const getBookingssService = async (limit?: number): Promise<TSBookings[] | null> => {
  if (limit) {
   return await db.query.bookings.findMany({
    limit: limit,
  });
  }
  return await db.query.bookings.findMany();
};
export const getBookingsByIdService = async (id: number): Promise<TSBookings | undefined> => {
  return await db.query.bookings.findFirst({
   where: eq(bookings.booking_id,id)
  })
}

export const createBookingsService = async (booking: TIBookings): Promise<{ booking_id: number }[]|null> => {
  booking.created_at = new Date();
  booking.booking_date = new Date(booking.booking_date!);
  booking.return_date = new Date(booking.return_date!);
  booking.booking_status = 'pending';
  console.log("🚀 ~ createBookingsService ~ booking",typeof(booking.total_amount))
  return await db.insert(bookings).values(booking).returning({
    booking_id: bookings.booking_id});
}

export const updateBookingsService = async (id: number, booking: Partial<TIBookings>) => {

  await db.update(bookings).set(booking)
  .where(eq(bookings.booking_id, id))
  return `Booking, has been updated successfully`
}

export const DeleteBookingsByIdService = async (id: number) =>{
  const delBookings = await db.query.bookings.findFirst({
  where: eq(bookings.booking_id, id)
  })
  await db.delete(bookings).where(eq(bookings.booking_id, id))
  return `Bookings, has been deleted successfully`
}