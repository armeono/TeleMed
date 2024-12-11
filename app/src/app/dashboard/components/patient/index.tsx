import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Calendar,
  FileText,
  MoreVertical,
  PlusCircle,
  Send,
  User,
  VideoIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDB } from "@/server/data-access/user/types";
import ProfilePopUp from "../profilePopUp";

type Props = {
  user: UserDB;
};

export default function PatientDashboard({ user }: Props) {
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {[
                {
                  id: 1,
                  doctor: "Dr. Smith",
                  date: "May 28, 2023",
                  time: "10:00 AM",
                  type: "Video Call",
                },
                {
                  id: 2,
                  doctor: "Dr. Johnson",
                  date: "June 5, 2023",
                  time: "2:30 PM",
                  type: "In-person",
                },
                {
                  id: 3,
                  doctor: "Dr. Williams",
                  date: "June 15, 2023",
                  time: "11:15 AM",
                  type: "Video Call",
                },
              ].map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.date} at {appointment.time}
                    </p>
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
            <Button className="w-full mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat with Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4">
              {[
                {
                  id: 1,
                  sender: "Dr. Smith",
                  message: "How are you feeling today?",
                  time: "10:00 AM",
                },
                {
                  id: 2,
                  sender: "You",
                  message: "I'm feeling much better, thank you.",
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
                  sender: "You",
                  message: "No side effects so far.",
                  time: "10:10 AM",
                },
              ].map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.sender === "You" ? "items-end" : "items-start"
                  } mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.sender === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
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
  );
}
