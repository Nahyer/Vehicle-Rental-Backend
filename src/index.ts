import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"
import { logger } from 'hono/logger'
import {trimTrailingSlash} from "hono/trailing-slash";
import { authRouter } from './Authentication/auth.router';
import { userRouter } from './Users/users.router';
import { VehiclesRouter } from './Vehicles/Vehicles.router';
import { Vehicle_SpecificationsRouter } from './Vehicle_Specifications/Vehicle_Specifications.router';
import { PaymentsRouter } from './Payments/Payments.router';
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { Location_and_BranchesRouter } from './Location_and_Branches/Location_and_Branches.router';
import { BookingsRouter } from './Bookings/Bookings.router';
import { Fleet_ManagementRouter } from './Fleet_Management/Fleet_Management.router';



const app = new Hono({ strict: true})

app.use(csrf()) 
app.use('/*', cors())
app.use(logger()) 
app.use(trimTrailingSlash())

app.get('/', (c) => {
  return c.redirect('/api');
});
app.get('/api', (c) => {
  return c.json({message: "welcome"})
})

app.notFound((c) => {
  return c.text('Not Found', 404)
})

app.route('/api', authRouter) 
app.route('/api', userRouter)
app.route('/api', VehiclesRouter)
app.route('/api', Vehicle_SpecificationsRouter)
app.route('/api', PaymentsRouter)
app.route('/api', Location_and_BranchesRouter)
app.route('/api', BookingsRouter)
app.route('/api', PaymentsRouter)
app.route('/api', Fleet_ManagementRouter)


serve({
  fetch: app.fetch,
  port: Number(process.env.PORT),
})

console.log(`Server is running on port http://localhost:${process.env.PORT}`)