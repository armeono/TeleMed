import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const db_getUser = async (id: number) => {
  try {
    console.log("id", id);
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });

    if (!user) throw new Error("User not found!");

    return user;
  } catch (error) {
    console.log(error);
  }
};
