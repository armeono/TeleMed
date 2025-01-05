import { redirect } from "next/navigation";
import PatientProfileClient from "./page-client";
import { db_getPatientInfoByUserId } from "@/server/data-access/patient";
import { cookies } from "next/headers";
import { db_getPatientAppointmentHistory } from "@/server/data-access/appointments";

export default async function PatientProfile() {
  const cookieStore = await cookies();

  const userCookie: any = cookieStore.get("user")?.value!;

  if (!userCookie) redirect("/login");

  const parsedCookie = JSON.parse(userCookie);

  if (!parsedCookie) redirect("/login");

  const patientData = await db_getPatientInfoByUserId(parsedCookie.id);

  if (!patientData) redirect("/dashboard");

  const appointmentHistory = await db_getPatientAppointmentHistory(
    patientData.id
  );

  return (
    <PatientProfileClient
      id={patientData.id}
      appointmentHistory={appointmentHistory}
    />
  );
}
