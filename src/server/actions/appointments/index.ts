"use server";

import { db } from "@/db/drizzle";
import { appointmentsTable } from "@/db/schema";

export type ScheduleAppointment = {
  patientId: number;
  doctorId: number;
  date: Date;
  time: string;
  reason: string;
  type: "IN_PERSON" | "ONLINE";
};

export const action_scheduleAppointment = async (data: any) => {
  try {
    const appointmentDateTime = new Date(data.date);

    const [hours, minutes] = data.time.split(":").map(Number);
    appointmentDateTime.setHours(hours + 1, minutes, 0, 0);

    const response = await db.transaction(async (tx) => {
      const appointment = await tx
        .insert(appointmentsTable)
        .values({
          status: "SCHEDULED",
          patientId: data.patientId,
          doctorId: data.doctorId,
          appointmentTime: appointmentDateTime.toISOString(),
          type: data.type,
        })
        .returning();

      return appointment[0];
    });

    if (!response) throw new Error("Failed to schedule appointment!");

    return {
      status: "success",
      message: "Appointment scheduled successfully!",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to schedule appointment!",
    };
  }
};
