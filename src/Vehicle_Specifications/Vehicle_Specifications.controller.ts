import { Context } from "hono";

import { getVehicle_SpecificationssService, createVehicle_SpecificationsService, getVehicle_SpecificationsByIdService, updateVehicle_SpecificationsService, DeleteVehicle_SpecificationsByIdService } from "./Vehicle_Specifications.service";
import { infer, z } from "zod";
import { VehicleSpecSchema, VehiclesSchema } from "../validator";
import { createVehiclesService } from "../Vehicles/Vehicles.service";
import { spec } from "node:test/reporters";


export const ListsVehicle_Specificationss = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await getVehicle_SpecificationssService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const GetVehicle_SpecificationsById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const Vehicle_Specifications = await getVehicle_SpecificationsByIdService(id);
    if(!Vehicle_Specifications) return c.json({ message: "Vehicle_Specifications not found"},404);
    return c.json(Vehicle_Specifications);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const CreateVehicle_Specifications = async(c: Context) => {
  let specsId : {specId:number}[] |null = [];
  try {
    const vehicleSpecs:z.infer<typeof VehicleSpecSchema> = await c.req.json();
    
     specsId = await createVehicle_SpecificationsService(vehicleSpecs);
    if(!specsId) return c.json({ message: "Unable to create"},404);

    const newVehicle:z.infer<typeof VehiclesSchema> ={
      vehicleSpec_id: specsId[0].specId,
      rental_rate:vehicleSpecs.rental_rate,
      availability:true

    }
    console.log("🚀 ~ constCreateVehicle_Specifications=async ~ newVehicle:", newVehicle)

    const newVehicleId = await createVehiclesService(newVehicle);
    if (!newVehicleId) return c.json({ message: "Unable to create"},
    404);
    
    
    return c.json('Vehicle Created Successfully', 201);
  } catch (error: any) {
    specsId && await DeleteVehicle_SpecificationsByIdService(specsId[0].specId);
    return c.json({ error:error },400);
  }
   
}

export const UpdateVehicle_Specifications = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const UVehicle_Specifications = await getVehicle_SpecificationsByIdService(id);
    if (!UVehicle_Specifications) return c.text("Vehicle_Specifications not found", 404);
    const Vehicle_Specifications = await c.req.json();
    Vehicle_Specifications.updated_at = new Date();
    const upVehicle_Specifications = await updateVehicle_SpecificationsService(id, Vehicle_Specifications);
    if (!upVehicle_Specifications) return c.text("Vehicle_Specifications not updated", 404);
    return c.json(upVehicle_Specifications, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const DeleteVehicle_Specifications = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const DVehicle_Specifications = await getVehicle_SpecificationsByIdService(id);
  if (!DVehicle_Specifications) return c.text("Vehicle_Specifications not found", 404);
    const delVehicle_Specifications = await DeleteVehicle_SpecificationsByIdService(id);
    if (!delVehicle_Specifications) return c.text("Vehicle_Specifications not deleted", 404);
    return c.json(delVehicle_Specifications, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}