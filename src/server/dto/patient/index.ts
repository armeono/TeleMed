import dayjs from "dayjs";

export const toPatientsDto = (data: any) => {
  return {
    ...data.patient,
    createdAt: dayjs(data.patient.createdAt).format("DD/MM/YYYY"),
  };
};
