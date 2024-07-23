import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIVehicles, TSVehicles, vehicles } from "../drizzle/schema";
import { z } from "zod";
import { VehiclesSchema } from "../validator";

export const getVehiclessService = async (limit?: number): Promise<TSVehicles[] | null> => {
  if (limit) {
    return await db.query.vehicles.findMany({
      limit: limit,
    });
  }
  return await db.query.vehicles.findMany({
    with: {
      vehicleSpecs: {
        columns: {
          vehicleSpec_id: true,
          manufacturer: true,
          model: true,
          year: true,
          features: true,
          seating_capacity: true,
          engine_capacity: true,
        }
      }
    }
  });
};
export const getAvailableVehiclesService = async (limit?: number): Promise<TSVehicles[] | null> => {
  if (limit) {
    return await db.query.vehicles.findMany({
      where: eq(vehicles.availability, true),
      limit: limit,
      with: {
        vehicleSpecs: {
          columns: {
            vehicleSpec_id: true,
            manufacturer: true,
            model: true,
            year: true,
            fuel_type: true,
            engine_capacity: true,
            transmission: true,
            seating_capacity: true,
            color: true,
            features: true
          }
        }
      }
    })
  }
  return await db.query.vehicles.findMany({
    where: eq(vehicles.availability, true),
    with: {
      vehicleSpecs: {
        columns: {
          vehicleSpec_id: true,
          manufacturer: true,
          model: true,
          year: true,
          fuel_type: true,
          engine_capacity: true,
          transmission: true,
          seating_capacity: true,
          color: true,
          features: true
        }
      }
    }
  })
}

export const getVehiclesByIdService = async (id: number): Promise<TSVehicles | undefined> => {
  return await db.query.vehicles.findFirst({
    where: eq(vehicles.vehicle_id, id),
    with: {
      vehicleSpecs: {
        columns: {
          vehicleSpec_id: true,
          manufacturer: true,
          model: true,
          year: true,
          fuel_type: true,
          engine_capacity: true,
          transmission: true,
          seating_capacity: true,
          color: true,
          features: true
        }
      }
    }
  })
}

export const createVehiclesService = async (Vehicless: z.infer<typeof VehiclesSchema>) => {
  await db.insert(vehicles).values(Vehicless)
  return `Vehicles, has been created`;
}

export const updateVehiclesService = async (id: number, Vehicles: TIVehicles) => {

  await db.update(vehicles).set(Vehicles)
    .where(eq(vehicles.vehicle_id, id))
  return `Vehicles, has been updated successfully`
}

export const DeleteVehiclesByIdService = async (id: number): Promise<string> => {
  //query the Vehicles table and delete the Vehicles with the id
  const delVehicles = await db.query.vehicles.findFirst({
    where: eq(vehicles.vehicle_id, id)
  })
  await db.delete(vehicles).where(eq(vehicles.vehicle_id, id))
  return `Vehicles, has been deleted successfully`
}