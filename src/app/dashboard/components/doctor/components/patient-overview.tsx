import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db_getPatientsByDoctorId } from "@/server/data-access/patient";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import PatientOverviewRow from "./patient-overview-row";

type Props = {
  doctorId: number;
};

const PatientOverview = async ({ doctorId }: Props) => {
  const patients = await db_getPatientsByDoctorId(doctorId);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Patient Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ALL">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="CRITICAL">Critical</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
          </TabsList>
          <TabsContent value="ALL">
            <ScrollArea className="h-[300px] mt-4">
              <PatientOverviewRow patients={patients} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="CRITICAL">
            <ScrollArea className="h-[300px] mt-4">
              <PatientOverviewRow
                patients={patients.filter(
                  (patient) => patient.status === "CRITICAL"
                )}
              />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="ACTIVE">
            <ScrollArea className="h-[300px] mt-4">
              <PatientOverviewRow
                patients={patients.filter(
                  (patient) => patient.status === "ACTIVE"
                )}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PatientOverview;
