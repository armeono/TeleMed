import { db } from "@/db/drizzle";
import { appointmentsTable } from "@/db/schema";
import { toAppointmentDto } from "@/server/dto/appointment";
import { and, eq } from "drizzle-orm";

export const db_getPatientAppointments = async (patientId: number) => {
  try {
    const appointments = await db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.patientId, patientId),
        eq(appointmentsTable.status, "SCHEDULED")
      ),
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

export const db_getDoctorAppointments = async (doctorId: number) => {
  try {
    try {
      const appointments = await db.query.appointmentsTable.findMany({
        where: and(
          eq(appointmentsTable.doctorId, doctorId),
          eq(appointmentsTable.status, "SCHEDULED")
        ),
      });

      if (!appointments) {
        return [];
      }

      return appointments.map((appointment) => toAppointmentDto(appointment));
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
