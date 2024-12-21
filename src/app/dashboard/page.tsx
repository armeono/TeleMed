import { cookies } from "next/headers";
import DoctorDashboard from "./components/doctor";
import PatientDashboard from "./components/patient";
import { redirect } from "next/navigation";
import { db_getUser } from "@/server/data-access/user/get-user";

const Dashboard = async () => {
  const cookieStore = await cookies();

  const userCookie: any = cookieStore.get("user")?.value!;

  if (!userCookie) redirect("/login");

  const parsedCookie = JSON.parse(userCookie);

  if (!parsedCookie) redirect("/login");

  const user = await db_getUser(parsedCookie.id!);

  if (!user) redirect("/login");

  return user.role === "DOCTOR" ? (
    <DoctorDashboard user={user} />
  ) : (
    <PatientDashboard user={user} />
  );
};

export default Dashboard;
