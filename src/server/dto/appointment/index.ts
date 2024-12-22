import { AppointmentDB } from "@/server/data-access/appointments/types";

export const toAppointmentDto = (appointment: AppointmentDB) => {
  return {
    ...appointment,
  };
};
