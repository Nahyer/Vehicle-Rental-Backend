import { Hono } from "hono";
  import { ListsLocation_and_Branchess, CreateLocation_and_Branches,
     GetLocation_and_BranchesById, UpdateLocation_and_Branches, DeleteLocation_and_Branches }from "./Location_and_Branches.controller";
import { LocationBranchesSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
import { authorizeAdmin, authorizeCustomer } from "../middleware/authorize";
export const Location_and_BranchesRouter = new Hono().basePath('/branchlocations')

Location_and_BranchesRouter.get("",authorizeCustomer, ListsLocation_and_Branchess);
Location_and_BranchesRouter.get("/:id",authorizeAdmin, GetLocation_and_BranchesById);
Location_and_BranchesRouter.post("/add",authorizeAdmin,zValidator('json', LocationBranchesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateLocation_and_Branches);
Location_and_BranchesRouter.put("/:id",authorizeAdmin, UpdateLocation_and_Branches);
Location_and_BranchesRouter.delete("/:id",authorizeAdmin, DeleteLocation_and_Branches);