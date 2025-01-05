import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db_getPatientAppointmentHistory } from "@/server/data-access/appointments";
import dayjs from "dayjs";
import { PatientAppointmentDB } from "@/server/data-access/appointments/types";

type Props = {
  appointmentHistory: PatientAppointmentDB[];
};

export function AppointmentHistory({ appointmentHistory }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointmentHistory.length > 0 ? (
            appointmentHistory.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {dayjs(appointment.appointmentTime).format("MMMM D, YYYY")}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {dayjs(appointment.appointmentTime).format("h:mm A")}
                  </span>
                </TableCell>
                <TableCell>
                  {"Dr. " +
                    appointment.doctor?.user.firstName +
                    " " +
                    appointment.doctor?.user.lastName}
                </TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "COMPLETED"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <div>No appointment history!</div>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
