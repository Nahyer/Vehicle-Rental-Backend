import {Hono}from "hono"
import { generateSignature } from "./upload.controller" 

export const uploadRouter = new Hono().basePath('/upload')

uploadRouter.post("/", generateSignature)

