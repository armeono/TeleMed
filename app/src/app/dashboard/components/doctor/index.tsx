import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  ChevronRight,
  Clock,
  MessageSquare,
  MoreVertical,
  User,
} from "lucide-react";
import ProfilePopUp from "../profilePopUp";

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hello, Dr. Jane</h1>
        <ProfilePopUp />
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              2 video calls, 6 in-person
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 urgent, 4 regular</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Patient Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ScrollArea className="h-[300px] mt-4">
                  {[
                    {
                      id: 1,
                      name: "Frank Wilson",
                      status: "Stable",
                      lastVisit: "2023-05-15",
                    },
                    {
                      id: 2,
                      name: "Grace Lee",
                      status: "Critical",
                      lastVisit: "2023-05-14",
                    },
                    {
                      id: 3,
                      name: "Henry Davis",
                      status: "New",
                      lastVisit: "2023-05-13",
                    },
                    {
                      id: 4,
                      name: "Ivy Chen",
                      status: "Stable",
                      lastVisit: "2023-05-12",
                    },
                    {
                      id: 5,
                      name: "Jack Brown",
                      status: "Critical",
                      lastVisit: "2023-05-11",
                    },
                  ].map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between py-4 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-500">
                          Last visit: {patient.lastVisit}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            patient.status === "Critical"
                              ? "destructive"
                              : patient.status === "New"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {patient.status}
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="critical">
                <p className="text-sm text-gray-500 mt-4">
                  Showing critical patients...
                </p>
              </TabsContent>
              <TabsContent value="new">
                <p className="text-sm text-gray-500 mt-4">
                  Showing new patients...
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {[
                {
                  id: 1,
                  name: "Alice Johnson",
                  time: "10:00 AM",
                  type: "Video Call",
                },
                {
                  id: 2,
                  name: "Bob Smith",
                  time: "11:30 AM",
                  type: "In-person",
                },
                {
                  id: 3,
                  name: "Carol Williams",
                  time: "2:00 PM",
                  type: "Video Call",
                },
                {
                  id: 4,
                  name: "David Brown",
                  time: "3:30 PM",
                  type: "In-person",
                },
                {
                  id: 5,
                  name: "Eve Taylor",
                  time: "4:45 PM",
                  type: "In-person",
                },
              ].map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {appointment.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        appointment.type === "Video Call"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {appointment.type}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
