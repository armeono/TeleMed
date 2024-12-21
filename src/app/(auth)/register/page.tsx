"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Stethoscope } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { action_register } from "@/server/auth/register";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

const baseSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format.",
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Please select a gender.",
  }),
  area: z.enum([
    "UNSKO_SANSKI",
    "POSAVSKI",
    "TUZLANSKI",
    "ZENICKO_DOBOJSKI",
    "BOSANSKO_PODRINJSKI",
    "SREDNJOBOSANSKI",
    "HERCEGOVACKO_NERETVANSKI",
    "ZAPADNOHERCEGOVACKI",
    "SARAJEVO",
    "CANTON_10",
    
  ],
{
    required_error: "Please select an area.",}),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
});

const patientSchema = baseSchema.extend({
  medicalId: z.string().min(6),
  role: z.literal("PATIENT"),
});

const doctorSchema = baseSchema.extend({
  licenseNumber: z.string().min(6),
  role: z.literal("DOCTOR"),
});

const formSchema = z.discriminatedUnion("role", [patientSchema, doctorSchema]);

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      gender: undefined,
      role: "PATIENT",
      area: "SARAJEVO",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await action_register(values);

    if (response!.status === "success") {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
        duration: 5000,
      });

      redirect("/login");
    } else {
      toast({
        title: "Registration Failed",
        description: "An error occurred while registering. Please try again.",
        duration: 5000,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex flex-col justify-center items-center">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-red-600 mr-2" />
            <CardTitle className="text-2xl font-bold">
              TeleMed Registration
            </CardTitle>
          </div>
          <CardDescription>
            Create your account to access TeleMed services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="PATIENT">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="PATIENT"
                onClick={() => {
                  form.setValue("role", "PATIENT");
                }}
              >
                Patient
              </TabsTrigger>
              <TabsTrigger
                value="DOCTOR"
                onClick={() => {
                  form.setValue("role", "DOCTOR");
                }}
              >
                Doctor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="PATIENT">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UNSKO_SANSKI">
                              Unsko Sanski
                            </SelectItem>
                            <SelectItem value="POSAVSKI">Posavski</SelectItem>
                            <SelectItem value="TUZLANSKI">Tuzlanski</SelectItem>
                            <SelectItem value="ZENICKO_DOBOJSKI">
                              Zenicko Dobojksi
                            </SelectItem>
                            <SelectItem value="BOSANSKO_PODRINJSKI">
                              Bosansko Podrinjski
                            </SelectItem>
                            <SelectItem value="SREDNJOBOSANSKI">
                              Srednjobosanski
                            </SelectItem>
                            <SelectItem value="HERCEGOVACKO_NERETVANSKI">
                              Hercegovacko Neretvanski
                            </SelectItem>
                            <SelectItem value="ZAPADNOHERCEGOVACKI">
                              Zapadnohercegovacki
                            </SelectItem>
                            <SelectItem value="SARAJEVO">Sarajevo</SelectItem>
                            <SelectItem value="CANTON_10">Canton 10</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical ID</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Medical ID"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Register
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="DOCTOR">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                                    <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UNSKO_SANSKI">
                              Unsko Sanski
                            </SelectItem>
                            <SelectItem value="POSAVSKI">Posavski</SelectItem>
                            <SelectItem value="TUZLANSKI">Tuzlanski</SelectItem>
                            <SelectItem value="ZENICKO_DOBOJSKI">
                              Zenicko Dobojksi
                            </SelectItem>
                            <SelectItem value="BOSANSKO_PODRINJSKI">
                              Bosansko Podrinjski
                            </SelectItem>
                            <SelectItem value="SREDNJOBOSANSKI">
                              Srednjobosanski
                            </SelectItem>
                            <SelectItem value="HERCEGOVACKO_NERETVANSKI">
                              Hercegovacko Neretvanski
                            </SelectItem>
                            <SelectItem value="ZAPADNOHERCEGOVACKI">
                              Zapadnohercegovacki
                            </SelectItem>
                            <SelectItem value="SARAJEVO">Sarajevo</SelectItem>
                            <SelectItem value="CANTON_10">Canton 10</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License number</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Your license number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Register
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
