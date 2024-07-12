import { Context } from "hono";

import { getFleet_ManagementsService, createFleet_ManagementService, getFleet_ManagementByIdService, updateFleet_ManagementService, DeleteFleet_ManagementByIdService } from "./Fleet_Management.service";


export const ListsFleet_Managements = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await getFleet_ManagementsService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetFleet_ManagementById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const Fleet_Management = await getFleet_ManagementByIdService(id);
    if(!Fleet_Management) return c.json({ message: "Fleet_Management not found"},404);
    return c.json(Fleet_Management);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreateFleet_Management = async(c: Context) => {
  try {
    const Fleet_Management = await c.req.json();
    Fleet_Management.created_at = new Date();
    const newFleet_Management = await createFleet_ManagementService(Fleet_Management);
    if(!newFleet_Management) return c.json({ message: "Unable to create"},404);
    return c.json(newFleet_Management, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const UpdateFleet_Management = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const UFleet_Management = await getFleet_ManagementByIdService(id);
    if (!UFleet_Management) return c.text("Fleet_Management not found", 404);
    const Fleet_Management = await c.req.json();
    Fleet_Management.updated_at = new Date();
    const upFleet_Management = await updateFleet_ManagementService(id, Fleet_Management);
    if (!upFleet_Management) return c.text("Fleet_Management not updated", 404);
    return c.json(upFleet_Management, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeleteFleet_Management = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DFleet_Management = await getFleet_ManagementByIdService(id);
  if (!DFleet_Management) return c.text("Fleet_Management not found", 404);
    const delFleet_Management = await DeleteFleet_ManagementByIdService(id);
    if (!delFleet_Management) return c.text("Fleet_Management not deleted", 404);
    return c.json(delFleet_Management, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}