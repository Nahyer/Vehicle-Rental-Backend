import { Hono } from "hono";
  import { ListsVehicless, CreateVehicles,
     GetVehiclesById, UpdateVehicles, DeleteVehicles} from "./Vehicles.controller";
import { VehiclesSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { authorizeAdmin, authorizeCustomer } from "../middleware/authorize";
export const VehiclesRouter = new Hono().basePath('/vehicles')

VehiclesRouter.get("", ListsVehicless);
VehiclesRouter.get("/available",authorizeCustomer, ListsVehicless);
VehiclesRouter.get("/:id", GetVehiclesById);
VehiclesRouter.post("/create",authorizeAdmin,zValidator('json', VehiclesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateVehicles);
VehiclesRouter.put("/:id",authorizeAdmin, UpdateVehicles);
VehiclesRouter.delete("/:id",authorizeAdmin, DeleteVehicles);


