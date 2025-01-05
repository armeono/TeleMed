"use server";

import { db } from "@/db/drizzle";
import { appointmentsTable } from "@/db/schema";
import { headers } from "next/headers";
import axios from "axios";
import { eq } from "drizzle-orm";

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

    let roomUrl: string | null = null;

    if (data.type === "ONLINE") {
      const dailyResponse = await axios.post(
        `${process.env.DAILY_CO_API_URL}/rooms`,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.DAILY_CO_API_KEY}`,
          },
        }
      );

      if (!dailyResponse.data.url) throw new Error("Failed to create room!");

      roomUrl = dailyResponse.data.url;
    }

    const response = await db.transaction(async (tx) => {
      const appointment = await tx
        .insert(appointmentsTable)
        .values({
          status: "SCHEDULED",
          patientId: data.patientId,
          doctorId: data.doctorId,
          appointmentTime: appointmentDateTime.toISOString(),
          roomUrl: roomUrl,
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

export const action_cancelAppointment = async (id: number) => {
  try {
    const response = await db
      .update(appointmentsTable)
      .set({
        status: "CANCELED",
      })
      .where(eq(appointmentsTable.id, id))
      .returning();

    if (!response) throw new Error("Failed to cancel appointment!");

    if (response[0].type === "ONLINE") {
      const roomUrl = response[0].roomUrl;

      const roomName = roomUrl!.split("https://telemed-ka.daily.co/")[1];

      await axios.delete(`${process.env.DAILY_CO_API_URL}/rooms/${roomName}`, {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_CO_API_KEY}`,
        },
      });
    }

    return {
      status: "success",
      message: "Appointment cancelled successfully!",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to cancel appointment!",
    };
  }
};

export const action_resolveAppointment = async (id: number) => {
  try {
    const response = await db
      .update(appointmentsTable)
      .set({
        status: "COMPLETED",
      })
      .where(eq(appointmentsTable.id, id))
      .returning();

    if (!response) throw new Error("Failed to resolve appointment!");

    if (response[0].type === "ONLINE") {
      const roomUrl = response[0].roomUrl;

      const roomName = roomUrl!.split("https://telemed-ka.daily.co/")[1];

      await axios.delete(`${process.env.DAILY_CO_API_URL}/rooms/${roomName}`, {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_CO_API_KEY}`,
        },
      });
    }

    return {
      status: "success",
      message: "Appointment resolved successfully!",
    };
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "Failed to resolve appointment!",
    };
  }
};
