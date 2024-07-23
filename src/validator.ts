import {date, z } from 'zod';
import { payments } from './drizzle/schema';

export const authSchema = z.object({
    fullname: z.string(),
    email: z.string().email(),
    contactPhone: z.string(),
    address: z.string(),
    username: z.string(),
    password: z.string()
})

export const loginSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const updateRoleSchema = z.object({
    username: z.string(),
    role: z.string()
})

export const BookingsSchema = z.object({
    user_id: z.number(),
    vehicle_id: z.number(),
    location_id: z.number(),
    booking_date: z.string(),
    return_date: z.string(),
    total_amount: z.number()
})

export const CustomerSupportTicketSchema = z.object({
    user_id: z.number(),
    subject: z.string(),
    description: z.string(),
    status: z.string()
})
//Vehicle_SpecificationsSchema
export const VehicleSpecSchema = z.object({
    manufacturer: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.number(),
    transmission: z.string(),
    seating_capacity: z.number(),
    color: z.string(),
    features: z.string(),
    rental_rate: z.number()   
})

export const LocationBranchesSchema = z.object({
    name: z.string(),
    address: z.string(),
    contact_phone: z.string()
})

// Fleet_ManagementSchema
export const Fleet_ManagementSchema = z.object({
    vehicle_id: z.number(),
    acquisition_date: z.string(),
    depreciation_rate: z.number(),
    current_value: z.number(),
    maintenance_cost: z.number(),
    status: z.string()
})

// payments
export const PaymentsSchema = z.object({
    booking_id: z.number(),
    amount: z.number(),
    payment_status: z.string(),
    payment_date: z.string(),
    payment_method: z.string(),
    transaction_id: z.string()
})

//vehicle
export const VehiclesSchema = z.object({
    vehicleSpec_id: z.number(),
    rental_rate: z.number(),
    availability: z.boolean()
})

export const PaymentDetailsSchema = z.object({
    amount: z.number(),
    bookingId: z.number(),
    vehicleSpecs: z.string()
})