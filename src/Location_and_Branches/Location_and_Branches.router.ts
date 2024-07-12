import { Hono } from "hono";
  import { ListsLocation_and_Branchess, CreateLocation_and_Branches,
     GetLocation_and_BranchesById, UpdateLocation_and_Branches, DeleteLocation_and_Branches }from "./Location_and_Branches.controller";
import { LocationBranchesSchema } from "../validator";
import { zValidator } from "@hono/zod-validator";
export const Location_and_BranchesRouter = new Hono().basePath('/branchlocations')

Location_and_BranchesRouter.get("", ListsLocation_and_Branchess);
Location_and_BranchesRouter.get("/:id", GetLocation_and_BranchesById);
Location_and_BranchesRouter.post("/create",zValidator('json', LocationBranchesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),CreateLocation_and_Branches);
Location_and_BranchesRouter.put("/:id", UpdateLocation_and_Branches);
Location_and_BranchesRouter.delete("/:id", DeleteLocation_and_Branches);