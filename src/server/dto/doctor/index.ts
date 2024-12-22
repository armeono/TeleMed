import { DoctorDB } from "@/server/data-access/doctor/types";
import { UserDB } from "@/server/data-access/user/types";

export interface DoctorDto extends DoctorDB {
  user: UserDB;
}

export const toDoctorDto = (doctor: DoctorDB) => {
  return {
    ...doctor,
  };
};
