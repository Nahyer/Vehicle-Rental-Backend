import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ListsUserss,
    GetUsersById, UpdateUsers, DeleteUsers,
    UpdateUserRole,
    CreateUsers} from "./user.contoller";

import { authorizeAdmin, authorizeCustomer, } from "../middleware/authorize";

export const userRouter = new Hono().basePath('/users')

userRouter.get('/',authorizeAdmin,ListsUserss)
userRouter.get('/:id', GetUsersById)
userRouter.put('/:id', UpdateUsers)
userRouter.delete('/:id', DeleteUsers)
userRouter.put('/roleupdate/:id', UpdateUserRole)
userRouter.post('/create', CreateUsers)