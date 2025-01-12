"use client";

import * as React from "react";
import { addDays } from "date-fns";
import { Clock } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DoctorDto } from "@/server/dto/doctor";
import { useEffect, useState } from "react";
import { db_getDoctorAvailableAppointmentSlots } from "@/server/data-access/appointments";
import { action_scheduleAppointment } from "@/server/actions/appointments";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDoctors: DoctorDto[];
  patientId: number;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  availableDoctors,
  patientId,
}: ScheduleModalProps) {
  const [step, setStep] = React.useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedDoctor, setSelectedDoctor] = useState<string>();
  const [appointmentType, setAppointmentType] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const availableTimeSlots = await db_getDoctorAvailableAppointmentSlots(
          Number(selectedDoctor),
          selectedDate!
        );

        setAvailableTimeSlots(availableTimeSlots);
      } catch (error) {
        console.error("Failed to fetch available time slots:", error);
      }
    };

    if (selectedDoctor && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSchedule = async () => {
    setIsSubmitting(true);
    const response = await action_scheduleAppointment({
      patientId,
      doctorId: Number(selectedDoctor),
      date: selectedDate,
      time: selectedTime,
      reason: "Regular Checkup",
      type: appointmentType,
    });

    if (response.status === "error") {
      toast({
        title: "Failed to schedule appointment!",
        description: response.message,
      });
    } else {
      toast({
        title: "Successfully scheduled appointment!",
        description: response.message,
      });
    }

    router.refresh();

    onClose();
    setIsSubmitting(false);
  };

  return (
    <div>
      <DialogTitle className="font-bold text-xl">
        Schedule New Appointment
      </DialogTitle>

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
              {availableTimeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className="w-full"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {slot.time}
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
                      appointmentType === "ONLINE"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setAppointmentType("ONLINE")}
                  >
                    <RadioGroupItem value="ONLINE" id="ONLINE" />
                    <Label htmlFor="ONLINE" className="flex-1 cursor-pointer">
                      <div className="font-medium">Video Call</div>
                      <div className="text-sm text-muted-foreground">
                        Consult with your doctor through a secure video call
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                      appointmentType === "IN_PERSON"
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setAppointmentType("IN_PERSON")}
                  >
                    <RadioGroupItem value="IN_PERSON" id="IN_PERSON" />
                    <Label
                      htmlFor="IN_PERSON"
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
              (step === 4 && !appointmentType) ||
              isSubmitting
            }
          >
            {step === 4 ? "Schedule Appointment" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
