const fs = require("fs");
const path = require("path");

const baseDir = "./src";
const folders = [
  "Users",
  "Vehicles",
  "Vehicle_Specifications",
  "Bookings",
  "Payments",
  "Authentication",
  "Customer_Support_Tickets",
  "Location_and_Branches",
  "Fleet_Management",
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

folders.forEach((folder) => {
  const folderPath = path.join(baseDir, folder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const httpFilePath = path.join(folderPath, `get${folder}Request.http`);
  const httpContent = `
GET http://localhost:3000/${folder}
###

GET http://localhost:3000/${folder}?limit=2
###

GET http://localhost:3000/${folder}/13
###

POST http://localhost:3000/${folder}/create
Content-Type: application/json

{
  "name": "Sample Name",
  "code": "Sample Code",
  "city": "Sample City"
}
###

PUT http://localhost:3000/${folder}/1
Content-Type: application/json

{
  "name": "Updated Name",
  "code": "Updated Code",
  "city": "Updated City"
}
###

DELETE http://localhost:3000/${folder}/12
`;
  const serviceFilePath = path.join(folderPath, `${folder}.service.ts`);
  const serviceContent = `import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TI${capitalizeFirstLetter(folder)}, TS${capitalizeFirstLetter(folder)}, ${folder} } from "../drizzle/schema";

export const get${capitalizeFirstLetter(
    folder
  )}sService = async (limit?: number): Promise<TS${capitalizeFirstLetter(
    folder
  )}[] | null> => {
  if (limit) {
   return await db.query.${folder}.findMany({
    limit: limit,
  });
  }
  return await db.query.${folder}.findMany();
};
export const get${capitalizeFirstLetter(
    folder
  )}ByIdService = async (id: number): Promise<TS${capitalizeFirstLetter(
    folder
  )} | undefined> => {
  return await db.query.${folder}.findFirst({
   where: eq(${folder}.id,id)
  })
}

export const create${capitalizeFirstLetter(
    folder
  )}Service = async (${folder}s: TI${capitalizeFirstLetter(
    folder
  )}) => {
  await db.insert(${folder}).values(${folder}s)
  return \`${capitalizeFirstLetter(folder)}, has been created\`;
}

export const update${capitalizeFirstLetter(
    folder
  )}Service = async (id: number, ${capitalizeFirstLetter(
    folder
  )}: TI${capitalizeFirstLetter(folder)}) => {

  await db.update(${folder}).set(${capitalizeFirstLetter(folder)})
  .where(eq(${folder}.id, id))
  return \`${capitalizeFirstLetter(
    folder
  )}, has been updated successfully\`
}

export const Delete${capitalizeFirstLetter(
    folder
  )}ByIdService = async (id: number) =>{
  //query the ${folder} table and delete the ${folder} with the id
  const del${capitalizeFirstLetter(
    folder
  )} = await db.query.${folder}.findFirst({
  where: eq(${folder}.id, id)
  })
  await db.delete(${folder}).where(eq(${folder}.id, id))
  return \`${capitalizeFirstLetter(
    folder
  )}, has been deleted successfully\`
}`;
  const controllerFilePath = path.join(folderPath, `${folder}.controller.ts`);
  const controllerContent = `import { Context } from "hono";

import { get${capitalizeFirstLetter(folder)}sService, create${capitalizeFirstLetter(folder)}Service, get${capitalizeFirstLetter(folder)}ByIdService, update${capitalizeFirstLetter(folder)}Service, Delete${folder}ByIdService } from "./${folder}.service";


export const Lists${capitalizeFirstLetter(
    folder
  )}s = async(c: Context) => {
  try {           
    const limit = Number(c.req.query('limit')) 
    const data = await get${capitalizeFirstLetter(
          folder
        )}sService(limit);
    if(!data || data.length == 0) return c.text("No data found" , 404);
    return c.json(data, 200);
  } catch (error: any) {
    return c.json({ message: error.message },400);
  }
}

export const Get${capitalizeFirstLetter(
    folder
  )}ById = async(c: Context) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const ${folder} = await get${capitalizeFirstLetter(
    folder
  )}ByIdService(id);
    if(!${folder}) return c.json({ message: "${folder} not found"},404);
    return c.json(${folder});
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const Create${capitalizeFirstLetter(
    folder
  )} = async(c: Context) => {
  try {
    const ${folder} = await c.req.json();
    ${folder}.created_at = new Date();
    const new${capitalizeFirstLetter(
          folder
        )} = await create${capitalizeFirstLetter(
    folder
  )}Service(${folder});
    if(!new${capitalizeFirstLetter(
          folder
        )}) return c.json({ message: "Unable to create"},404);
    return c.json(new${capitalizeFirstLetter(folder)}, 201);
  } catch (error: any) {
    return c.json({ error: error.message },400);
  }
   
}

export const Update${capitalizeFirstLetter(
    folder
  )} = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    const U${folder} = await get${capitalizeFirstLetter(
    folder
  )}ByIdService(id);
    if (!U${folder}) return c.text("${capitalizeFirstLetter(
    folder
  )} not found", 404);
    const ${folder} = await c.req.json();
    ${folder}.updated_at = new Date();
    const up${capitalizeFirstLetter(
          folder
        )} = await update${capitalizeFirstLetter(
    folder
  )}Service(id, ${folder});
    if (!up${capitalizeFirstLetter(
          folder
        )}) return c.text("${capitalizeFirstLetter(
    folder
  )} not updated", 404);
    return c.json(up${capitalizeFirstLetter(folder)}, 201);

  } catch (error: any) {
    return c.json({ message: error.message });
  }
}

export const Delete${capitalizeFirstLetter(
    folder
  )} = async(c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
  const D${capitalizeFirstLetter(
      folder
    )} = await get${capitalizeFirstLetter(folder)}ByIdService(id);
  if (!D${capitalizeFirstLetter(
      folder
    )}) return c.text("${capitalizeFirstLetter(
    folder
  )} not found", 404);
    const del${capitalizeFirstLetter(
          folder
        )} = await Delete${capitalizeFirstLetter(
    folder
  )}ByIdService(id);
    if (!del${capitalizeFirstLetter(
          folder
        )}) return c.text("${capitalizeFirstLetter(
    folder
  )} not deleted", 404);
    return c.json(del${capitalizeFirstLetter(folder)}, 201);
  } catch (error: any) {
    return c.json({ message: error.message });
  }
}`;
  const routerFilePath = path.join(folderPath, `${folder}.router.ts`);
  const routerContent = `import { Hono } from "hono";
  import { Lists${capitalizeFirstLetter(folder)}s, Create${capitalizeFirstLetter(folder)},
     Get${capitalizeFirstLetter(folder)}ById, Update${capitalizeFirstLetter(folder)}, Delete${capitalizeFirstLetter(folder)} from "./${folder}.controller";
import { ${folder}Schema } from "../validator";
import { zValidator } from "@hono/zod-validator";
export const ${folder}Router = new Hono().basePath('/${folder}')

${folder}Router.get("", Lists${capitalizeFirstLetter(
    folder
  )}s);
${folder}Router.get("/:id", Get${capitalizeFirstLetter(
    folder
  )}ById);
${folder}Router.post("/create",zValidator('json', ${folder}Schema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400)
  }
}),Create${capitalizeFirstLetter(folder)});
${folder}Router.put("/:id", Update${capitalizeFirstLetter(
    folder
  )});
${folder}Router.delete("/:id", Delete${capitalizeFirstLetter(
    folder
  )});
`;

  if (!fs.existsSync(serviceFilePath)) {
    fs.writeFileSync(serviceFilePath, serviceContent.trim(), "utf8");
  }

  if (!fs.existsSync(controllerFilePath)) {
    fs.writeFileSync(controllerFilePath, controllerContent.trim(), "utf8");
  }

  if (!fs.existsSync(routerFilePath)) {
    fs.writeFileSync(routerFilePath, routerContent.trim(), "utf8");
  }

  if (!fs.existsSync(httpFilePath)) {
    fs.writeFileSync(httpFilePath, httpContent.trim(), "utf8");
  }
});

console.log("Folders and files created successfully.");
