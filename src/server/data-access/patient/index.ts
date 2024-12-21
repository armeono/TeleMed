import { db } from "@/db/drizzle";
import { patientOnDoctorTable, patientsTable } from "@/db/schema";
import { toPatientsDto } from "@/server/dto/patient";
import { eq } from "drizzle-orm";

export const db_getPatientsByDoctorId = async (doctorId: number) => {
  try {
    const patients = await db.query.patientOnDoctorTable.findMany({
      where: eq(patientOnDoctorTable.doctorId, doctorId),
      with: {
        patient: {
          with: {
            user: true,
          },
        },
      },
    });

    return patients.map((patient) => toPatientsDto(patient));
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const db_getPatientInfoById = async (patientId: number) => {
  try {
    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, patientId),
      with: {
        user: true,
      },
    });

    if (!patient) throw new Error("Patient not found!");

    return patient;
  } catch (error) {
    console.log(error);
  }
};
