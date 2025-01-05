"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, Edit2, Phone } from "lucide-react";
import { AppointmentHistory } from "./components/appointment-history";
import { PatientInfoForm } from "./components/patient-info-form";
import { redirect } from "next/navigation";

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  status: "ACTIVE" | "INACTIVE";
  allergies: string[];
  chronicConditions: string[];
}

type Props = {
  id: number;
  appointmentHistory: any[];
};

export default function PatientProfileClient({
  id,
  appointmentHistory,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [patientData, setPatientData] = useState<PatientData>({
    id: "123456",
    name: "Imran Cengic",
    age: 12,
    gender: "OTHER",
    bloodType: "NO_BLOOD_TYPE",
    height: "N/A",
    weight: "N/A",
    status: "ACTIVE",
    allergies: [],
    chronicConditions: [],
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center hover:cursor-pointer hover:opacity-90">
          <ChevronLeft
            className="size-6"
            onClick={() => {
              redirect("/dashboard");
            }}
          />
          <h1 className="text-3xl font-bold">Patient Profile</h1>
        </div>
        <Button variant="outline" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Patient Information</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">
                  {patientData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold">{patientData.name}</h2>
              <p className="text-sm text-muted-foreground">
                Patient ID: {patientData.id}
              </p>
            </div>

            {isEditing ? (
              <PatientInfoForm
                patientData={patientData}
                onSave={(data) => {
                  setPatientData(data);
                  setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Age</p>
                    <p>{patientData.age}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p>{patientData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Blood Type</p>
                    <p>{patientData.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Height</p>
                    <p>{patientData.height}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p>{patientData.weight}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Patient Status</p>
                  <Badge
                    variant={
                      patientData.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {patientData.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Allergies</p>
                  {patientData.allergies.length === 0 ? (
                    <Badge variant="secondary">NO_ALLERGIES</Badge>
                  ) : (
                    <div className="flex gap-2">
                      {patientData.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Chronic Conditions</p>
                  {patientData.chronicConditions.length === 0 ? (
                    <Badge variant="secondary">NO_CHRONIC_CONDITIONS</Badge>
                  ) : (
                    <div className="flex gap-2">
                      {patientData.chronicConditions.map((condition) => (
                        <Badge key={condition}>{condition}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="lab-tests">Lab Tests</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <AppointmentHistory appointmentHistory={appointmentHistory} />
              </TabsContent>
              <TabsContent value="medications">
                <div className="text-center py-8 text-muted-foreground">
                  No current medications
                </div>
              </TabsContent>
              <TabsContent value="lab-tests">
                <div className="text-center py-8 text-muted-foreground">
                  No recent lab tests
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
