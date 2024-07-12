import { Hono } from "hono";
  import { ListsFleet_Managements, CreateFleet_Management,
     GetFleet_ManagementById, UpdateFleet_Management, DeleteFleet_Management}from "./Fleet_Management.controller";
import { Fleet_ManagementSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
export const Fleet_ManagementRouter = new Hono().basePath('/Fleet_Management')

Fleet_ManagementRouter.get("", ListsFleet_Managements);
Fleet_ManagementRouter.get("/:id", GetFleet_ManagementById);
Fleet_ManagementRouter.post("/create",zValidator('json', Fleet_ManagementSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateFleet_Management);
Fleet_ManagementRouter.put("/:id", UpdateFleet_Management);
Fleet_ManagementRouter.delete("/:id", DeleteFleet_Management);