import { Context } from "hono";

import { getVehiclessService, createVehiclesService, getVehiclesByIdService, updateVehiclesService, DeleteVehiclesByIdService, getAvailableVehiclesService } from "./Vehicles.service";
import { TSVehicles } from "../drizzle/schema";


export const ListsVehicless = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit'))
    let data:TSVehicles[] | null;
    const available = c.req.url.endsWith('/available');
    console.log("🚀 ~ ListsVehicless ~ available:", available);
    
    available ?  data = await getAvailableVehiclesService(limit) : data = await getVehiclessService(limit)
    if(!data || data.length == 0) return c.json("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetVehiclesById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID hh", 400);
    const Vehicles = await getVehiclesByIdService(id);
    if(!Vehicles) return c.json({ message: "Vehicles not found"},404);
    return c.json(Vehicles);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreateVehicles = async(c: Context) => {
  try {
    const Vehicles = await c.req.json();
    Vehicles.created_at = new Date();
    const newVehicles = await createVehiclesService(Vehicles);
    if(!newVehicles) return c.json({ message: "Unable to create"},404);
    return c.json(newVehicles, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const UpdateVehicles = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const UVehicles = await getVehiclesByIdService(id);
    if (!UVehicles) return c.text("Vehicles not found", 404);
    const Vehicles = await c.req.json();
    Vehicles.updated_at = new Date();
    const upVehicles = await updateVehiclesService(id, Vehicles);
    if (!upVehicles) return c.text("Vehicles not updated", 404);
    return c.json(upVehicles, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeleteVehicles = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DVehicles = await getVehiclesByIdService(id);
  if (!DVehicles) return c.text("Vehicles not found", 404);
    const delVehicles = await DeleteVehiclesByIdService(id);
    if (!delVehicles) return c.text("Vehicles not deleted", 404);
    return c.json(delVehicles, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}