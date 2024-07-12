import "dotenv/config";
import { HMAC } from "oslo/crypto";
import { Context } from "hono";
import {
	loginAuthUserService,
	createAuthUserService,
} from "./auth.service";
import { Argon2id } from "oslo/password";
import { createJWT} from "oslo/jwt"
import { TimeSpan } from "oslo/.";

export let secret: ArrayBuffer;

(async () => {
    secret = await new HMAC("SHA-256").generateKey();
  })();

export const signUpUser = async (c: Context) => {
	try {
		const user = await c.req.json();
		const passwd = user.password;        
        const argon2id = new Argon2id();
		const hashedPassword = await argon2id.hash(passwd);
		user.password = hashedPassword;
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
        const verifai = new Argon2id().verify(lUser.password, user.password);
        if (!verifai) return c.json({ error: "Invalid Credetials" }, 401);


        
        const secretString = new TextDecoder().decode(secret);
        // process.env.JWT_SECRET = secretString;

        // console.log("🚀 ~ signInUser ~  process.env.JWT_SECRET:",  process.env.JWT_SECRET)
        console.log("🚀 ~ signInUser ~ secret:", secret)
        const payload = {
            userId: lUser.user_id,
            username: lUser.username,
            role: "customer",
        };
        const token = await createJWT("HS256", secret, payload, {
            includeIssuedTimestamp: true,
            expiresIn: new TimeSpan(1, "h"),
        });

        let uUser = lUser.users;
        let role = lUser.role;

        return c.json({ token, user: { ...uUser, role } }, 200);
    } catch (e: any) {
        return c.json(e.message, 400);
    }
};
