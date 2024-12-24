"use server";

import { db } from "@/db/drizzle";
import { appointmentsTable } from "@/db/schema";
import { toAppointmentDto } from "@/server/dto/appointment";
import { and, eq, gte, lt } from "drizzle-orm";
import { generateTimeSlots } from "./utils";

export const db_getPatientAppointments = async (patientId: number) => {
  try {
    const appointments = await db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.patientId, patientId),
        eq(appointmentsTable.status, "SCHEDULED")
      ),
      with: {
        doctor: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!appointments) {
      return [];
    }

    return appointments.map((appointment) => toAppointmentDto(appointment));
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const db_getDoctorAvailableAppointmentSlots = async (
  doctorId: number,
  selectedDate: Date
) => {
  try {
    try {
      const allTimeSlots = generateTimeSlots("08:00", "16:00", 30);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0); // 00:00:00

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999); // 23:59:59

      const appointments = await db.query.appointmentsTable.findMany({
        where: and(
          eq(appointmentsTable.doctorId, doctorId),
          eq(appointmentsTable.status, "SCHEDULED"),
          gte(appointmentsTable.appointmentTime, startOfDay.toISOString()),
          lt(appointmentsTable.appointmentTime, endOfDay.toISOString())
        ),
      });

      if (!appointments || appointments.length === 0) {
        return allTimeSlots.map((slot) => {
          return {
            time: slot,
            available: true,
          };
        });
      }

      const bookedSlots = appointments.map((appointment) =>
        new Date(appointment.appointmentTime).toTimeString().slice(0, 5)
      );

      const availableSlots = allTimeSlots.filter(
        (slot) => !bookedSlots.includes(slot)
      );

      return [
        ...availableSlots.map((slot) => {
          return {
            time: slot,
            available: true,
          };
        }),
        ...bookedSlots.map((slot) => {
          return {
            time: slot,
            available: false,
          };
        }),
      ].sort(
        (a, b) => a.time.localeCompare(b.time) - b.time.localeCompare(a.time)
      );
    } catch (error) {
      console.log(error);

      return [];
    }
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const db_getDoctorAppointments = async (doctorId: number) => {
  try {
    const appointments = await db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.doctorId, doctorId),
        eq(appointmentsTable.status, "SCHEDULED")
      ),
      with: {
        patient: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!appointments) {
      return [];
    }

    return appointments.map((appointment) => toAppointmentDto(appointment));
  } catch (error) {
    console.log(error);
    return [];
  }
};
