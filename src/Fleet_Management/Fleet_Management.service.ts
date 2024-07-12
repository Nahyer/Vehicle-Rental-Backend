import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIFleetManagement, TSFleetManagement, fleetManagement } from "../drizzle/schema";

export const getFleet_ManagementsService = async (limit?: number): Promise<TSFleetManagement[] | null> => {
  if (limit) {
   return await db.query.fleetManagement.findMany({
    limit: limit,
  });
  }
  return await db.query.fleetManagement.findMany();
};
export const getFleet_ManagementByIdService = async (id: number): Promise<TSFleetManagement | undefined> => {
  return await db.query.fleetManagement.findFirst({
   where: eq(fleetManagement.fleet_id,id)
  })
}

export const createFleet_ManagementService = async (Fleet_Managements: TIFleetManagement) => {
  await db.insert(fleetManagement).values(Fleet_Managements)
  return `Fleet_Management, has been created`;
}

export const updateFleet_ManagementService = async (id: number, Fleet_Management: TIFleetManagement) => {

  await db.update(fleetManagement).set(Fleet_Management)
  .where(eq(fleetManagement.fleet_id, id))
  return `Fleet_Management, has been updated successfully`
}

export const DeleteFleet_ManagementByIdService = async (id: number) =>{
  //query the Fleet_Management table and delete the Fleet_Management with the id
  const delFleet_Management = await db.query.fleetManagement.findFirst({
  where: eq(fleetManagement.fleet_id, id)
  })
  await db.delete(fleetManagement).where(eq(fleetManagement.fleet_id, id))
  return `Fleet_Management, has been deleted successfully`
}