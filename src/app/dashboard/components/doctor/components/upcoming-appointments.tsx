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
  Image as ImageIcon,
  Calendar,
  Clock,
  Divide,
  MapPin,
  MoreVertical,
  PlusCircle,
  Video,
  Link as LinkIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import MedicalReport from "@/lib/medical-report";
import { pdf } from "@react-pdf/renderer";
import { supabase } from "@/db/supabase-storage";

type Props = {
  appointments: DoctorAppointmentDB[];
};

const formSchema = z.object({
  feedback: z.string().min(1, "Feedback is required"),
});

const prescription =
  "1. Amlodipine 5mg once daily\n2. Regular exercise (30 minutes/day)\n3. Follow-up in 1 month.";

const PatientAppointments = ({ appointments }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointmentDB | null>(null);
  const [feedbackSubmission, setFeedbackSubmission] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: "",
    },
  });

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

  const onFormSubmit = async (formData: any) => {
    if (!selectedAppointment) return;

    const blob = await pdf(
      <MedicalReport
        patient={{
          name:
            selectedAppointment.patient.user.firstName +
            " " +
            selectedAppointment.patient.user.lastName,
          medicalId: selectedAppointment.patient.medicalId ?? "No ID provided",
          email: selectedAppointment.patient.user.email,
        }}
        doctor={{
          name:
            selectedAppointment.doctor.user.firstName +
            " " +
            selectedAppointment.doctor.user.lastName,
          specialization:
            selectedAppointment.doctor.specialization ?? "INTERNAL_MEDICINE",
          email: selectedAppointment.doctor.user.email,
        }}
        diagnosis={formData.feedback}
        prescription={prescription}
      />
    ).toBuffer();

    const response = await action_resolveAppointment(
      selectedAppointment.id,
      formData.feedback,
      blob
    );

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

  const handleResolveAppointment = async () => {
    setFeedbackSubmission(true);
  };

  const goBack = () => {
    setFeedbackSubmission(false);
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

      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);

          setFeedbackSubmission(false);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          {!feedbackSubmission && selectedAppointment && (
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
                <Separator />

                <div className="w-full flex justify-between">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />

                  <div className="flex w-full justify-center">
                    {selectedAppointment &&
                      selectedAppointment.uploadedFiles?.map(
                        (file: any, idx) => (
                          <Suspense
                            fallback={
                              <Skeleton className="h-[200px] w-[400px] rounded-lg bg-muted animate-pulse" />
                            }
                          >
                            {file.fileUrl ? (
                              <Image
                                src={file.fileUrl}
                                alt="Patient uploaded image"
                                key={idx}
                                width={400}
                                height={200}
                              />
                            ) : (
                              <p>No image provided</p>
                            )}
                          </Suspense>
                        )
                      )}
                  </div>
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
                <Button onClick={() => handleResolveAppointment()}>
                  Resolve Appointment
                </Button>
              </div>
            </>
          )}{" "}
          {feedbackSubmission && selectedAppointment ? (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  Please add feedback for the appointment below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onFormSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Feedback
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please enter feedback..."
                            className="min-h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="destructive" onClick={() => goBack()}>
                      Back
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientAppointments;
