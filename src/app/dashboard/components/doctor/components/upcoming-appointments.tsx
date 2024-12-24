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
import { useState } from "react";
import { DoctorAppointmentDB } from "@/server/data-access/appointments/types";
import { DoctorDto } from "@/server/dto/doctor";

type Props = {
  appointments: DoctorAppointmentDB[];
};

const PatientAppointments = ({ appointments }: Props) => {
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
                    {appointment.patient.user.firstName +
                      " " +
                      appointment.patient.user.lastName}
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
      </CardContent>
    </Card>
  );
};

export default PatientAppointments;
