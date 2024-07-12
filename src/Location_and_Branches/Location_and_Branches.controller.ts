import { Context } from "hono";

import { getLocation_and_BranchessService, createLocation_and_BranchesService, getLocation_and_BranchesByIdService, updateLocation_and_BranchesService, DeleteLocation_and_BranchesByIdService } from "./Location_and_Branches.service";


export const ListsLocation_and_Branchess = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await getLocation_and_BranchessService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetLocation_and_BranchesById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const Location_and_Branches = await getLocation_and_BranchesByIdService(id);
    if(!Location_and_Branches) return c.json({ message: "Location_and_Branches not found"},404);
    return c.json(Location_and_Branches);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreateLocation_and_Branches = async(c: Context) => {
  try {
    const Location_and_Branches = await c.req.json();
    Location_and_Branches.created_at = new Date();
    const newLocation_and_Branches = await createLocation_and_BranchesService(Location_and_Branches);
    if(!newLocation_and_Branches) return c.json({ message: "Unable to create"},404);
    return c.json(newLocation_and_Branches, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const UpdateLocation_and_Branches = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const ULocation_and_Branches = await getLocation_and_BranchesByIdService(id);
    if (!ULocation_and_Branches) return c.text("Location_and_Branches not found", 404);
    const Location_and_Branches = await c.req.json();
    Location_and_Branches.updated_at = new Date();
    const upLocation_and_Branches = await updateLocation_and_BranchesService(id, Location_and_Branches);
    if (!upLocation_and_Branches) return c.text("Location_and_Branches not updated", 404);
    return c.json(upLocation_and_Branches, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeleteLocation_and_Branches = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DLocation_and_Branches = await getLocation_and_BranchesByIdService(id);
  if (!DLocation_and_Branches) return c.text("Location_and_Branches not found", 404);
    const delLocation_and_Branches = await DeleteLocation_and_BranchesByIdService(id);
    if (!delLocation_and_Branches) return c.text("Location_and_Branches not deleted", 404);
    return c.json(delLocation_and_Branches, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}