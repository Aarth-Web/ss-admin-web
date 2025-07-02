import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import {
  PlusIcon,
  UsersIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface Class {
  id: string;
  name: string;
  grade: string;
  subject: string;
  teacher: string;
  studentCount: number;
  schedule: string;
}

export const Classes: React.FC = () => {
  const [classes] = useState<Class[]>([
    {
      id: "1",
      name: "Mathematics A",
      grade: "10",
      subject: "Mathematics",
      teacher: "Mr. Johnson",
      studentCount: 28,
      schedule: "Mon, Wed, Fri - 9:00 AM",
    },
    {
      id: "2",
      name: "Science Lab",
      grade: "9",
      subject: "Science",
      teacher: "Ms. Smith",
      studentCount: 24,
      schedule: "Tue, Thu - 10:15 AM",
    },
    {
      id: "3",
      name: "English Literature",
      grade: "11",
      subject: "English",
      teacher: "Mrs. Davis",
      studentCount: 32,
      schedule: "Mon, Wed, Fri - 11:30 AM",
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {classItem.name}
              </h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Grade {classItem.grade}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                <span>{classItem.subject}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>{classItem.studentCount} students</span>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Teacher:</strong> {classItem.teacher}
              </div>

              <div className="text-sm text-gray-600">
                <strong>Schedule:</strong> {classItem.schedule}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
