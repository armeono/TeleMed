import DoctorDashboard from "./components/doctor";
import PatientDashboard from "./components/patient";

const Dashboard = () => {
  const userRole = "DOCTOR";

  return userRole === "DOCTOR" ? <DoctorDashboard /> : <PatientDashboard />;
};

export default Dashboard;
