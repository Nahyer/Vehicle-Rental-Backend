import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import { authentication, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export type TAuthUser = {
    fullname: string;
    email: string;
    contactPhone: string;
    address: string;
    userId: number;
    username: string;
    password: string;
    role: "admin" | "customer_support" | "customer";
}


export const createAuthUserService = async (user: TAuthUser): Promise<string | null> => {
    const userExists = await db.query.authentication.findFirst({
        where: sql`${authentication.username}= ${user.username}`
    })
    if (userExists) {
        return "User already exists"
    }
    await db.insert(users).values({
        full_name: user.fullname,
        email: user.email,
        contact_phone: user.contactPhone,
        address: user.address
    })
    const userId = await getUserAService(user)
    if (!userId) return "User not found"

    await db.insert(authentication).values({
        user_id: userId.user_id,
        username: user.username,
        password: user.password,
        created_at: new Date(),
    });

    return "User created successfully"
}
export const loginAuthUserService = async (user: TAuthUser) => {
    const { username } = user

    return await db.query.authentication.findFirst({
        columns: {
            username: true,
            user_id: true,
            password: true,
            role: true
        
        },
        where: sql`${authentication.username} = ${username}`,
        with: {
            users: {
                columns: {
                    user_id: true,
                    full_name: true,
                    email: true,
                    contact_phone: true,
                    address: true

                }
            }
        }
    })
}

export const getUserAService = async (user: TAuthUser) => {

    return await db.query.users.findFirst({
        columns: {
            user_id: true
        },
        where: eq(users.full_name, user.fullname) && eq(users.email, user.email)
    })
}