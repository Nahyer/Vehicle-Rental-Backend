import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ListsUserss,
    GetUsersById, UpdateUsers, DeleteUsers,
    UpdateUserRole,
    CreateUsers} from "./user.contoller";

import { authorizeAdmin, authorizeCustomer, } from "../middleware/authorize";

export const userRouter = new Hono().basePath('/users')

userRouter.get('/',authorizeAdmin,ListsUserss)
userRouter.get('/:id',authorizeCustomer, GetUsersById)
userRouter.put('/update/:id',authorizeCustomer, UpdateUsers)
userRouter.delete('/:id',authorizeAdmin, DeleteUsers)
userRouter.put('/roleupdate/:id',authorizeAdmin, UpdateUserRole)
userRouter.post('/create',authorizeAdmin, CreateUsers)