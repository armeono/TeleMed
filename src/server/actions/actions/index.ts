import { db } from "@/db/drizzle";

export type ScheduleAppointment = {
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  reason: string;
  type: "IN_PERSON" | "ONLINE";
};

export const action_scheduleAppointment = async (data: any) => {
  try {
    const response = await db.transaction(async (tx) => {});
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to schedule appointment!",
    };
  }
};
