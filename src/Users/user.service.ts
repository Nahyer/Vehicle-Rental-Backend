import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TAuthUser } from "../Authentication/auth.service";
import { TIUser, TSUser,authentication,users} from "../drizzle/schema";


export const getUsersService = async(limit?:number):Promise<TSUser[] | null> =>{
    if(limit){
        return await db.query.users.findMany({
            limit:limit
        })
    }
    return await db.query.users.findMany()
}

export const getUsersByIdService = async (id: number): Promise<TSUser | undefined> => {
  return await db.query.users.findFirst({
     where: eq(users.user_id,id),
    with: {
      authentication: {
        columns: {
          username: true,
          role: true
        }
      }
    }})

}

export const updateUserService = async (id: number, user: TIUser) => {
  await db.update(users).set(user).where(eq(users.user_id, id))
  return `${user.full_name} updated successfull`;
}

export const DeleteUsersByIdService = async (id: number) =>{
  //query the users table and delete the users with the id
  const delUsers = await db.query.users.findFirst({
    where: eq(users.user_id, id)
  })
    await db.delete(users).where(eq(users.user_id, id))
    return `${delUsers?.full_name}, has been deleted successfully`
}

export const updateUserRoleService = async (id: number, user: TAuthUser) => {
    const {username,role} = user
    await db.update(authentication).set({
      role: role
    }).where(eq(authentication.user_id, id))
  
  return `${username}, has been updated to ${role}successfully`
}
