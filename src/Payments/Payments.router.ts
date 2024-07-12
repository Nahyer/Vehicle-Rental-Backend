import { Hono } from "hono";
  import { ListsPaymentss, CreatePayments,
     GetPaymentsById, UpdatePayments, DeletePayments,
     HandleWebhook,
     CheckOut} from "./Payments.controller";
import { PaymentDetailsSchema, PaymentsSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";


export const PaymentsRouter = new Hono().basePath('/payments')

PaymentsRouter.get("/", ListsPaymentss);
PaymentsRouter.get("/:id", GetPaymentsById);
PaymentsRouter.post("/create",zValidator('json', PaymentsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreatePayments);
PaymentsRouter.put("/:id", UpdatePayments);
PaymentsRouter.delete("/:id", DeletePayments);
PaymentsRouter.post("/webhook",HandleWebhook)
PaymentsRouter.post("/checkout",zValidator('json', PaymentDetailsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}), CheckOut);
