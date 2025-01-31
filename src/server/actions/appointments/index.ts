"use server";

import { db } from "@/db/drizzle";
import { appointmentsTable } from "@/db/schema";
import axios from "axios";
import { eq } from "drizzle-orm";
import { supabase } from "@/db/supabase-storage";
import { action_sendEmailAfterAppointment } from "../mail";
import { action_sendEmailAfterAppointment_cancled } from "../mail/cancle";

export type ScheduleAppointment = {
  patientId: number;
  doctorId: number;
  date: Date;
  time: string;
  reason: string;
  type: "IN_PERSON" | "ONLINE";
  symptoms?: string;
  files?: File[];
};

export const action_scheduleAppointment = async (data: ScheduleAppointment) => {
  try {
    const appointmentDateTime = new Date(data.date);

    const [hours, minutes] = data.time.split(":").map(Number);
    appointmentDateTime.setHours(hours + 1, minutes, 0, 0);

    let roomUrl: string | null = null;

    console.log(data);

    if (data.type === "ONLINE") {
      const dailyResponse = await axios.post(
        `${process.env.DAILY_CO_API_URL!}/rooms`,
        {},
        {
          headers: {
            Authorization: `Bearer ${process.env.DAILY_CO_API_KEY!}`,
          },
        }
      );

      if (!dailyResponse.data.url) throw new Error("Failed to create room!");
      roomUrl = dailyResponse.data.url;
    }

    // Upload files to Supabase bucket
    const uploadedFiles = await Promise.all(
      (data.files || []).map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;

        try {
          const data = await supabase.storage
            .from("appointment_patient_uploads")
            .upload(fileName, file);

          if (data.error) {
            console.error("Failed to upload file:", data.error.message);
            throw new Error("Failed to upload file to Supabase storage.");
          }

          return {
            fileName,
            fileUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/appointment_patient_uploads/${fileName}`,
          };
        } catch (error) {
          console.log(error);

          throw new Error("Failed to upload file to Supabase storage.");
        }
      })
    );

    // Insert appointment into the database
    const response = await db
      .insert(appointmentsTable)
      .values({
        status: "SCHEDULED",
        patientId: data.patientId,
        doctorId: data.doctorId,
        appointmentTime: appointmentDateTime.toISOString(),
        roomUrl,
        type: data.type,
        symptoms: data.symptoms || null,
        uploadedFiles,
        reason: data.reason,
      })
      .returning();

    if (!response) throw new Error("Failed to schedule appointment!");

    return {
      status: "success",
      message: "Appointment scheduled successfully!",
    };
  } catch (error) {
    console.error("Error scheduling appointment:", error);

    return {
      status: "error",
      message: "Failed to schedule appointment!",
    };
  }
};

// export const action_cancelAppointment = async (id: number) => {
//   try {
//     const response = await db
//       .update(appointmentsTable)
//       .set({
//         status: "CANCELED",
//       })
//       .where(eq(appointmentsTable.id, id))
//       .returning();

//     if (!response) throw new Error("Failed to cancel appointment!");

//     if (response[0].type === "ONLINE") {
//       const roomUrl = response[0].roomUrl;

//       const roomName = roomUrl!.split("https://telemed-ka.daily.co/")[1];

//       await axios.delete(`${process.env.DAILY_CO_API_URL}/rooms/${roomName}`, {
//         headers: {
//           Authorization: `Bearer ${process.env.DAILY_CO_API_KEY}`,
//         },
//       });
//     }

//     return {
//       status: "success",
//       message: "Appointment cancelled successfully!",
//     };
//   } catch (error) {
//     console.log(error);

//     return {
//       status: "error",
//       message: "Failed to cancel appointment!",
//     };
//   }
// };

export const action_cancelAppointment = async (id: number) => {
  try {
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, id),
      with: {
        patient: {
          with: {
            user: true,
          },
        },
        doctor: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!appointment) throw new Error("Appointment not found!");

    // Update the appointment status to "CANCELED"
    const response = await db
      .update(appointmentsTable)
      .set({
        status: "CANCELED",
      })
      .where(eq(appointmentsTable.id, id))
      .returning();

    if (!response) throw new Error("Failed to cancel appointment!");

    // If the appointment is an online appointment, delete the associated room
    if (response[0].type === "ONLINE") {
      const roomUrl = response[0].roomUrl;

      if (roomUrl) {
        const roomName = roomUrl.split("https://telemed-ka.daily.co/")[1];

        await axios.delete(
          `${process.env.DAILY_CO_API_URL}/rooms/${roomName}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.DAILY_CO_API_KEY}`,
            },
          }
        );
      }
    }

    // Send email notification to the doctor and patient
    await action_sendEmailAfterAppointment_cancled({
      doctorMail: appointment.doctor!.user.email,
      patientMail: appointment.patient!.user.email,
    });

    return {
      status: "success",
      message: "Appointment cancelled successfully!",
    };
  } catch (error) {
    console.error("Error canceling appointment:", error);

    return {
      status: "error",
      message: "Failed to cancel appointment!",
    };
  }
};

const patient = {
  name: "John Doe",
  age: 32,
  email: "john.doe@example.com",
};

const doctor = {
  name: "Dr. Jane Smith",
  specialization: "Cardiology",
  email: "jane.smith@telemed.com",
};

const diagnosis =
  "Mild hypertension with a recommendation for lifestyle changes.";
const prescription =
  "1. Amlodipine 5mg once daily\n2. Regular exercise (30 minutes/day)\n3. Follow-up in 1 month.";

export const action_resolveAppointment = async (
  id: number,
  feedback: string,
  file: any
) => {
  try {
    const appointment = await db.query.appointmentsTable.findFirst({
      where: eq(appointmentsTable.id, id),
      with: {
        patient: {
          with: {
            user: true,
          },
        },
        doctor: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!appointment) throw new Error("Appointment not found!");

    const fileName = `${appointment.id}-${new Date().toISOString()}.pdf`;

    const data = await supabase.storage
      .from("appointment-reports")
      .upload(fileName, file, {
        duplex: "half",
        contentType: "application/pdf",
      });

    if (data.error) {
      console.log(data.error);
      throw new Error("Failed to upload file to Supabase storage");
    }

    const response = await db
      .update(appointmentsTable)
      .set({
        status: "COMPLETED",
        feedback: feedback,
        reportUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/appointment-reports/${fileName}`,
      })
      .where(eq(appointmentsTable.id, appointment.id))
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

    await action_sendEmailAfterAppointment({
      doctorMail: appointment.doctor!.user.email,
      patientMail: appointment.patient!.user.email,
      feedback: feedback,
    });

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
