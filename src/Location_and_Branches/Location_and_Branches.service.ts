import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TILocationBranches, TSLocationBranches, locationsBranches } from "../drizzle/schema";

export const getLocation_and_BranchessService = async (limit?: number): Promise<TSLocationBranches[] | null> => {
  if (limit) {
   return await db.query.locationsBranches.findMany({
    limit: limit,
  });
  }
  return await db.query.locationsBranches.findMany();
};
export const getLocation_and_BranchesByIdService = async (id: number): Promise<TSLocationBranches | undefined> => {
  return await db.query.locationsBranches.findFirst({
   where: eq(locationsBranches.location_id,id)
  })
}

export const createLocation_and_BranchesService = async (Location_and_Branchess: TILocationBranches) => {
  await db.insert(locationsBranches).values(Location_and_Branchess)
  return `Location_and_Branches, has been created`;
}

export const updateLocation_and_BranchesService = async (id: number, Location_and_Branches: TILocationBranches) => {

  await db.update(locationsBranches).set(Location_and_Branches)
  .where(eq(locationsBranches.location_id, id))
  return `Location_and_Branches, has been updated successfully`
}

export const DeleteLocation_and_BranchesByIdService = async (id: number) =>{
  //query the Location_and_Branches table and delete the Location_and_Branches with the id
  const delLocation_and_Branches = await db.query.locationsBranches.findFirst({
  where: eq(locationsBranches.location_id, id)
  })
  await db.delete(locationsBranches).where(eq(locationsBranches.location_id, id))
  return `Location_and_Branches, has been deleted successfully`
}