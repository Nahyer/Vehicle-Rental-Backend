import "dotenv/config";
import bcrypt from 'bcrypt';
import { sign } from "hono/jwt";
import { Context } from "hono";
import {
	loginAuthUserService,
	createAuthUserService,
} from "./auth.service";


export const signUpUser = async (c: Context) => {
	try {
		const user = await c.req.json();
        user.username = user.username.toLowerCase();
		//if email exists, return 400       
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(user.password, salt);
		user.password = hashedPass;
		const cUser = await createAuthUserService(user);
		if (!cUser) return c.json({ message: "User not created" }, 400);
		return c.json(cUser, 201);
	} catch (e: any) {
		return c.json(e.message, 400);
	}
};

export const signInUser = async (c: Context) => {
    try {
        const user = await c.req.json();
        const lUser = await loginAuthUserService(user);
        if (!lUser) return c.json({ message: "User not found" }, 404);

        const verifai = bcrypt.compareSync(user.password,lUser.password );
        console.log("🚀 ~ signInUser ~ verifai:", verifai)
        if (!verifai) return c.json({ error: "Invalid Credetials" }, 401);
        const payload = {
            userId: lUser.user_id,
            username: lUser.username,
            role: lUser.role,
        };
        let secret = process.env.JWT_SECRET as string; 
        const token = await sign(payload, secret); 
        const uUser = lUser.users;
        const role = lUser.role;
        const username = lUser.username;

        return c.json({ token, user: { ...uUser, role,username } }, 200);
    } catch (e: any) {
        return c.json(e.message, 400);
    }
};
