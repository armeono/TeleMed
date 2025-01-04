import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, FileText, Send, User, VideoIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UserDB } from "@/server/data-access/user/types";
import ProfilePopUp from "../profilePopUp";
import PatientAppointments from "./components/appointments";
import { db_getPatientInfoByUserId } from "@/server/data-access/patient";
import {
  db_getDoctorAvailableAppointmentSlots,
  db_getPatientAppointments,
} from "@/server/data-access/appointments";
import { db_getAvailableDoctors } from "@/server/data-access/doctor";
import { redirect } from "next/navigation";
import Chat from "@/app/chat/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type Props = {
  user: UserDB;
};

export default async function PatientDashboard({ user }: Props) {
  const patient = await db_getPatientInfoByUserId(user.id);

  if (!patient) redirect("/login");

  const appointments = await db_getPatientAppointments(patient.id);

  const availableDoctors = await db_getAvailableDoctors();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hello, {user.firstName}</h1>
        <ProfilePopUp />
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Appointment
            </CardTitle>
            <VideoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">May 28, 2023</div>
            <p className="text-xs text-muted-foreground">
              10:00 AM with Dr. Smith
            </p>
            <Badge className="mt-2" variant="secondary">
              Video Call
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Tests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-2">
              Blood work (June 5), X-ray (June 10)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prescription Refills
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-2">
              Lisinopril due for refill on June 1
            </p>
          </CardContent>
        </Card>

        <PatientAppointments
          appointments={appointments}
          availableDoctors={availableDoctors}
          patientId={patient.id}
        />

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Chat with Doctor</CardTitle>
          </CardHeader>
          <Separator />
          <Tabs
            defaultValue={String(availableDoctors[0].id)}
            className="pt-4 w-full flex flex-col justify-center items-center"
          >
            <TabsList>
              {availableDoctors.map((availableDoctor) => (
                <TabsTrigger
                  value={String(availableDoctor.id)}
                  key={availableDoctor.id}
                >
                  {"Dr. " + availableDoctor.user.firstName}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableDoctors.map((availableDoctor) => (
              <TabsContent
                value={String(availableDoctor.id)}
                className="w-full"
                key={availableDoctor.id}
              >
                <Chat
                  senderId={patient.user.id}
                  recipientId={availableDoctor.user.id}
                />
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
