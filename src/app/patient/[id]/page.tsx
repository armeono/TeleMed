import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db_getPatientInfoById } from "@/server/data-access/patient";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: { id: string };
  };
};

export default async function PatientProfile({ params }: Props) {
  const patientId = Number(params.id);

  const patient: any = await db_getPatientInfoById(patientId);

  if (!patient) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patient Profile</h1>
        <Button variant="outline">
          <Phone className="mr-2 h-4 w-4" />
          Call Patient
        </Button>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder-avatar.jpg" alt={"User image"} />
                <AvatarFallback>
                  <div>
                    {patient.user.firstName.charAt(0)}
                    {patient.user.lastName.charAt(0)}
                  </div>
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-2">
                {patient.user.firstName + " " + patient.user.lastName}
              </h2>
              <p className="text-muted-foreground mb-4">
                Patient ID: {patient.medicalId}
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div>
                  <Label>Age</Label>
                  <p>12</p>
                </div>
                <div>
                  <Label>Gender</Label>
                  <p>{patient.gender ?? "OTHER"}</p>
                </div>
                <div>
                  <Label>Blood Type</Label>
                  <p>{patient.bloodType}</p>
                </div>
                <div>
                  <Label>Height</Label>
                  <p>{patient.height}</p>
                </div>
                <div>
                  <Label>Weight</Label>
                  <p>{patient.weight}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="w-full">
                <Label>Patient status</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant={
                      patient.status === "CRITICAL" ? "destructive" : "default"
                    }
                  >
                    {patient.status}
                  </Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="w-full">
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.allergies.map((allergy: string) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="w-full">
                <Label>Chronic Conditions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.chronicConditions.map((condition: string) => (
                    <Badge key={condition} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visits">
                <TabsList>
                  <TabsTrigger value="visits">Recent Visits</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="tests">Lab Tests</TabsTrigger>
                </TabsList>
                <TabsContent value="visits">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-05-15</TableCell>
                        <TableCell>Annual Check-up</TableCell>
                        <TableCell>Dr. Smith</TableCell>
                        <TableCell>
                          Patient reported feeling well. BP slightly elevated.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-03-02</TableCell>
                        <TableCell>Flu Symptoms</TableCell>
                        <TableCell>Dr. Johnson</TableCell>
                        <TableCell>Prescribed antivirals and rest.</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="medications">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Start Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Lisinopril</TableCell>
                        <TableCell>10mg</TableCell>
                        <TableCell>Once daily</TableCell>
                        <TableCell>2022-01-15</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Metformin</TableCell>
                        <TableCell>500mg</TableCell>
                        <TableCell>Twice daily</TableCell>
                        <TableCell>2022-03-10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="tests">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Blood Glucose</TableCell>
                        <TableCell>2023-05-15</TableCell>
                        <TableCell>126 mg/dL</TableCell>
                        <TableCell>
                          Slightly elevated, monitor closely
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cholesterol Panel</TableCell>
                        <TableCell>2023-05-15</TableCell>
                        <TableCell>Total: 180 mg/dL</TableCell>
                        <TableCell>Within normal range</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] mb-4">
                {[
                  {
                    id: 1,
                    sender: "Dr. Smith",
                    message: "How are you feeling today, Mr. Doe?",
                    time: "10:00 AM",
                  },
                  {
                    id: 2,
                    sender: "John Doe",
                    message:
                      "I'm feeling much better, thank you. The new medication seems to be helping.",
                    time: "10:05 AM",
                  },
                  {
                    id: 3,
                    sender: "Dr. Smith",
                    message:
                      "That's great to hear. Any side effects from the new medication?",
                    time: "10:07 AM",
                  },
                  {
                    id: 4,
                    sender: "John Doe",
                    message:
                      "No side effects so far. My blood pressure readings have been more stable.",
                    time: "10:10 AM",
                  },
                  {
                    id: 5,
                    sender: "Dr. Smith",
                    message:
                      "Excellent. Please continue to monitor and log your readings. We'll review them at your next appointment.",
                    time: "10:12 AM",
                  },
                ].map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.sender === "John Doe"
                        ? "items-end"
                        : "items-start"
                    } mb-4`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[80%] ${
                        message.sender === "John Doe"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        {message.sender}
                      </p>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.time}
                    </p>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Textarea
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
