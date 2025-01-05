"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Link as LinkIcon,
  MapPin,
  MoreVertical,
  PlusCircle,
  Video,
} from "lucide-react";
import ScheduleModal from "./components/schedule-modal";
import { useState } from "react";
import {
  DoctorAppointmentDB,
  PatientAppointmentDB,
} from "@/server/data-access/appointments/types";
import { DoctorDto } from "@/server/dto/doctor";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import Link from "next/link";
import {
  action_cancelAppointment,
  action_resolveAppointment,
} from "@/server/actions/appointments";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<PatientAppointmentDB | null>(null);

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

  return (
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
                    <span className="font-medium">Doctor:</span>
                    <span className="col-span-3">
                      {selectedAppointment.doctor.user.firstName +
                        " " +
                        selectedAppointment.doctor.user.lastName}
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
                    <span className="col-span-3">
                      {selectedAppointment.type}
                    </span>
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
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientAppointments;
