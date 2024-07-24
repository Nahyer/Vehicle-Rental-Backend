import { pgTable, serial, text, varchar, integer, primaryKey, timestamp, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import {  relations } from "drizzle-orm";
import { number } from "zod";


export const locationsBranches = pgTable("locations_branches", {
    location_id: serial('location_id').primaryKey(),
    name: varchar('name').notNull(),
    address: text('address').notNull(),
    contact_phone: varchar('contact_phone').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const locationsBranchesRelations = relations(locationsBranches, ({many})=>({
    bookings: many(bookings)
}))

export const payments = pgTable("payments", {
    payment_id: serial('payment_id').primaryKey(),
    booking_id: integer('booking_id').notNull().references(()=>bookings.booking_id,{onDelete: 'cascade'}),
    amount: decimal('amount').notNull(),
    payment_status: varchar('payment_status').notNull(),
    payment_date: timestamp('payment_date').defaultNow(),
    payment_method: varchar('payment_method').notNull(),
    transaction_id: varchar('transaction_id').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const paymentsRelations = relations(payments, ({one})=>({
    bookings: one(bookings,{
        fields: [payments.booking_id],
        references: [bookings.booking_id]
    })
}))

export const status_enum = pgEnum("status_enum", ["pending","confirmed", "cancelled"])
export const bookings = pgTable("bookings", {
    booking_id: serial('booking_id').primaryKey(),
    user_id: integer('user_id').notNull().references(()=>users.user_id,{onDelete: 'cascade'}),
    vehicle_id: integer('vehicle_id').notNull().references(()=>vehicles.vehicle_id,{onDelete: 'cascade'}),
    location_id: integer('location_id').notNull().references(()=>locationsBranches.location_id,{onDelete: 'cascade'}),
    booking_date: timestamp('booking_date').defaultNow(),
    return_date: timestamp('return_date').defaultNow(),
    total_amount: decimal('total_amount').notNull(),
    // booking_status: status_enum('booking_status').default('pending'),
    booking_status: varchar('booking_status').default('pending'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const bookingsRelations = relations(bookings, ({one,many})=>({
    users: one(users,{
        fields: [bookings.user_id],
        references: [users.user_id]
    }),
    vehicles: one(vehicles,{
        fields: [bookings.vehicle_id],
        references: [vehicles.vehicle_id]
    }),
    locationsBranches: one(locationsBranches,{
        fields: [bookings.location_id],
        references: [locationsBranches.location_id]
    }),
    payments: many(payments)
}))

export const vehicles = pgTable("vehicles", {
    vehicle_id: serial('vehicle_id').primaryKey(),
    vehicleSpec_id: integer('vehicleSpec_id').notNull().references(()=>vehicleSpecs.vehicleSpec_id,{onDelete: 'cascade'}),
    rental_rate: integer('rental_rate').notNull(),
    availability: boolean('availability').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const vehiclesRelations = relations(vehicles, ({one,many})=>({
    vehicleSpecs: one(vehicleSpecs,{
        fields: [vehicles.vehicleSpec_id],
        references: [vehicleSpecs.vehicleSpec_id]
    }),
    fleetManagement: many(fleetManagement),
    bookings: many(bookings)
}))

export const vehicleSpecs = pgTable("vehicleSpecs", {
    vehicleSpec_id: serial('vehicleSpec_id').primaryKey(),
    manufacturer: varchar('manufacturer').notNull(),
    model: varchar('model').notNull(),
    year: integer('year').notNull(),
    fuel_type: varchar('fuel_type').notNull(),
    engine_capacity: integer('engine_capacity').notNull(),
    transmission: varchar('transmission').notNull(),
    seating_capacity: integer('seating_capacity').notNull(),
    color: varchar('color').notNull(),
    features: text('features').notNull(),
    image_url: text('image_url')
})

export const vehicleSpecsRelations = relations(vehicleSpecs, ({many})=>({
    vehicles: many(vehicles)
}))
    
export const fleetManagement = pgTable("fleet_management", {
    fleet_id: serial('fleet_id').primaryKey(),
    vehicle_id: integer('vehicle_id').notNull().references(()=>vehicles.vehicle_id,{onDelete: 'cascade'}),
    acquisition_date: timestamp('acquisition_date').defaultNow(),
    depreciation_rate: decimal('depreciation_rate').notNull(),
    current_value: decimal('current_value').notNull(),
    maintenance_cost: decimal('maintenance_cost').notNull(),
    status: varchar('status').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const fleetManagementRelations = relations(fleetManagement, ({one})=>({
    vehicles: one(vehicles,{
        fields: [fleetManagement.vehicle_id],
        references: [vehicles.vehicle_id]
    })
}))
export const active_enum = pgEnum("active_enum", ["active", "inactive"])
export const users = pgTable("users", {
    user_id: serial('user_id').primaryKey(),
    full_name: varchar('full_name').notNull(),
    email: varchar('email').notNull().unique(),
    contact_phone: varchar('contact_phone').notNull(),
    address: varchar('address').notNull(),
    status: active_enum('status').default('active'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
    //profilePicture
})

export const usersRelations = relations(users, ({one,many})=>({
    bookings: many(bookings),
    customerSupportTickets: many(customerSupportTickets),
    authentication: one(authentication,{
        fields: [users.user_id],
        references: [authentication.user_id]
    
    })
}))


export const customerSupportTickets = pgTable("customer_support_tickets", {
    ticket_id: serial('ticket_id').primaryKey(),
    user_id: integer('user_id').notNull().references(()=>users.user_id,{onDelete: 'cascade'}),
    subject: varchar('subject').notNull(),
    description: text('description').notNull(),
    status: varchar('status').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const customerSupportTicketsRelations = relations(customerSupportTickets, ({one})=>({
    users: one(users,{
        fields: [customerSupportTickets.user_id],
        references: [users.user_id]
    })
}))

export const role_enum = pgEnum("role_enum", ["admin", "customer_support", "customer"])
export const authentication = pgTable("authentication", {
    auth_id: serial('auth_id').primaryKey(),
    user_id: integer('user_id').notNull().references(()=>users.user_id,{onDelete: 'cascade'}),
    username: varchar('username').notNull().unique(),
    role: role_enum('role').default('customer'),
    password: varchar('password').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
})

export const authenticationRelations = relations(authentication, ({one})=>({
    users: one(users,{
        fields: [authentication.user_id],
        references: [users.user_id]
    })
}))

export type TILocationBranches = typeof locationsBranches.$inferInsert
export type TSLocationBranches = typeof locationsBranches.$inferSelect

export type TIPayments = typeof payments.$inferInsert
export type TSPayments = typeof payments.$inferSelect

export type TIBookings = typeof bookings.$inferInsert
export type TSBookings = typeof bookings.$inferSelect

export type TIVehicles = typeof vehicles.$inferInsert
export type TSVehicles = typeof vehicles.$inferSelect

export type TIVehicleSpecs = typeof vehicleSpecs.$inferInsert
export type TSVehicleSpecs = typeof vehicleSpecs.$inferSelect

export type TIFleetManagement = typeof fleetManagement.$inferInsert
export type TSFleetManagement = typeof fleetManagement.$inferSelect

export type TIUser = typeof users.$inferInsert
export type TSUser = typeof users.$inferSelect

export type TICustomerSupportTickets = typeof customerSupportTickets.$inferInsert
export type TSCustomerSupportTickets = typeof customerSupportTickets.$inferSelect

export type TIAuthentication = typeof authentication.$inferInsert
export type TSAuthentication = typeof authentication.$inferSelect

