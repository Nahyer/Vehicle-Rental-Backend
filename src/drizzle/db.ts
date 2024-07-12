import "dotenv/config";
// import { drizzle } from "drizzle-orm/node-postgres/driver";
// import { Client } from "pg";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";


//*localPG
// export const client = new Client({
//     connectionString: process.env.DATABASE_URL!,   
// })

// const main = async () => {
//     await client.connect();  //connect to the database
// }
// main();

// const db = drizzle(client, { schema, logger: true }) 


export const sql = neon(process.env.DATABASE_URL as string) //*neon
const db = drizzle(sql, { schema, logger: true }) 


export default db; 