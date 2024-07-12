import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIVehicleSpecs, TSVehicleSpecs, vehicleSpecs } from "../drizzle/schema";

export const getVehicle_SpecificationssService = async (limit?: number): Promise<TSVehicleSpecs[] | null> => {
  if (limit) {
   return await db.query.vehicleSpecs.findMany({
    limit: limit,
  });
  }
  return await db.query.vehicleSpecs.findMany();
};
export const getVehicle_SpecificationsByIdService = async (id: number): Promise<TSVehicleSpecs | undefined> => {
  return await db.query.vehicleSpecs.findFirst({
   where: eq(vehicleSpecs.vehicleSpec_id,id)
  })
}

export const createVehicle_SpecificationsService = async (vspecs: TIVehicleSpecs) => {
  await db.insert(vehicleSpecs).values(vspecs)
  return `$Vehicle ${vspecs.model}, has been created`;
}

export const updateVehicle_SpecificationsService = async (id: number, vspecs: TIVehicleSpecs) => {

  await db.update(vehicleSpecs).set(vspecs)
  .where(eq(vehicleSpecs.vehicleSpec_id, id))
  return `Vehicle ${vspecs.model},, has been updated successfully`
}

export const DeleteVehicle_SpecificationsByIdService = async (id: number) =>{
  //query the vehicleSpecs table and delete the vehicleSpecs with the id
  const delVehicle_Specifications = await db.query.vehicleSpecs.findFirst({
  where: eq(vehicleSpecs.vehicleSpec_id, id)
  })
  await db.delete(vehicleSpecs).where(eq(vehicleSpecs.vehicleSpec_id, id))
  return `vehicleSpecs, has been deleted successfully`
}