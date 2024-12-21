"use server";
import { db } from "@/db/drizzle";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export type LoginType = {
  email: string;
  password: string;
};

export const action_login = async (data: LoginType) => {
  try {
    const cookieStore = await cookies();

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, data.email),
    });

    if (!user) {
      return {
        status: "error",
        message: "User with this email does not exist!",
      };
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        status: "error",
        message: "Invalid password!",
      };
    }

    cookieStore.set({
      name: "user",
      value: JSON.stringify({
        id: user.id,
        email: user.email,
      }),
    });

    return {
      status: "success",
      message: "Welcome to TeleMed!",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Invalid email or password!",
    };
  }
};
