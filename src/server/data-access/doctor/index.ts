import { doctorsTable } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export const db_getDoctorInfo = async (userId: number) => {
  try {
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.userId, userId),
    });

    return doctor;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const db_getAvailableDoctors = async () => {
  try {
    const doctors = await db.query.doctorsTable.findMany({
      with: { user: true },
    });

    if (!doctors) {
      return [];
    }

    return doctors;
  } catch (error) {
    console.log(error);
    return [];
  }
};
