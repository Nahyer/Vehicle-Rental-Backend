import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authSchema, loginSchema } from "../validator";
import { signInUser, signUpUser } from "./auth.contoller";

export const authRouter = new Hono().basePath('/auth')

authRouter.post('/register', zValidator('json', authSchema,(result,c)=>{
    if(!result.success) return c.json(result.error,400)
}), signUpUser)

authRouter.post('/login', zValidator('json',loginSchema,(result,c)=>{
    if(!result.success) return c.json(result.error,400)
}), signInUser)
