"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Divide, MoreVertical, PlusCircle } from "lucide-react";
import ScheduleModal from "./components/schedule-modal";
import { useState } from "react";
import { PatientAppointmentDB } from "@/server/data-access/appointments/types";
import { DoctorDto } from "@/server/dto/doctor";

type Props = {
  appointments: PatientAppointmentDB[];
  availableDoctors: DoctorDto[];
  patientId: number;
};

const PatientAppointments = ({
  appointments,
  availableDoctors,
  patientId,
}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between py-4 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">
                    Dr.{" "}
                    {appointment.doctor.user.firstName +
                      " " +
                      appointment.doctor.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.appointmentTime}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      appointment.type === "ONLINE" ? "secondary" : "outline"
                    }
                  >
                    {appointment.type}
                  </Badge>
                  <div>
                    <MoreVertical className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-[200px] flex justify-center items-center">
              <p className="text-muted-foreground text-center">
                No upcoming appointments
              </p>
            </div>
          )}
        </ScrollArea>

        <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
          <DialogTrigger className="w-full">
            <Button className="w-full mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ScheduleModal
              onClose={() => setIsDialogOpen(false)}
              isOpen={isDialogOpen}
              availableDoctors={availableDoctors}
              patientId={patientId}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientAppointments;
