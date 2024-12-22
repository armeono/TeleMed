"use client";

import * as React from "react";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorDto } from "@/server/dto/doctor";

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
];

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDoctors: DoctorDto[];
}

export default function ScheduleModal({
  isOpen,
  onClose,
  availableDoctors,
}: ScheduleModalProps) {
  const [step, setStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState<string>();
  const [selectedDoctor, setSelectedDoctor] = React.useState<string>();
  const [appointmentType, setAppointmentType] = React.useState<string>();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSchedule = () => {
    // Implement scheduling logic here
    console.log({
      date: selectedDate,
      time: selectedTime,
      doctor: selectedDoctor,
      type: appointmentType,
    });
    onClose();
  };

  return (
    <div>
      <h1 className="font-bold text-xl">Schedule New Appointment</h1>

      <p className="text-gray-700 ">
        {step === 1 && "Select your preferred doctor for the appointment."}
        {step === 2 && "Choose a date for your appointment."}
        {step === 3 && "Select an available time slot."}
        {step === 4 && "Choose the type of appointment."}
      </p>

      <div className="space-y-6 py-4">
        {/* Step indicators */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full ${
                s === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {availableDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedDoctor === String(doctor.id)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedDoctor(String(doctor.id))}
                >
                  <Avatar className="h-12 w-12">
                    {/* <AvatarImage src={doctor.avatar} alt={doctor.name} /> */}
                    <AvatarFallback>
                      {doctor.user.firstName.charAt(0) +
                        doctor.user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {"Dr. " +
                        doctor.user.firstName +
                        " " +
                        doctor.user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Available: Monday, Tuesday
                    </p>
                  </div>
                  <RadioGroup value={selectedDoctor}>
                    <RadioGroupItem value={String(doctor.id)} />
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div className="space-y-4 flex justify-center items-center">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) =>
                date < new Date() || date > addDays(new Date(), 30)
              }
              className="rounded-md border"
            />
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedTime(time)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Appointment Type */}
        {step === 4 && (
          <div className="space-y-4">
            <RadioGroup
              value={appointmentType}
              onValueChange={setAppointmentType}
            >
              <div className="flex flex-col space-y-3">
                <Label
                  htmlFor="appointment-type"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select appointment type
                </Label>
                <div className="grid gap-4">
                  <div
                    className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                      appointmentType === "video"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setAppointmentType("video")}
                  >
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video" className="flex-1 cursor-pointer">
                      <div className="font-medium">Video Call</div>
                      <div className="text-sm text-muted-foreground">
                        Consult with your doctor through a secure video call
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                      appointmentType === "in-person"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setAppointmentType("in-person")}
                  >
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label
                      htmlFor="in-person"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">In-Person Visit</div>
                      <div className="text-sm text-muted-foreground">
                        Visit the clinic for a face-to-face consultation
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          <Button
            onClick={step === 4 ? handleSchedule : handleNext}
            disabled={
              (step === 1 && !selectedDoctor) ||
              (step === 2 && !selectedDate) ||
              (step === 3 && !selectedTime) ||
              (step === 4 && !appointmentType)
            }
          >
            {step === 4 ? "Schedule Appointment" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
