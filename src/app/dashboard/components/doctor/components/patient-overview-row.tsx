import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  patients: any;
};
const PatientOverviewRow = ({ patients }: Props) => {
  console.log(patients);
  return (
    <div>
      {patients.map((patient: any) => (
        <Link
          href={`/patient/${patient.id}`}
          key={patient.id}
          className="flex items-center justify-between py-4 border-b last:border-0"
        >
          <div>
            <div className="flex gap-2 items-center">
              <p className="font-medium">{patient.user.firstName}</p>
              <p className="font-medium">{patient.user.lastName}</p>
            </div>
            <p className="text-sm text-gray-500">
              Last visit: {patient.createdAt}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                patient.status === "CRITICAL"
                  ? "destructive"
                  : patient.status === "ACTIVE"
                  ? "secondary"
                  : "outline"
              }
            >
              {patient.status}
            </Badge>
            <div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PatientOverviewRow;
