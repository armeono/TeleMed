"use server";

import { cookies } from "next/headers";

export const action_deleteCookie = async (name: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  } catch (error) {
    console.log(error);
  }
};
