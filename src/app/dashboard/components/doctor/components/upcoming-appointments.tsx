"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Calendar,
  Clock,
  Divide,
  MapPin,
  MoreVertical,
  PlusCircle,
  Video,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";
import { DoctorAppointmentDB } from "@/server/data-access/appointments/types";
import { DoctorDto } from "@/server/dto/doctor";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  action_cancelAppointment,
  action_resolveAppointment,
} from "@/server/actions/appointments";

type Props = {
  appointments: DoctorAppointmentDB[];
};

const PatientAppointments = ({ appointments }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointmentDB | null>(null);

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsOpen(true);
  };

  const handleCancelAppointment = async (id: number) => {
    const response = await action_cancelAppointment(id);

    if (response.status === "error") {
      toast({
        title: "Failed to cancel appointment!",
        description: response.message,
      });
    } else {
      toast({
        title: "Successfully canceled appointment!",
        description: response.message,
      });
    }

    router.refresh();
    setIsOpen(false);
  };

  const handleResolveAppointment = async (id: number) => {
    const response = await action_resolveAppointment(id);

    if (response.status === "error") {
      toast({
        title: "Failed to resolve appointment!",
        description: response.message,
      });
    } else {
      toast({
        title: "Successfully resolved appointment!",
        description: response.message,
      });
    }

    router.refresh();
    setIsOpen(false);
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between py-4 border-b last:border-0 hover:cursor-pointer hover:bg-gray-100 px-2"
                  onClick={() => handleAppointmentClick(appointment)}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  Review the appointment information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Patient:</span>
                  <span className="col-span-3">
                    {selectedAppointment.patient.user.firstName +
                      " " +
                      selectedAppointment.patient.user.lastName}
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="col-span-3">
                    {dayjs(selectedAppointment.appointmentTime).format(
                      "MMMM D, YYYY"
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="col-span-3">
                    {dayjs(selectedAppointment.appointmentTime).format(
                      "h:mm A"
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  {selectedAppointment.type === "IN_PERSON" ? (
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Video className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="col-span-3">{selectedAppointment.type}</span>
                </div>
                {selectedAppointment.type === "ONLINE" ? (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Link
                      href={selectedAppointment.roomUrl!}
                      className="col-span-3 text-blue-500 underline"
                    >
                      Click here to join call
                    </Link>
                  </div>
                ) : null}
                <Separator />
                <div className="grid grid-cols-4 items-center gap-4">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="col-span-3">
                    {selectedAppointment.reason ?? "No reason provided"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleCancelAppointment(selectedAppointment.id)
                  }
                >
                  Cancel Appointment
                </Button>
                <Button
                  onClick={() =>
                    handleResolveAppointment(selectedAppointment.id)
                  }
                >
                  Resolve Appointment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointments;
