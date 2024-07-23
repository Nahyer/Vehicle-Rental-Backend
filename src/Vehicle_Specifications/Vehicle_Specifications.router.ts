import { Hono } from "hono";
  import { ListsVehicle_Specificationss, CreateVehicle_Specifications,
     GetVehicle_SpecificationsById, UpdateVehicle_Specifications, DeleteVehicle_Specifications} from "./Vehicle_Specifications.controller";
import { VehicleSpecSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
export const Vehicle_SpecificationsRouter = new Hono().basePath('/vehiclespecs')

Vehicle_SpecificationsRouter.get("", ListsVehicle_Specificationss);
Vehicle_SpecificationsRouter.get("/:id", GetVehicle_SpecificationsById);
Vehicle_SpecificationsRouter.post("/create",zValidator('json', VehicleSpecSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateVehicle_Specifications);
Vehicle_SpecificationsRouter.put("/:id", UpdateVehicle_Specifications);
Vehicle_SpecificationsRouter.delete("/:id", DeleteVehicle_Specifications);