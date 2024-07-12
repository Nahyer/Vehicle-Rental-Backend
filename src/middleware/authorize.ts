import "dotenv/config"
import { Context, Next} from "hono"
import { validateJWT } from "oslo/jwt";
import { secret } from "../Authentication/auth.contoller";
export interface ITokenPayload {
    userId: number;
    username: string;
    role: "admin" | "customer";
}

export const verifyToken = async (token: string) => {
    console.log("🚀 ~ verifyToken ~ token:", token)
    try{
        
        // const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        console.log("🚀 ~ verifyToken ~ secret:", secret)
        
        return await validateJWT("HS256",secret, token);
    }catch(e: any){
        return null;
    }
}

export const authorize = async (c: Context, next: Next, requiredRole: string) => {
    const token = c.req.header("Authorization");
    console.log("🚀 ~ authorize ~ token:", token)
    if(!token)return c.json({error:"No token provided"}, 401);
    const decoded = await verifyToken(token);
    console.log("🚀 ~ authorize ~ decoded:", decoded)
    if(!decoded)return c.json({error:"Invalid token"}, 401);
    const {role} = decoded.payload as ITokenPayload;
    if(role === requiredRole || role === "admin"  ){
        return next();      
    }
    return c.json({error:"Unauthorized"}, 401);
}

export const authorizeAdmin = async (c: Context, next: Next) => await authorize(c, next, "admin");

export const authorizeCustomer = async (c: Context, next: Next) => await authorize(c, next, "customer");