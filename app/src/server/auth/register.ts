"use server";
import { db } from "@/db/drizzle";
import { doctorsTable, patientsTable, usersTable } from "@/db/schema";
import { AreaEnum } from "../types/enums";

export type RegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: any;
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
    const response = await db.transaction(async (tx) => {
      const newUser = await db
        .insert(usersTable)
        .values({ ...data })
        .returning();

      if (data.role === "DOCTOR") {
        await db.insert(doctorsTable).values({
          userId: newUser[0].id,
          medicalLicense: data.licenseNumber,
        });
      } else {
        await db.insert(patientsTable).values({
          userId: newUser[0].id,
          medicalId: data.medicalId,
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
