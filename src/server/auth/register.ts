"use server";
import { db } from "@/db/drizzle";
import {
  doctorsTable,
  patientOnDoctorTable,
  patientsTable,
  usersTable,
} from "@/db/schema";
import { AreaEnum } from "../types/enums";
import bcrypt from "bcrypt";

export type RegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: any;
  area: keyof typeof AreaEnum;
  gender: "MALE" | "FEMALE";
  phone: string;
};

export type DoctorRegisterType = RegisterType & {
  licenseNumber: string;
  role: "DOCTOR";
};

export type PatientRegisterType = RegisterType & {
  medicalId: string;
  role: "PATIENT";
};

export const action_register = async (
  data: DoctorRegisterType | PatientRegisterType
) => {
  try {
    console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const response = await db.transaction(async (tx) => {
      const newUser = await tx
        .insert(usersTable)
        .values({ ...data, password: hashedPassword })
        .returning();

      if (data.role === "DOCTOR") {
        await tx.insert(doctorsTable).values({
          userId: newUser[0].id,
          medicalLicense: data.licenseNumber,
        });
      } else {
        const newPatient = await tx
          .insert(patientsTable)
          .values({
            userId: newUser[0].id,
            medicalId: data.medicalId,
          })
          .returning();

        await tx.insert(patientOnDoctorTable).values({
          patientId: newPatient[0].id,
          doctorId: 1,
        });
      }

      return newUser;
    });

    if (response) {
      return {
        status: "success",
        message: "You have successfully registered.",
      };
    }
  } catch (error) {
    console.log(error);

    return {
      status: "error",
      message: "An error occurred while registering. Please try again.",
    };
  }
};
