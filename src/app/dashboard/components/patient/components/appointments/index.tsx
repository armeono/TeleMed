"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Divide, MoreVertical, PlusCircle } from "lucide-react";
import ScheduleModal from "./components/schedule-modal";
import { useState } from "react";

const PatientAppointments = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Card className="mnl,">
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
                    appointment.type === "Video Call" ? "secondary" : "outline"
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
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientAppointments;
