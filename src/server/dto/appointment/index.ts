import dayjs from "dayjs";

export const toAppointmentDto = (appointment: any) => {
  return {
    ...appointment,
    appointmentTime: dayjs(new Date(appointment.appointmentTime)).format(
      "MMMM D, YYYY h:mm A"
    ),
  };
};
