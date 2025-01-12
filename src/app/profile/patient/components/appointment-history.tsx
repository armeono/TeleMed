"use client";

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
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  appointmentHistory: PatientAppointmentDB[];
};

export function AppointmentHistory({ appointmentHistory }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDownload = (href: string) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = `report-${new Date().toISOString()}.pdf`;
    link.click();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Report</TableHead>
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
                <TableCell>
                  {appointment.reportUrl ? (
                    <Button
                      onClick={() =>
                        handleDownload(appointment.reportUrl as string)
                      }
                    >
                      Download
                    </Button>
                  ) : (
                    <p>No report</p>
                  )}
                </TableCell>
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
