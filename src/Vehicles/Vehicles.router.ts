import { Hono } from "hono";
  import { ListsVehicless, CreateVehicles,
     GetVehiclesById, UpdateVehicles, DeleteVehicles} from "./Vehicles.controller";
import { VehiclesSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
export const VehiclesRouter = new Hono().basePath('/vehicles')

VehiclesRouter.get("", ListsVehicless);
VehiclesRouter.get("/:id", GetVehiclesById);
VehiclesRouter.post("/create",zValidator('json', VehiclesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateVehicles);
VehiclesRouter.put("/:id", UpdateVehicles);
VehiclesRouter.delete("/:id", DeleteVehicles);