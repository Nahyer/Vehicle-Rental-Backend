import "dotenv/config"
import { Context, Next} from "hono"
import { verify } from "hono/jwt";


export interface ITokenPayload {
    userId: number;
    username: string;
    role: "admin" | "customer";
}


export const authorize = async (c: Context, next: Next, requiredRole: string) => {
    const token = c.req.header("Authorization");
    console.log("🚀 ~ authorize ~ token:", token)
    if(!token)return c.json({error:"No token provided"}, 401);
    const decoded = await verify(token, process.env.JWT_SECRET as string);
    console.log("🚀 ~ authorize ~ decoded:", decoded)

    if(!decoded)return c.json({error:"Invalid token"}, 401);
    // if (!decoded.payload) return c.json({ error: "Invalid payload" }, 401);
    const {role} = decoded
    if(role === requiredRole || role === "admin"  ){
        return next();      
    }
    return c.json({error:"Unauthorized"}, 401);
}

export const authorizeAdmin = async (c: Context, next: Next) => await authorize(c, next, "admin");

export const authorizeCustomer = async (c: Context, next: Next) => await authorize(c, next, "customer");